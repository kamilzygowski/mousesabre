import { ENEMYLV1, PLAYER, TRAIL } from "./constants";

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
    speed?: number;
}

const canvas: HTMLElement = document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
const background = new Image();
background.src = 'https://i.postimg.cc/rwnx5kTk/City3.png';

let interval: number = 0;
const enemies: Array<Object> = [];
const trailsArray = new Array;
let previousPlayerX: number, previousPlayerY: number;
let trailImg: string = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
let trailPosX: number, trailPosY: number, trailWidth: number, trailHeight: number;

ctx.fillStyle = '#c7ecee';

const spawnRateStages:Array<number> = [
    384, // 1 enemies on screen
    192, // 2 enemies on screen
    96, // 4 enemies on screen
    48, // 8 enemies on screen
    24, // 16 enemies on screen
    12, // 32 enemies on screen
    6, // 64 enemies on screen
    3 // 128 enemies on screen
]
let spawnRate:number = 0;
const playerCursor: Cursor = {
    img: new Image(),
    width: 40,
    height: 40,
    x: 0,
    y: 0,
}
playerCursor.img.src = PLAYER.imgEast;

/**
 * Functions
 */
const nextFrameBegin = (): void => {
    ctx.drawImage(background, 0, 0, canvas.clientWidth, canvas.clientHeight);

}

const collision = (cursor: any, enemy: any): number => {
    const dx: number = cursor.x - enemy.x;
    const dy: number = cursor.y - enemy.y;

    const distance: number = Math.sqrt(dx * dx + dy * dy);
    return distance;
}

const drawAnim = (x: number, y: number, width: number, height: number, src: string, framesNumber: number): void => {
    let image: HTMLImageElement = new Image();
    image.src = src;
    const thisFrame: number = Math.round(interval % (framesNumber * 10) / 10)
    ctx.drawImage(image, width * thisFrame, 0, width, height, x, y, width, height);
}
/**
 * Canvas Rendering
 */
const gameRender: NodeJS.Timer = setInterval((): void => {
    nextFrameBegin();

    // Setup animations on every position change
    onmousemove = (e: MouseEvent): void => {
        if (e.clientX < previousPlayerX) {
            playerCursor.img.src = PLAYER.imgWest;
            trailImg = 'https://i.postimg.cc/GmCTYmVV/blue-Trail-Left.png';
            trailPosX = -38.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;

        } else if (e.clientX > previousPlayerX) {
            playerCursor.img.src = PLAYER.imgEast;
            trailImg = 'https://i.postimg.cc/QdJ9qrrt/blue-Trail-Right.png';
            trailPosX = 100.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        } else {
            playerCursor.img.src = PLAYER.imgNorth;
            trailImg = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
            trailPosX = -14;
            trailPosY = 60;
            trailWidth = 20;
            trailHeight = 53;
        }
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
        // Saving previous mouse pos for above position checking
        previousPlayerX = e.clientX;
        previousPlayerY = e.clientY;
    }
    interval++;
 
    console.log(interval/1000);
    if(interval/1000 > 0){
        spawnRate =spawnRateStages[0];
    }else if (interval/1000 > 2){
        spawnRate =spawnRateStages[1];
    } else if (interval/1000 > 4){
        spawnRate =spawnRateStages[2];
    } else if (interval/1000 > 6){
        spawnRate =spawnRateStages[6];
    }
    if (interval % spawnRate === 3) {
        // Defining every enemy of this type
        const enemyLv1: Enemy = {
            img: new Image(),
            width: ENEMYLV1.width,
            height: ENEMYLV1.height,
            x: Math.floor((Math.random() * window.innerWidth + 50) - 25), // -n +n makes enemies don't appear outside or semi outside of screen
            y: ENEMYLV1.y,
            speed: ENEMYLV1.speed
        }
        enemyLv1.img.src = ENEMYLV1.img;
        enemies.push(enemyLv1);
        console.log(enemies)
    }
    enemies.forEach((element: any) => {
        ctx.drawImage(element.img, element.x, element.y, element.width, element.height);
        element.y += element.speed;

        // Enemy arrived to it's destination
        if (element.y >= window.innerHeight) {
            const index: number = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        // If enemy collides with cursor
        if (collision(playerCursor, element) <= element.width + element.height / 8) {
            const index: number = enemies.indexOf(element);
            enemies.splice(index, 1);
        };
    });

    /**
     * Trail
     */
    const trail = {
        img: new Image(),
        x: playerCursor.x,
        y: playerCursor.y,
        width: TRAIL.width,
        height: TRAIL.height,
    }
    trail.img.src = TRAIL.img;
    trailsArray.push(trail)
    trailsArray.forEach(element => {
        drawAnim(element.x - trailPosX, element.y - trailPosY, trailWidth, trailHeight, trailImg, 7);
    })
    if (interval % 23 === 1 || interval % 23 === 2) {
        trailsArray.forEach((element) => {
            const index: number = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        })
    }
    // Drawing player
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
}, 1000 / 120);