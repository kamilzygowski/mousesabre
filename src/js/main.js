import { BACKGROUND, ENEMYLV1, ENEMY_AI_RUSHDOWN, ENEMY_AI_TELEPORT, HPIMG, PLAYER, TAILS_BOTTOM, TAILS_SIDE, TRAIL } from "./constants";
import { collision, createGrid } from "./utils";
let canvas;
let ctx;
const background = new Image();
let healthLeft = 5;
let grid = [];
const MAIN_URL = location.href;
const sideTile = new Image();
sideTile.src = TAILS_SIDE;
const bottomTile = new Image();
bottomTile.src = TAILS_BOTTOM;
const backgroundTile = new Image();
backgroundTile.src = 'https://i.postimg.cc/VNpQPw38/bckg.png';
let interval = 0;
let previousPlayerX, previousPlayerY;
const enemies = [];
const trailsArray = new Array;
let trailImg = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
let trailPosX, trailPosY, trailWidth, trailHeight;
const trailLeftBehind = new Image();
trailLeftBehind.src = 'https://i.postimg.cc/C1KJC87K/TEST20-X20circle.png';
const spawnRateStages = [
    384,
    192,
    96,
    48,
    24,
    12,
    6,
    3
];
let spawnRate = 1;
const playerCursor = {
    img: new Image(),
    width: 40,
    height: 40,
    x: -100,
    y: -100,
};
playerCursor.img.src = PLAYER.imgEast;
const nextFrameBegin = () => {
    ctx.drawImage(background, 0, 0, canvas.clientWidth, canvas.clientHeight);
};
const AiMoveAway = (player, creature, speed) => {
    if (player.x > creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x -= speed;
    }
    else if (player.x < creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x += speed;
    }
};
const AiCirlce = (creature) => {
    setTimeout(() => {
        creature.x = 170 * Math.sin(interval / 100);
        creature.y = 170 * Math.cos(interval / 100);
    }, 500);
};
const AiClone = (creature) => {
    if (Math.floor(Math.random() * 200) === 1) {
        let clone = Object.create(creature);
        if (Math.round(Math.random() + 1) === 2 && creature.x < window.innerWidth - 90) {
            clone.x += Math.round(Math.random() * 30) + 25;
            enemies.push(clone);
        }
        else if (Math.round(Math.random() + 1) === 1 && creature.x > 90) {
            clone.x -= Math.round(Math.random() * 30) + 25;
            enemies.push(clone);
        }
    }
};
const AiTeleport = (player, creature) => {
    if (player.x > creature.x && Math.abs(player.x - creature.x) < 50 && creature.x < window.innerWidth - 60 && creature.x > 0 ||
        player.x < creature.x && Math.abs(player.x - creature.x) < 50 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        const randomRange = Math.round(Math.random() * 400) - 200;
        creature.x += randomRange;
        const animate = setInterval(() => {
            drawAnim(creature.x - 10, creature.y - 10, 128, 128, ENEMY_AI_TELEPORT, 8);
        }, 1000 / 120);
        setTimeout(() => {
            clearInterval(animate);
        }, 450);
    }
};
const AiRushDown = (creature, speed) => {
    drawAnim(creature.x, creature.y - 160, 128, 256, ENEMY_AI_RUSHDOWN, 4);
    setTimeout(() => {
        creature.y += speed;
    }, 1500);
};
const drawAnim = (x, y, width, height, src, framesNumber) => {
    let image = new Image();
    image.src = src;
    const thisFrame = Math.round(interval % (framesNumber * 10) / 10);
    ctx.drawImage(image, width * thisFrame, 0, width, height, x, y, width, height);
};
export const startGame = () => {
    document.body.classList.add('hideCursor');
};
const gameOver = () => {
    clearInterval(gameRender);
    document.body.classList.remove('hideCursor');
    document.body.innerHTML = '';
    const gameOverTag = document.createElement('h1');
    gameOverTag.textContent = 'GAME OVER';
    gameOverTag.classList.add('gameOverText');
    canvas.style = 'display:none;';
    document.body.appendChild(gameOverTag);
    const menuButton = document.createElement('button');
    menuButton.textContent = 'Main Menu';
    menuButton.classList.add('menuButton');
    document.body.appendChild(menuButton);
    menuButton.addEventListener('click', () => {
        location.href = MAIN_URL;
    });
};
export const initGameState = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 5;
    canvas.height = window.innerHeight - 5;
    background.src = BACKGROUND;
    canvas.addEventListener('contextmenu', (e) => {
        playerSkillSamuraiSlash();
        e.preventDefault();
    });
};
const playerSkillSamuraiSlash = () => {
    console.log('o');
};
const paintGrid = (sqmSize) => {
    grid.forEach((element, index) => {
        element.forEach((elem, id) => {
            if (id === 0 || id === element.length - 1) {
                ctx.drawImage(sideTile, sqmSize * id, sqmSize * index);
            }
            else if (index === grid.length - 2) {
                ctx.drawImage(bottomTile, sqmSize * id, sqmSize * index);
            }
            else {
            }
        });
    });
};
const gameRendering = () => {
    nextFrameBegin();
    paintGrid(32);
    if (healthLeft < 1) {
        gameOver();
    }
    ctx.fillStyle = '#b71540';
    ctx.font = 'normal small-caps bold 48px rakkas';
    drawAnim(50, 50, 64, 64, HPIMG, 5);
    ctx.fillText(` x ${healthLeft}`, 50 + 64, 50 + 48);
    onmousemove = (e) => {
        if (e.clientX < previousPlayerX && e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgWest;
            trailImg = 'https://i.postimg.cc/GmCTYmVV/blue-Trail-Left.png';
            trailPosX = -38.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        }
        else if (e.clientX > previousPlayerX && e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgEast;
            trailImg = 'https://i.postimg.cc/QdJ9qrrt/blue-Trail-Right.png';
            trailPosX = 100.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        }
        else if (e.clientY != previousPlayerY) {
            playerCursor.img.src = PLAYER.imgNorth;
            trailImg = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
            trailPosX = -16;
            trailPosY = 50;
            trailWidth = 20;
            trailHeight = 53;
        }
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
        previousPlayerX = e.clientX;
        previousPlayerY = e.clientY;
        trailsArray.push(trail);
    };
    interval++;
    if (interval / 1000 > 0) {
        spawnRate = spawnRateStages[1];
    }
    else if (interval / 1000 > 2) {
        spawnRate = spawnRateStages[2];
    }
    else if (interval / 1000 > 4) {
        spawnRate = spawnRateStages[3];
    }
    else if (interval / 1000 > 6) {
        spawnRate = spawnRateStages[6];
    }
    if (interval % spawnRate === 3) {
        const enemyLv1 = {
            img: new Image(),
            width: ENEMYLV1.width,
            height: ENEMYLV1.height,
            x: Math.floor((Math.random() * window.innerWidth + 50) - 25),
            y: ENEMYLV1.y,
            speed: ENEMYLV1.speed,
            radius: ENEMYLV1.radius,
            mutation: Math.floor(Math.random() * 4) + 1,
        };
        enemyLv1.img.src = ENEMYLV1.img;
        enemies.push(enemyLv1);
    }
    enemies.forEach((element) => {
        switch (element.mutation) {
            case 1:
                AiMoveAway(playerCursor, element, 5);
                break;
            case 2:
                AiClone(element);
                break;
            case 3:
                AiTeleport(playerCursor, element);
                break;
            case 4:
                AiRushDown(element, 20);
                break;
        }
        ctx.drawImage(element.img, element.x, element.y, element.width, element.height);
        element.y += element.speed;
        if (element.y >= window.innerHeight) {
            const index = enemies.indexOf(element);
            enemies.splice(index, 1);
            if (element.x > 0 && element.x < window.innerWidth)
                healthLeft--;
        }
        if (collision(playerCursor, element) <= element.radius / 2) {
            const index = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        ;
    });
    const trail = {
        x: playerCursor.x,
        y: playerCursor.y,
        width: TRAIL.width,
        height: TRAIL.height,
    };
    trailsArray.forEach((element) => {
        ctx.beginPath();
        switch (Math.floor(Math.random() * 4 + 1)) {
            case 1:
                ctx.strokeStyle = '#2ce8f5';
                break;
            case 2:
                ctx.strokeStyle = '#0099db';
                break;
            case 3:
                ctx.strokeStyle = '#fff';
                break;
            case 4: ctx.strokeStyle = '#7b2cf5';
        }
        ctx.lineWidth = 3;
        ctx.lineTo(element.x, element.y - 25);
        ctx.lineTo(element.x + (Math.random() * 40 - 20), element.y - 25 - (Math.random() * 40 - 20));
        ctx.lineTo(element.x, element.y - 25);
        ctx.lineTo(element.x + (Math.random() * 40 - 20), element.y - 25 + (Math.random() * 40 - 20));
        ctx.lineTo(element.x, element.y - 25);
        ctx.stroke();
    });
    if (interval % 23 === 1 || interval % 23 === 2) {
        trailsArray.forEach((element) => {
            const index = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        });
    }
    drawAnim(trail.x - trailPosX, trail.y - trailPosY, trailWidth, trailHeight, trailImg, 7);
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
};
const gameRender = setInterval(gameRendering, 1000 / 60);
createGrid(32, grid);
