const canvas: HTMLElement = document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
    onmousemove = (e: MouseEvent): void => {
        nextFrameBegin();
        console.log(e.clientX, e.clientY);
        ctx.drawImage(mouseImg, e.clientX - mouseImg.width / 2, e.clientY - mouseImg.height / 2);
    }
}, 1000 / 60);