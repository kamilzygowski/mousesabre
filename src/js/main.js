import { BACKGROUND, BACKGROUND_SLOWMOTION, ENEMYLV1, ENEMY_AI_RUSHDOWN, ENEMY_AI_TELEPORT, HPIMG, PLAYER, TAILS_BOTTOM, TAILS_SIDE, TRAIL } from "./constants";
import { collision, createGrid } from "./utils";
let canvas;
let ctx;
let healthLeft = 55555;
let grid = [];
const enemies = [];
const trailsArray = new Array;
const MAIN_URL = location.href;
let isSlowMotion = false;
const background = new Image();
const sideTile = new Image();
sideTile.src = TAILS_SIDE;
const bottomTile = new Image();
bottomTile.src = TAILS_BOTTOM;
const backgroundTile = new Image();
backgroundTile.src = 'https://i.postimg.cc/VNpQPw38/bckg.png';
let trailImg = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
let trailPosX, trailPosY, trailWidth, trailHeight;
const trailLeftBehind = new Image();
trailLeftBehind.src = 'https://i.postimg.cc/C1KJC87K/TEST20-X20circle.png';
let interval = 0;
let previousPlayerX, previousPlayerY;
let samuraiSkillPosArr = [];
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
const Ai_MoveAway = (player, creature, speed) => {
    if (!isSlowMotion) {
        if (player.x > creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
            creature.x -= speed;
        }
        else if (player.x < creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
            creature.x += speed;
        }
    }
};
const AiCirlce = (creature) => {
    setTimeout(() => {
        creature.x = 170 * Math.sin(interval / 100);
        creature.y = 170 * Math.cos(interval / 100);
    }, 500);
};
const Ai_Clone = (creature) => {
    if (Math.floor(Math.random() * 50) === 1) {
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
const Ai_Teleport = (player, creature) => {
    if (!isSlowMotion) {
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
    }
};
const Ai_RushDown = (creature, speed) => {
    drawAnim(creature.x, creature.y - 160, 128, 256, ENEMY_AI_RUSHDOWN, 4);
    const argSpeedValue = speed;
    setTimeout(() => {
        if (isSlowMotion) {
            speed = 0.5;
        }
        else {
            speed = argSpeedValue;
        }
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
        playerSkill_SamuraiSlash();
        e.preventDefault();
    });
};
const playerSkill_SamuraiSlash = () => {
    slowMotionMode(3.5);
    const skillHitbox = setInterval(() => {
        ctx.beginPath();
        ctx.lineWidth = 12;
        samuraiSkillPosArr.forEach((element) => {
            ctx.lineTo(element.x, element.y);
        });
        ctx.stroke();
    }, 1000 / 60);
    setTimeout(() => {
        samuraiSkillPosArr = [];
        clearInterval(skillHitbox);
    }, 4500);
};
const slowMotionMode = (seconds) => {
    isSlowMotion = true;
    clearInterval(gameRender);
    gameRender = setInterval(gameRendering, 1000 / 12);
    background.src = BACKGROUND_SLOWMOTION;
    setTimeout(() => {
        isSlowMotion = false;
        clearInterval(gameRender);
        background.src = BACKGROUND;
        gameRender = setInterval(gameRendering, 1000 / 60);
    }, seconds * 1000);
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
const createSwordTrailTick = (element, tick) => {
    ctx.lineTo(element.x, element.y - 25);
    ctx.lineTo(element.x + (Math.random() * 40 - 20), element.y - 25 - (Math.random() * 40 - 20));
    tick !== 0 ? createSwordTrailTick(element, tick - 1) : null;
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
        if (isSlowMotion) {
            const playerSlowMotionPos = {
                x: e.clientX,
                y: e.clientY
            };
            samuraiSkillPosArr.push(playerSlowMotionPos);
        }
    };
    interval++;
    if (interval / 1000 > 0) {
        spawnRate = spawnRateStages[4];
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
                Ai_MoveAway(playerCursor, element, 5);
                break;
            case 2:
                Ai_Clone(element);
                break;
            case 3:
                Ai_Teleport(playerCursor, element);
                break;
            case 4:
                Ai_RushDown(element, 20);
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
        if (collision(playerCursor, element) <= element.radius / 2 && !isSlowMotion) {
            const index = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        samuraiSkillPosArr.forEach((slashPos) => {
            if (collision(slashPos, element) < 5 && !isSlowMotion) {
                const index = enemies.indexOf(element);
                enemies.splice(index, 1);
            }
        });
    });
    const trail = {
        x: playerCursor.x,
        y: playerCursor.y,
        width: TRAIL.width,
        height: TRAIL.height,
    };
    trailsArray.forEach((element) => {
        if (!isSlowMotion) {
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
            createSwordTrailTick(element, 12);
            ctx.stroke();
        }
    });
    trailsArray.forEach((element) => {
        if (collision(playerCursor, element) > 220) {
            const index = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        }
        if (interval % 12 === 1) {
            const index = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        }
    });
    !isSlowMotion ? drawAnim(trail.x - trailPosX, trail.y - trailPosY, trailWidth, trailHeight, trailImg, 7) : null;
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
};
let gameRender = setInterval(() => {
    gameRendering();
}, 1000 / 60);
createGrid(32, grid);
