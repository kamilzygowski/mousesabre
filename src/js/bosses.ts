import { Cursor, drawBossHealtBar } from "./main";
import { collision } from "./utils";

export interface Boss {
    hp: number;
    maxHp: number;
    x: number;
    y: number;
    width: number;
    height: number;
    isDead: boolean;
    weakPoints: object[];
    shots: object[],
}
interface LadyBug_Spike{
    x:number;
    y:number;
    width:number;
    height:number;
    speedX:number;
    speedY:number;
}

// Bosses
// Lady Bug
const bossLadyBugImg = new Image();
bossLadyBugImg.src = 'https://i.postimg.cc/d3xWZXKP/ladybug1.png';
export const ladyBug: Boss = {
    hp: 700,
    maxHp: 700,
    x: window.innerWidth / 4,
    y: -30,
    width: 769,
    height: 600,
    isDead: null,
    weakPoints: [],
    shots:[]
}
const bossTimeWraithImg = new Image();
bossTimeWraithImg.src = '';
export const timeWraith: Boss = {
    hp:800,
    maxHp:800,
    x: window.innerWidth/2,
    y: window.innerHeight/2,
    width:769,
    height: 600,
    isDead: null,
    weakPoints: [],
    shots:[]
}

export const boss_TimeWraith = (interval: number, ctx: CanvasRenderingContext2D, playerCursor: Cursor): void => {

}

export const boss_LadyBug = (interval: number, ctx: CanvasRenderingContext2D, playerCursor: Cursor): void => {
    ctx.drawImage(bossLadyBugImg, ladyBug.x - ladyBug.width / 2, ladyBug.y - ladyBug.height / 2);
    drawBossHealtBar(ladyBug.hp, ladyBug.maxHp);
    /* if(window.innerWidth > 900 ){
         ladyBug.x += Math.cos(interval / 50)*4
     } else if (window.innerWidth > 1200){
         ladyBug.x += Math.cos(interval / 50)*14
     }*/
    interval % 128 > 64 ? ladyBug.y -= 2 : ladyBug.y += 2;
    ladyBug.x += Math.cos(interval / 50) * 11
    if (ladyBug.x > window.innerWidth - window.innerWidth / 3) {
        ladyBug.x -= 2;
    } else if (ladyBug.x < window.innerWidth / 3) {
        ladyBug.x += 2;
    }
    // ladyBug.y += Math.cos(interval / 100)

    if(interval % 100 ===1){ 
        const spikeMid = {
            x: ladyBug.x,
            y: ladyBug.y,
            width:30,
            heigth:70,
            speedX: 0,
            speedY: 8
        }  
        const spikeLeft = {
            x: ladyBug.x,
            y: ladyBug.y,
            width:30,
            heigth:70,
            speedX: 6,
            speedY: 7
        } 
        const spikeRight = {
            x: ladyBug.x,
            y: ladyBug.y,
            width:30,
            heigth:70,
            speedX: -6,
            speedY: 7
        } 
        ladyBug.shots.push(spikeMid);
        ladyBug.shots.push(spikeLeft);
        ladyBug.shots.push(spikeRight);
    }
    const spikeImg = new Image();
        spikeImg.src = "https://i.postimg.cc/9MvXBdkJ/spike.png";
    ladyBug.shots.forEach((element:LadyBug_Spike) => {
        ctx.drawImage(spikeImg, element.x, element.y + 210)
        element.y += element.speedY;
        element.x += element.speedX;
        if(collision(playerCursor, {x:element.x, y:element.y + 220}) < 60){
            const index: number = ladyBug.shots.indexOf(element);
            ladyBug.shots.splice(index, 1);
        }
        if(element.y + 220> window.innerHeight && element.x > 0 && element.x < window.innerWidth - 10){
            playerCursor.hp--;
            const index: number = ladyBug.shots.indexOf(element);
            ladyBug.shots.splice(index, 1);
        }
    })
    // Draw and init WEAK POINTS system
    if (interval % 324 === 1) {
        const weakPoint = {
            x: ladyBug.x / 6 + Math.floor(Math.random() * (ladyBug.width / 4)) - ladyBug.width / 4,
            y: ladyBug.y / 2 + Math.floor(Math.random() * ladyBug.height / 2 - 50),
            radius: 40,
        }
        ladyBug.weakPoints.push(weakPoint);
    }
    ladyBug.weakPoints.forEach((element: any) => {
        ctx.beginPath();
        ctx.arc(element.x + ladyBug.x, element.y + ladyBug.y, element.radius, 0, 15)
        ctx.fillStyle = 'white';
        ctx.fill();
        if (collision(playerCursor, { x: element.x + ladyBug.x, y: element.y + ladyBug.y }) < 40) {
            const index: number = ladyBug.weakPoints.indexOf(element);
            ladyBug.weakPoints.splice(index, 1);
            ladyBug.hp -= 100;
        }

        if (interval % 216 === 0) {
            const index: number = ladyBug.weakPoints.indexOf(element);
            ladyBug.weakPoints.splice(index, 1)
        }
    })
    // Make LadyBug disappear if she's dead
    if (ladyBug.hp <= 0) {
        ladyBug.isDead = true;
    }
}