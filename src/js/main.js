"use strict";
exports.__esModule = true;
exports.initGameState = exports.startGame = void 0;
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var canvas;
var ctx;
var background = new Image();
var healthLeft = 5;
var grid = [];
var MAIN_URL = location.href;
var sideTile = new Image();
sideTile.src = constants_1.TAILS_SIDE;
var bottomTile = new Image();
bottomTile.src = constants_1.TAILS_BOTTOM;
var backgroundTile = new Image();
backgroundTile.src = 'https://i.postimg.cc/VNpQPw38/bckg.png';
var interval = 0;
var previousPlayerX, previousPlayerY;
var enemies = [];
var trailsArray = new Array;
var trailImg = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
var trailPosX, trailPosY, trailWidth, trailHeight;
var trailLeftBehind = new Image();
trailLeftBehind.src = 'https://i.postimg.cc/C1KJC87K/TEST20-X20circle.png';
var spawnRateStages = [
    384,
    192,
    96,
    48,
    24,
    12,
    6,
    3
];
var spawnRate = 1;
var playerCursor = {
    img: new Image(),
    width: 40,
    height: 40,
    x: -100,
    y: -100
};
playerCursor.img.src = constants_1.PLAYER.imgEast;
var nextFrameBegin = function () {
    ctx.drawImage(background, 0, 0, canvas.clientWidth, canvas.clientHeight);
};
var AiMoveAway = function (player, creature, speed) {
    if (player.x > creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x -= speed;
    }
    else if (player.x < creature.x && Math.abs(player.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x += speed;
    }
};
var AiCirlce = function (creature) {
    setTimeout(function () {
        creature.x = 170 * Math.sin(interval / 100);
        creature.y = 170 * Math.cos(interval / 100);
    }, 500);
};
var AiClone = function (creature) {
    if (Math.floor(Math.random() * 200) === 1) {
        var clone = Object.create(creature);
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
var AiTeleport = function (player, creature) {
    if (player.x > creature.x && Math.abs(player.x - creature.x) < 50 && creature.x < window.innerWidth - 60 && creature.x > 0 ||
        player.x < creature.x && Math.abs(player.x - creature.x) < 50 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        var randomRange = Math.round(Math.random() * 400) - 200;
        creature.x += randomRange;
        var animate_1 = setInterval(function () {
            drawAnim(creature.x - 10, creature.y - 10, 128, 128, constants_1.ENEMY_AI_TELEPORT, 8);
        }, 1000 / 120);
        setTimeout(function () {
            clearInterval(animate_1);
        }, 450);
    }
};
var AiRushDown = function (creature, speed) {
    drawAnim(creature.x, creature.y - 160, 128, 256, constants_1.ENEMY_AI_RUSHDOWN, 4);
    setTimeout(function () {
        creature.y += speed;
    }, 1500);
};
var drawAnim = function (x, y, width, height, src, framesNumber) {
    var image = new Image();
    image.src = src;
    var thisFrame = Math.round(interval % (framesNumber * 10) / 10);
    ctx.drawImage(image, width * thisFrame, 0, width, height, x, y, width, height);
};
var startGame = function () {
    document.body.classList.add('hideCursor');
};
exports.startGame = startGame;
var gameOver = function () {
    clearInterval(gameRender);
    document.body.classList.remove('hideCursor');
    document.body.innerHTML = '';
    var gameOverTag = document.createElement('h1');
    gameOverTag.textContent = 'GAME OVER';
    gameOverTag.classList.add('gameOverText');
    canvas.style = 'display:none;';
    document.body.appendChild(gameOverTag);
    var menuButton = document.createElement('button');
    menuButton.textContent = 'Main Menu';
    menuButton.classList.add('menuButton');
    document.body.appendChild(menuButton);
    menuButton.addEventListener('click', function () {
        location.href = MAIN_URL;
    });
};
var initGameState = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 5;
    canvas.height = window.innerHeight - 5;
    background.src = constants_1.BACKGROUND;
    canvas.addEventListener('contextmenu', function (e) {
        playerSkillSamuraiSlash();
        e.preventDefault();
    });
};
exports.initGameState = initGameState;
var playerSkillSamuraiSlash = function () {
    console.log('o');
};
var paintGrid = function (sqmSize) {
    grid.forEach(function (element, index) {
        element.forEach(function (elem, id) {
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
var gameRendering = function () {
    nextFrameBegin();
    paintGrid(32);
    if (healthLeft < 1) {
        gameOver();
    }
    ctx.fillStyle = '#b71540';
    ctx.font = 'normal small-caps bold 48px rakkas';
    drawAnim(50, 50, 64, 64, constants_1.HPIMG, 5);
    ctx.fillText(" x " + healthLeft, 50 + 64, 50 + 48);
    onmousemove = function (e) {
        if (e.clientX < previousPlayerX && e.clientY != previousPlayerY) {
            playerCursor.img.src = constants_1.PLAYER.imgWest;
            trailImg = 'https://i.postimg.cc/GmCTYmVV/blue-Trail-Left.png';
            trailPosX = -38.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        }
        else if (e.clientX > previousPlayerX && e.clientY != previousPlayerY) {
            playerCursor.img.src = constants_1.PLAYER.imgEast;
            trailImg = 'https://i.postimg.cc/QdJ9qrrt/blue-Trail-Right.png';
            trailPosX = 100.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        }
        else if (e.clientY != previousPlayerY) {
            playerCursor.img.src = constants_1.PLAYER.imgNorth;
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
        var enemyLv1 = {
            img: new Image(),
            width: constants_1.ENEMYLV1.width,
            height: constants_1.ENEMYLV1.height,
            x: Math.floor((Math.random() * window.innerWidth + 50) - 25),
            y: constants_1.ENEMYLV1.y,
            speed: constants_1.ENEMYLV1.speed,
            radius: constants_1.ENEMYLV1.radius,
            mutation: Math.floor(Math.random() * 4) + 1
        };
        enemyLv1.img.src = constants_1.ENEMYLV1.img;
        enemies.push(enemyLv1);
    }
    enemies.forEach(function (element) {
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
            var index = enemies.indexOf(element);
            enemies.splice(index, 1);
            if (element.x > 0 && element.x < window.innerWidth)
                healthLeft--;
        }
        if ((0, utils_1.collision)(playerCursor, element) <= element.radius / 2) {
            var index = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        ;
    });
    var trail = {
        x: playerCursor.x,
        y: playerCursor.y,
        width: constants_1.TRAIL.width,
        height: constants_1.TRAIL.height
    };
    trailsArray.forEach(function (element) {
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
        trailsArray.forEach(function (element) {
            var index = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        });
    }
    drawAnim(trail.x - trailPosX, trail.y - trailPosY, trailWidth, trailHeight, trailImg, 7);
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
};
var gameRender = setInterval(gameRendering, 1000 / 60);
(0, utils_1.createGrid)(32, grid);
