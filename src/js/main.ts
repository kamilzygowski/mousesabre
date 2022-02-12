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

let interval: number = 0;
const enemies: Array<Object> = [];
const trailsArray = new Array;
let previousPlayerX: number, previousPlayerY: number;

ctx.fillStyle = '#c7ecee';

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
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

const collision = (cursor: any, enemy: any): number => {
    const dx: number = cursor.x - enemy.x;
    const dy: number = cursor.y - enemy.y;

    const distance: number = Math.sqrt(dx * dx + dy * dy);
    return distance;
}
/**
 * Canvas Rendering
 */
const gameRender: NodeJS.Timer = setInterval((): void => {
    nextFrameBegin();

    // Track player cursor to update it's position
    onmousemove = (e: MouseEvent): void => {
        if (e.clientX < previousPlayerX) {
            playerCursor.img.src = PLAYER.imgWest;
        } else if (e.clientX > previousPlayerX) {
            playerCursor.img.src = PLAYER.imgEast;
        } else {
            playerCursor.img.src = PLAYER.imgNorth;
        }
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
        // Saving previous mouse pos for above position checking
        previousPlayerX = e.clientX;
        previousPlayerY = e.clientY;
    }

    interval++;
    if (interval % 12 === 3) {
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
        ctx.drawImage(element.img, element.x, element.y, element.width, element.height)
    })
    if (interval % 23 === 1) {
        trailsArray.forEach((element) => {
            const index: number = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        })
    }
    // Drawing player
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
}, 1000 / 120);