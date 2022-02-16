import { AITELEPORTIMG, BACKGROUND, ENEMYLV1, HPIMG, PLAYER, TRAIL } from "./constants";
import { collision } from "./utils";

interface Cursor {
    img: HTMLImageElement;
    readonly width: number;
    readonly height: number;
    x?: number;
    y?: number;
}
interface Enemy {
    img: HTMLImageElement;
    width: number;
    height: number;
    x: number;
    y: number;
    speed: number;
    radius: number;
    mutation?: number;
}
interface Trail {
    img: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
}

let canvas: any;
let ctx: CanvasRenderingContext2D;
const background = new Image();
let healthLeft: number = 5;
let grid:Array<[]> = [];

const sideTile:HTMLImageElement = new Image();
sideTile.src = 'https://i.postimg.cc/G3ZSzHdd/sideTile.png';
const bottomTile:HTMLImageElement = new Image();
bottomTile.src = 'https://i.postimg.cc/gk7R3ZWH/bottom-Tile.png';

// Helpers variables
let correctPositionX = 0;
let correctPositionY = 0;
let interval: number = 0;
let previousPlayerX: number, previousPlayerY: number;

const enemies: Array<Object> = [];
const trailsArray = new Array;

let trailImg: string = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
let trailPosX: number, trailPosY: number, trailWidth: number, trailHeight: number;
const trailLeftBehind: HTMLImageElement = new Image();
trailLeftBehind.src = 'https://i.postimg.cc/C1KJC87K/TEST20-X20circle.png';

const spawnRateStages: Array<number> = [
    384, // 1 enemies on screen
    192, // 2 enemies on screen
    96, // 4 enemies on screen
    48, // 8 enemies on screen
    24, // 16 enemies on screen
    12, // 32 enemies on screen
    6, // 64 enemies on screen
    3 // 128 enemies on screen
]
let spawnRate: number = 1;
// Create a data instance for our player
const playerCursor: Cursor = {
    img: new Image(),
    width: 40,
    height: 40,
    // x and y basic state is -100 to not render image on canvas
    x: -100,
    y: -100,
}
playerCursor.img.src = PLAYER.imgEast;

/**
 * Functions
 */
const nextFrameBegin = (): void => {
    ctx.drawImage(background, 0, 0, canvas.clientWidth, canvas.clientHeight);
}

const AiMoveAway = (player: Cursor, creature: Enemy, speed: number): void => {
    if (player.x > creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x -= speed;
    } else if (player.x < creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x += speed;
    }
}
const AiCirlce = (creature: Enemy): void => {
    //
    setTimeout(() => {
        creature.x = 170 * Math.sin(interval / 100)
        creature.y = 170 * Math.cos(interval / 100)
    }, 500);
}

const AiClone = (creature: Enemy): void => {
    // 60% chance every sec to spawn copy
    if (Math.floor(Math.random() * 200) === 1) {
        let clone: Enemy = Object.create(creature)
        // Randomly spawn copies on the random x axis positions of clone parent
        if (Math.round(Math.random() + 1) === 2 && creature.x < window.innerWidth - 90) {
            clone.x += Math.round(Math.random() * 30) + 25;
            enemies.push(clone);
        } else if (Math.round(Math.random() + 1) === 1 && creature.x > 90) {
            clone.x -= Math.round(Math.random() * 30) + 25;
            enemies.push(clone);
        }
    }
}

const AiTeleport = (player: Cursor, creature: Enemy): void => {
    if (player.x > creature.x && Math.abs(player.x - creature.x) < 50 && creature.x < window.innerWidth - 60 && creature.x > 0 ||
        player.x < creature.x && Math.abs(player.x - creature.x) < 50 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        const randomRange: number = Math.round(Math.random() * 400) - 200;
        creature.x += randomRange;
        const animate: NodeJS.Timer = setInterval(() => {
            drawAnim(creature.x - 10, creature.y - 10, 128, 128, AITELEPORTIMG, 8)
        }, 1000 / 120)
        setTimeout(() => {
            clearInterval(animate);
        }, 450);
    }
}

const AiRushDown = (creature: Enemy, speed: number) => {
    drawAnim(creature.x, creature.y - 160, 128, 256, 'https://i.postimg.cc/pXVV7Hhy/rushdown.png', 4)
    setTimeout(() => {
        creature.y += speed;
    }, 1500);
}

const drawAnim = (x: number, y: number, width: number, height: number, src: string, framesNumber: number): void => {
    let image: HTMLImageElement = new Image();
    image.src = src;
    const thisFrame: number = Math.round(interval % (framesNumber * 10) / 10)
    ctx.drawImage(image, width * thisFrame, 0, width, height, x, y, width, height);
}

export const startGame = ():void => {
    document.body.classList.add('hideCursor');
}

const gameOver = ():void => {
    clearInterval(gameRender);
    document.body.classList.remove('hideCursor');
}

export const initGameState = ():void => {
    canvas = document.getElementById('canvas');
    //canvas.classList.remove('hideCanvas');
    ctx = canvas.getContext('2d');
    // Make gamelook a bitsmaller on screen width > 1600
    // -> for later window.innerWidth > 1600 ? canvas.width = window.innerWidth - 255: canvas.width = window.innerWidth - 5;
    canvas.width = window.innerWidth - 5;
    canvas.height = window.innerHeight - 5;
    background.src = BACKGROUND;  
}

/**
 * Canvas Rendering
 */
const gameRender: NodeJS.Timer = setInterval((): void => {
    nextFrameBegin();

    paintGreed(32);

    if (healthLeft < 1) {
        gameOver();
    }

    // Interface player health info
    ctx.fillStyle = '#b71540';
    ctx.font = 'normal small-caps bold 48px serif';
    drawAnim(50, 50, 64, 64, HPIMG, 5)
    ctx.fillText(` x${healthLeft}`, 50 + 64, 50 + 48);

    // Setup animations on every position change

    onmousemove = (e: MouseEvent): void => {
        if (e.clientX < previousPlayerX && e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgWest;
            trailImg = 'https://i.postimg.cc/GmCTYmVV/blue-Trail-Left.png';
            trailPosX = -38.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
            correctPositionX = 20;
            correctPositionY = 0;

        } else if (e.clientX > previousPlayerX && e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgEast;
            trailImg = 'https://i.postimg.cc/QdJ9qrrt/blue-Trail-Right.png';
            trailPosX = 100.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
            correctPositionX = 40;
            correctPositionY = 0;
        } else if (e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgNorth;
            trailImg = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
            trailPosX = -16;
            trailPosY = 50;
            trailWidth = 20;
            trailHeight = 53;
            correctPositionX = 0;
            correctPositionY = 20;
        }
        // Update player position info
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
        // Saving previous mouse pos for above position checking
        previousPlayerX = e.clientX;
        previousPlayerY = e.clientY;
    }

    interval++;

    // Set enemies spawn speed by a certain amount of time
    if (interval / 1000 > 0) {
        spawnRate = spawnRateStages[1];
    } else if (interval / 1000 > 2) {
        spawnRate = spawnRateStages[2];
    } else if (interval / 1000 > 4) {
        spawnRate = spawnRateStages[3];
    } else if (interval / 1000 > 6) {
        spawnRate = spawnRateStages[6];
    }
    if (interval % spawnRate === 3) {
        // Defining every enemy of this type
        const enemyLv1: Enemy = {
            img: new Image(),
            width: ENEMYLV1.width,
            height: ENEMYLV1.height,
            x: Math.floor((Math.random() * window.innerWidth + 50) - 25), // -n +n makes enemies don't appear outside or semi outside of screen
            y: ENEMYLV1.y,
            speed: ENEMYLV1.speed,
            radius: ENEMYLV1.radius,
            mutation: Math.floor(Math.random() * 4) + 1,
        }
        enemyLv1.img.src = ENEMYLV1.img;
        enemies.push(enemyLv1);
    }
    enemies.forEach((element: Enemy) => {
        // Apply logic to enemy
        switch (element.mutation) {
            case 1: AiMoveAway(playerCursor, element, 5);
                break;
            case 2: AiClone(element);
                break;
            case 3: AiTeleport(playerCursor, element);
                break;
            case 4: AiRushDown(element, 20);
                break;
        }
        ctx.drawImage(element.img, element.x, element.y, element.width, element.height);
        element.y += element.speed;
        // Enemy arrived to it's destination
        if (element.y >= window.innerHeight) {
            const index: number = enemies.indexOf(element);
            enemies.splice(index, 1);
            // Don't count enemies who are out screen
            if(element.x > 0 && element.x < window.innerWidth)
            healthLeft--;
        }
        // If enemy collides with cursor
        if (collision(playerCursor, element) <= element.radius / 2) {
            const index: number = enemies.indexOf(element);
            enemies.splice(index, 1);
        };
    });
    /**
     * Sword trail
     */
    const trail:Trail = {
        img: new Image(),
        x: playerCursor.x,
        y: playerCursor.y,
        width: TRAIL.width,
        height: TRAIL.height,
    }
    trail.img.src = TRAIL.img;
    trailsArray.push(trail);
    trailsArray.forEach(element => {
        const getPosX: number = element.x - trailPosX;
        const getPosY: number = element.y - trailPosY;
        ctx.drawImage(trailLeftBehind, getPosX + correctPositionX, getPosY + correctPositionY, 20, 20)
    })
    if (interval % 23 === 1 || interval % 23 === 2) {
        trailsArray.forEach((element) => {
            const index: number = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        })
    }
    // Drawn anim on top of the sword
    drawAnim(trail.x - trailPosX, trail.y - trailPosY, trailWidth, trailHeight, trailImg, 7);
    // Drawing player
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
}, 1000 / 60);

const createGrid = (sqmSize:number):void => {
    let width:number = window.innerWidth;
    let height:number = window.innerHeight;
    let gridX = Math.ceil(width/sqmSize);
    let gridY = Math.ceil(height/sqmSize);

    for(let i = 0; i < gridY; i++){
        const newRow:Array<number> = Array.from(Array(gridX))
        for(let y = 0; y < newRow.length; y++){
            newRow[y] = 0;
        }
        grid.push(newRow)
    }

    console.log(grid)

}

createGrid(32);

const paintGreed = (sqmSize:number):void => {
    grid.forEach((element, index)=> {
        element.forEach((elem, id)=>{
            //ctx.rect(sqmSize*id, sqmSize * index, sqmSize, sqmSize)
            //ctx.stroke()    

            // Make barriers on left and right
            if(id ===0 || id === element.length - 1){
                ctx.drawImage(sideTile, sqmSize*id, sqmSize * index)
            }
            if(index === grid.length-2){
                ctx.drawImage(bottomTile, sqmSize*id, sqmSize * index)
            }
        })
    })
}

// Jak cos wezmiesz to zatrzymuje sie czas (ekran robi sie szart) i wtedy musisz narysowac wzor na ekranie, ktory po chwili  zamieni sie w kozacki wzor