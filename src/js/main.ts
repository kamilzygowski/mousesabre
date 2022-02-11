interface Cursor{
    img:HTMLImageElement;
    readonly width:number;
    readonly height:number;
    x?:number;
    y?:number;
}

interface Enemy{
    img:HTMLImageElement;
    width:number;
    height:number;
    x:number;
    y:number;
}

const canvas: HTMLElement = document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let interval:number = 0;

const mouseImg: HTMLImageElement = new Image(64, 64);
mouseImg.src = 'https://i.postimg.cc/sDSjbD7K/mouse.png';
ctx.fillStyle = '#c7ecee';


/**
 * Functions
 */
const nextFrameBegin = (): void => {
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

/**
 * Canvas Rendering
 */

setInterval((): void => {
    nextFrameBegin();
    
    const newEnemy:Enemy = {
        img : new Image(),
        width:40,
        height:40,
        x:Math.floor(Math.random() * window.innerWidth),
        y:0
    }
    interval++;
    if(interval%1356){
        console.log(newEnemy)
        newEnemy.img.src = 'https://i.postimg.cc/MZ05K17Q/enemy.png';
    }
    ctx.drawImage(newEnemy.img, newEnemy.x, newEnemy.y, newEnemy.width, newEnemy.height);
    newEnemy.y++;
    onmousemove = (e: MouseEvent): void => {
        ctx.drawImage(mouseImg, e.clientX - mouseImg.width / 2, e.clientY - mouseImg.height / 2);
    }
}, 1000 / 60);