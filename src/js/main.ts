import { BACKGROUND, ENEMYLV1, PLAYER, TRAIL } from "./constants";
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
}

const canvas: any = document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
const background = new Image();
background.src = BACKGROUND;

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
let spawnRate: number = 0;
// Create a data instance for our player
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

const AiMoveAway = (player:Cursor ,creature: Enemy, speed: number): void => {
    if (player.x > creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x -= speed;
    } else if (player.x < creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x += speed;
    }
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
        spawnRate = spawnRateStages[0];
    } else if (interval / 1000 > 2) {
        spawnRate = spawnRateStages[1];
    } else if (interval / 1000 > 4) {
        spawnRate = spawnRateStages[2];
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
            radius: ENEMYLV1.radius
        }
        enemyLv1.img.src = ENEMYLV1.img;
        enemies.push(enemyLv1);
        //console.log(enemies)
    }
    enemies.forEach((element: Enemy) => {
        // Apply logic to enemy
        AiMoveAway(playerCursor, element, 5)

        ctx.drawImage(element.img, element.x, element.y, element.width, element.height);
        element.y += element.speed;

        // Enemy arrived to it's destination
        if (element.y >= window.innerHeight) {
            const index: number = enemies.indexOf(element);
            enemies.splice(index, 1);
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
        //drawAnim(element.x - trailPosX, element.y - trailPosY, trailWidth, trailHeight, trailImg, 7);
        const getPosX: number = element.x - trailPosX;
        const getPosY: number = element.y - trailPosY;
        ctx.drawImage(trailLeftBehind, getPosX + correctPositionX, getPosY + correctPositionY, 20, 20)


    })
    if (interval % 23 === 1) {
        trailsArray.forEach((element) => {
            const index: number = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        })
    }
    // Drawn anim on top of the sword
    drawAnim(trail.x - trailPosX, trail.y - trailPosY, trailWidth, trailHeight, trailImg, 7);
    // Drawing player
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
}, 1000 / 120);