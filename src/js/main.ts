import { PLAYER } from "./constants";

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

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let interval: number = 0;
const enemies: Array<Object> = [];

ctx.fillStyle = '#c7ecee';


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
const playerCursor: Cursor = {
    img: new Image(),
    width: 40,
    height: 40,
    x: 0,
    y: 0,
}
playerCursor.img.src = PLAYER.img;

const gameRender: NodeJS.Timer = setInterval((): void => {
    nextFrameBegin();

    // Track player cursor to update it's position
    onmousemove = (e: MouseEvent): void => {
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
    }

    interval++;
    if (interval % 4 === 3) {
        // Defining every enemy of this type
        const enemy: Enemy = {
            img: new Image(),
            width: 40,
            height: 40,
            x: Math.floor((Math.random() * window.innerWidth - 50) + 50), // -n +n makes enemies don't appear outside or semi outside of screen
            y: -50,
            speed: 5
        }
        enemy.img.src = 'https://i.postimg.cc/MZ05K17Q/enemy.png';
        enemies.push(enemy);
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
        if (collision(playerCursor, element) <= element.width + element.height / 2) {
            const index: number = enemies.indexOf(element);
            enemies.splice(index, 1);
        };
    });
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);

}, 1000 / 60);