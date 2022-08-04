import { BACKGROUND, BACKGROUND_SLOWMOTION, ENEMYLV1, ENEMY_AI_RUSHDOWN, ENEMY_AI_TELEPORT, HPIMG, PLAYER, TAILS_BOTTOM, TAILS_SIDE, TRAIL } from "./constants";
import { bubbleSort, collision, createGrid } from "./utils";
import { postHighscoreWindow } from './menu';
import { data } from "./dbconnection";
import { boss_LadyBug, ladyBug } from "./bosses";
export interface Cursor {
    img: HTMLImageElement;
    hp: number;
    readonly width: number;
    readonly height: number;
    x?: number;
    y?: number;
}
interface Enemy {
    img?: HTMLImageElement;
    width?: number;
    height?: number;
    x: number;
    y: number;
    speed?: number;
    radius?: number;
    mutation?: number;
    mutation2?: number;
    src?: string;
}
interface Trail {
    img?: HTMLImageElement;
    x: number;
    y: number;
    width?: number;
    height?: number;
}
type Positions = {
    x: number,
    y: number,
}
// VERY IMPORTANT VARIABLES
let canvas: any;
let ctx: CanvasRenderingContext2D;
let gameOverHTMLState: any;
let score: number = 0;
let grid: Array<[]> = [];
const enemiesLv1: Enemy[] = [];
const enemiesLv2: Enemy[] = [];
const trailsArray = new Array;
const MAIN_URL: string = location.href;
let isSlowMotion: boolean = false;
// IMAGES AND IMAGES SRC
const background: HTMLImageElement = new Image();
const sideTile: HTMLImageElement = new Image();
sideTile.src = TAILS_SIDE;
const bottomTile: HTMLImageElement = new Image();
bottomTile.src = TAILS_BOTTOM;
const backgroundTile: HTMLImageElement = new Image();
backgroundTile.src = 'https://i.postimg.cc/VNpQPw38/bckg.png';
let trailPosX: number, trailPosY: number, trailWidth: number, trailHeight: number;
const trailLeftBehind: HTMLImageElement = new Image();
trailLeftBehind.src = 'https://i.postimg.cc/C1KJC87K/TEST20-X20circle.png';
// HELPERS VARIABLES
let interval: number = 0;
let previousPlayerX: number, previousPlayerY: number;
let samuraiSkillPosArr: Positions[] = [];
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
    hp: 25,
    width: 40,
    height: 40,
    // x and y basic state is -100 to not render image on canvas at the game start
    x: -100,
    y: -100,
}
playerCursor.img.src = PLAYER.imgEast;
/*****************************************************
 Functions
 *****************************************************/
const nextFrameBegin = (): void => {
    ctx.drawImage(background, 0, 0, canvas.clientWidth, canvas.clientHeight);
}
export const initGameState = (): void => {
    document.body.classList.add('hideCursor');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    // Make gamelook a bitsmaller on screen width > 1600
    // -> for later window.innerWidth > 1600 ? canvas.width = window.innerWidth - 255: canvas.width = window.innerWidth - 5;
    canvas.width = window.innerWidth - 5;
    canvas.height = window.innerHeight - 5;
    background.src = BACKGROUND;
    createGrid(32, grid);
    // IN GAME EVENT LISTENERS
    // Attach right mouse click skill
    canvas.addEventListener('contextmenu', (e: MouseEvent): void => {
        playerSkill_SamuraiSlash();
        // This is on last position because we don't want browser option menu to pop up and if preventDefault() is on the beggining of func -> it doesn't work then
        e.preventDefault();
    })
}
const drawAnim = (x: number, y: number, width: number, height: number, src: string, framesNumber: number): void => {
    let image: HTMLImageElement = new Image();
    image.src = src;
    const thisFrame: number = Math.round(interval % ((framesNumber - 1) * 10) / 10)
    ctx.drawImage(image, width * thisFrame, 0, width, height, x, y, width, height);
}
const gameOver = (): void => {
    gameOverHTMLState = document.body.innerHTML;
    clearInterval(gameRender);
    console.log(gameOverHTMLState)
    document.body.classList.remove('hideCursor');
    document.body.innerHTML = '';
    const gameOverTag: HTMLElement = document.createElement('h1');
    gameOverTag.textContent = 'GAME OVER';
    gameOverTag.classList.add('gameOverText');
    canvas.style = 'display:none;'
    document.body.appendChild(gameOverTag);
    const menuButton: HTMLButtonElement = document.createElement('button');
    menuButton.textContent = 'Main Menu';
    menuButton.classList.add('menuButton');
    document.body.appendChild(menuButton);
    const replayButton: HTMLButtonElement = document.createElement('button');
    replayButton.textContent = 'Replay';
    replayButton.classList.add('replayButton');
    document.body.appendChild(replayButton);

    const arrOfScores: number[] = [];
    data !== undefined ? data.forEach(element => {
        arrOfScores.push(element.score)
    }) : null;
    // On button click reload page to the first locationUrl (to the main menu)
    menuButton.addEventListener('click', (): void => {
        location.href = MAIN_URL;
    })
    replayButton.addEventListener('click', (): void => {
        clearInterval(gameRender);
      //  document.body.innerHTML = gameOverHTMLState;
      document.body.innerHTML = '';
        document.body.classList.add('hideCursor');
        const canv = document.createElement('canvas');
        document.body.appendChild(canv)
        ctx = canv.getContext('2d');
        canv.id = 'canvas';
      
        canv.width = window.innerWidth - 5;
    canv.height = window.innerHeight - 5;
    background.src = BACKGROUND;
    createGrid(32, grid);
    // IN GAME EVENT LISTENERS
    // Attach right mouse click skill
    canv.addEventListener('contextmenu', (e: MouseEvent): void => {
        playerSkill_SamuraiSlash();
        // This is on last position because we don't want browser option menu to pop up and if preventDefault() is on the beggining of func -> it doesn't work then
        e.preventDefault();
    })
        setInterval(() => {
            ctx ? gameRendering() : null;
        }, 1000 / 60)
    })
    const sortedScores = bubbleSort(arrOfScores, false);
    for (let i = 0; i < 5; i++) {
        if (score > sortedScores[i]) {
            postHighscoreWindow(score);
            return;
        }
    }
}
const Ai_MoveAway = (player: Cursor, creature: Enemy, speed: number): void => {
    if (!isSlowMotion) {
        if (player.x > creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
            creature.x -= speed * 3;
        } else if (player.x < creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
            creature.x += speed * 3;
        }
    }
}
const AiCirlce = (creature: Enemy): void => {
    //
    setTimeout(() => {
        creature.x = 170 * Math.sin(interval / 100)
        creature.y = 170 * Math.cos(interval / 100)
    }, 500);
}
const Ai_Clone = (creature: Enemy, creatureLvl: Enemy[]): void => {
    // 45% chance every sec to spawn copy
    if (Math.floor(Math.random() * 75) === 1) {
        let clone: Enemy = Object.create(creature)
        // Randomly spawn copies on the random x axis positions of clone parent
        if (Math.round(Math.random() + 1) === 2 && creature.x < window.innerWidth - 90) {
            clone.x += Math.round(Math.random() * 30) + 35;
            creatureLvl.push(clone);
        } else if (Math.round(Math.random() + 1) === 1 && creature.x > 90) {
            clone.x -= Math.round(Math.random() * 30) + 35;
            creatureLvl.push(clone);
        }
    }
}
const Ai_Teleport = (player: Cursor, creature: Enemy): void => {
    if (!isSlowMotion) {
        if (player.x > creature.x && Math.abs(player.x - creature.x) < 50 && creature.x < window.innerWidth - 60 && creature.x > 0 ||
            player.x < creature.x && Math.abs(player.x - creature.x) < 50 && creature.x < window.innerWidth - 60 && creature.x > 0) {
            const randomRange: number = Math.round(Math.random() * 400) - 200;
            creature.x += randomRange;
            const animate: NodeJS.Timer = setInterval(() => {
                drawAnim(creature.x - 10, creature.y - 10, 128, 128, ENEMY_AI_TELEPORT, 8)
            }, 1000 / 120)
            setTimeout(() => {
                clearInterval(animate);
            }, 450);
        }
    }
}
const Ai_RushDown = (creature: Enemy, speed: number): void => {
    drawAnim(creature.x, creature.y - 65, 98, 130, ENEMY_AI_RUSHDOWN, 4)
    const argSpeedValue: number = speed;
    if (creature.y > window.innerHeight * 0.45) {
        if (isSlowMotion) {
            speed = 0.5;
        } else {
            speed = argSpeedValue;
        }
        creature.y += speed;
    }
}
const playerSkill_SamuraiSlash = (): void => {
    slowMotionMode(3.5);
    const skillHitbox: NodeJS.Timer = setInterval((): void => {
        ctx.beginPath();
        ctx.lineWidth = 10;
        samuraiSkillPosArr.forEach((element: Positions) => {
            ctx.lineTo(element.x, element.y);
        })
        ctx.stroke();
    }, 1000 / 60)
    switch (Math.floor(Math.random() * 3 + 1)) {
        case 1: ctx.strokeStyle = '#EE5A24';
            break;
        case 2: ctx.strokeStyle = '#9980FA';
            break;
        case 3: ctx.strokeStyle = '#1B1464';
            break;
    }
    setTimeout((): void => {
        // Clean info about previous SamuraiSlash positions
        samuraiSkillPosArr = [];
        clearInterval(skillHitbox);
    }, 4500);
}
const slowMotionMode = (seconds: number): void => {
    isSlowMotion = true;
    clearInterval(gameRender);
    gameRender = setInterval(gameRendering, 1000 / 12)
    background.src = BACKGROUND_SLOWMOTION;
    setTimeout((): void => {
        isSlowMotion = false;
        clearInterval(gameRender)
        background.src = BACKGROUND;
        gameRender = setInterval(gameRendering, 1000 / 60)
    }, seconds * 1000);
}
const paintGrid = (sqmSize: number): void => {
    grid.forEach((element: [], index: number): void => {
        element.forEach((elem: object, id: number): void => {
            // Below comments checks if every squaremeter got correct position
            //ctx.rect(sqmSize*id, sqmSize * index, sqmSize, sqmSize)
            //ctx.stroke()    
            // Make barriers on left and right
            if (id === 0 || id === element.length - 1) {
                ctx.drawImage(sideTile, sqmSize * id, sqmSize * index)
            }
            else if (index === grid.length - 2) {
                ctx.drawImage(bottomTile, sqmSize * id, sqmSize * index)
            } else {
                //ctx.drawImage(backgroundTile, sqmSize * id, sqmSize * index)
            }
        })
    })
}
const createSwordTrailTick = (element: Trail, tick: number): void => {
    ctx.lineTo(element.x, element.y - 25);
    ctx.lineTo(element.x + (Math.random() * 40 - 20), element.y - 25 - (Math.random() * 40 - 20))
    tick !== 0 ? createSwordTrailTick(element, tick - 1) : null;
}
const creatureDeathAnim = (enemy: Enemy, animTimeSeconds: number): void => {
    let posX: number = enemy.x;
    let posY: number = enemy.y;
    const render: NodeJS.Timer = setInterval((): void => {
        ctx.beginPath();
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#6F1E51';
        createSwordTrailTick({ x: posX + 55, y: posY + 110 }, 2)
        ctx.stroke();
    }, 1000 / 120)
    setTimeout((): void => {
        clearInterval(render);
    }, animTimeSeconds * 1000);
}
const initEnemyAi = (element: Enemy, number: number): void => {
    switch (number) {
        case 1: Ai_MoveAway(playerCursor, element, 5);
            break;
        case 2: Ai_Clone(element, enemiesLv2);
            break;
        case 3: Ai_Teleport(playerCursor, element);
            break;
        case 4: Ai_RushDown(element, 20);
            break;
    }
}
export const drawBossHealtBar = (currentHp: number, maxHp: number): void => {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(0,0,0, 0.35)';
    ctx.fillRect(window.innerWidth / 5, 100, (window.innerWidth * 3 / 5), 25);
    ctx.fillStyle = 'green';
    ctx.fillRect(window.innerWidth / 5, 100, (window.innerWidth * 3 / 5) * currentHp / maxHp, 25);
}
/*****************************************************
CANVAS RENDERING
 *****************************************************/
const gameRendering = (): void => {
    nextFrameBegin();
    paintGrid(32);
    if (playerCursor.hp < 1) {
        gameOver();
    }
    // Interface player health info
    ctx.fillStyle = '#130f40';
    ctx.font = 'normal small-caps bold 48px rakkas';
    drawAnim(50, 50, 64, 64, HPIMG, 5)
    ctx.fillText(` x ${playerCursor.hp}`, 50 + 64, 50 + 48);
    ctx.fillText(` Score: ${score}`, window.innerWidth - 350, 50 + 48);
    // Setup animations on every position change
    onmousemove = (e: MouseEvent): void => {
        if (e.clientX < previousPlayerX && e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgWest;
            trailPosX = 15.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        } else if (e.clientX > previousPlayerX && e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgEast;
            trailPosX = -41.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        } else if (e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgNorth;
            trailPosY = 50;
            trailWidth = 20;
            trailHeight = 53;
        }
        // Update player position info
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
        // Saving previous mouse pos for above position checking
        previousPlayerX = e.clientX;
        previousPlayerY = e.clientY;

        trailsArray.push(trail);
        if (isSlowMotion) {
            const playerSlowMotionPos: Positions = {
                x: e.clientX,
                y: e.clientY
            }
            samuraiSkillPosArr.push(playerSlowMotionPos);
        }
    }
    interval++;
    // Set enemies spawn speed by a certain amount of time
    // interval / 1000 means changing state every __16sec__ 
    if (interval / 1000 > 0 && interval / 1000 < 1) {
        spawnRate = spawnRateStages[3];
       
    } else if (interval / 1000 > 1 && interval / 1000 < 2) {
        spawnRate = spawnRateStages[4];
        console.log('Waves are on level 2');
    } else if (interval / 1000 > 2 && interval / 1000 < 3) {
        spawnRate = spawnRateStages[5];
        console.log('Waves are on level 3');
    } else if (interval / 1000 > 3 && interval / 1000 < 4) {
        spawnRate = spawnRateStages[5];
        console.log('Waves are on level 4');
    } else if (interval / 1000 > 4 && ladyBug.isDead === null && interval / 1000 < 4.3) {
        ladyBug.isDead = false;
    } else if (interval / 1000 > 4.3 && ladyBug.isDead===false) {
        spawnRate = 0;
        console.log('Waves are on level 5 - Boss wave');
    } else if (interval / 1000 > 5 && ladyBug.isDead === true) {
        spawnRate = spawnRateStages[5];
        console.log('Waves are on level 6 after boss wave');
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
            src: Math.floor(Math.random() * 2) + 1 === 1 ? ENEMYLV1.img : ENEMYLV1.img2
        }
        enemyLv1.img.src = ENEMYLV1.img;
        enemiesLv1.push(enemyLv1);
    }
    enemiesLv1.forEach((element: Enemy) => {
        const deathPosX: number = element.x;
        const deathPosY: number = element.y;
        // Apply logic to enemy
        initEnemyAi(element, element.mutation);
        drawAnim(element.x, element.y, 96, 96, element.src, 8);
        // Pseudo hitbox example of enemy \/
        /*ctx.beginPath();
        ctx.arc(element.x, element.y, 48, 0, 8)
        ctx.stroke();*/
        element.y += element.speed;
        // Enemy arrived to it's destination
        if (element.y >= window.innerHeight) {
            const index: number = enemiesLv1.indexOf(element);
            enemiesLv1.splice(index, 1);
            // Don't count enemies who are out screen
            if (element.x > 0 && element.x < window.innerWidth) playerCursor.hp--;
        }
        // If enemy collides with cursor
        if (collision(playerCursor, element) <= element.radius / 2 && !isSlowMotion) {
            creatureDeathAnim({ x: deathPosX, y: deathPosY }, 0.4)
            const index: number = enemiesLv1.indexOf(element);
            enemiesLv1.splice(index, 1)
            score += 50;
        }
        samuraiSkillPosArr.forEach((slashPos: Positions) => {
            if (collision(slashPos, element) < 10 && !isSlowMotion) {
                creatureDeathAnim({ x: deathPosX, y: deathPosY }, 0.6)
                const index: number = enemiesLv1.indexOf(element);
                enemiesLv1.splice(index, 1);
                score += 50;
            }
        });
    });
    if (interval % spawnRate / 3 === 24) {
        // Defining every enemy of this type
        const enemyLv2: Enemy = {
            img: new Image(),
            width: ENEMYLV1.width,
            height: ENEMYLV1.height,
            x: Math.floor((Math.random() * window.innerWidth + 50) - 25), // -n +n makes enemies don't appear outside or semi outside of screen
            y: ENEMYLV1.y,
            speed: ENEMYLV1.speed,
            radius: ENEMYLV1.radius,
            mutation: Math.floor(Math.random() * 4) + 1,
            mutation2: Math.floor(Math.random() * 4) + 1,
            src: Math.floor(Math.random() * 2) + 1 === 1 ? ENEMYLV1.img : ENEMYLV1.img2
        }
        enemyLv2.img.src = ENEMYLV1.img;
        enemiesLv2.push(enemyLv2);
        while (enemyLv2.mutation === enemyLv2.mutation2) {
            enemyLv2.mutation2 = Math.floor(Math.random() * 4) + 1;
        }
    }
    enemiesLv2.forEach((element: Enemy) => {
        const deathPosX: number = element.x;
        const deathPosY: number = element.y;

        // Apply logic to enemy
        initEnemyAi(element, element.mutation)
        initEnemyAi(element, element.mutation2)
        element.y += element.speed;
        // Enemy arrived to it's destination
        if (element.y >= window.innerHeight) {
            const index: number = enemiesLv2.indexOf(element);
            enemiesLv2.splice(index, 1);
            // Don't count enemies who are out screen
            if (element.x > 0 && element.x < window.innerWidth) playerCursor.hp--;
        }
        // If enemy collides with cursor
        if (collision(playerCursor, element) <= element.radius / 2 && !isSlowMotion) {
            creatureDeathAnim({ x: deathPosX, y: deathPosY }, 0.4)
            const index: number = enemiesLv2.indexOf(element);
            enemiesLv2.splice(index, 1)
            score += 50;
        }
        samuraiSkillPosArr.forEach((slashPos: Positions) => {
            if (collision(slashPos, element) < 10 && !isSlowMotion) {
                creatureDeathAnim({ x: deathPosX, y: deathPosY }, 0.6)
                const index: number = enemiesLv2.indexOf(element);
                enemiesLv2.splice(index, 1);
                score += 50;
            }
        });
        drawAnim(element.x, element.y, 96, 96, 'https://i.postimg.cc/R0Bh6gwk/octopus.png', 4);
    });
    /**
     * Bosses
     */
    ladyBug.isDead === false ? boss_LadyBug(interval, ctx, playerCursor) : null;
    /**
     * Sword trail
     */
    const trail: Trail = {
        x: playerCursor.x + 25 + trailPosX,
        y: playerCursor.y,
        width: TRAIL.width,
        height: TRAIL.height,
    }
    trailsArray.forEach((element: Trail) => {
        if (!isSlowMotion) {
            ctx.beginPath();
            // Getting random color to make trail looking more precious
            switch (Math.floor(Math.random() * 4 + 1)) {
                case 1: ctx.strokeStyle = '#2ce8f5';
                    break;
                case 2: ctx.strokeStyle = '#0099db';
                    break;
                case 3: ctx.strokeStyle = '#fff';
                    break;
                case 4: ctx.strokeStyle = '#7b2cf5';
            }
            ctx.lineWidth = 3;
            createSwordTrailTick(element, 12);
            ctx.stroke();
        }
    })
    trailsArray.forEach((element: Trail) => {

        if (collision(playerCursor, element) > 220) {
            const index: number = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        }
        if (interval % 12 === 1) {
            const index: number = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        }
    })
    // Drawn anim on top of the sword + prevent to render anim on slowMotion
    //!isSlowMotion ? drawAnim(trail.x - trailPosX, trail.y - trailPosY, trailWidth, trailHeight, trailImg, 7) : null;
    // Drawing player
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
    ctx.strokeStyle = '#03045e';
}
let gameRender: NodeJS.Timer = setInterval(() => {
    ctx ? gameRendering() : null;
}, 1000 / 60)