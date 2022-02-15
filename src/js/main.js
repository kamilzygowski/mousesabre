"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
var background = new Image();
background.src = 'https://i.postimg.cc/rwnx5kTk/City3.png';
var interval = 0;
var enemies = [];
var trailsArray = new Array;
var previousPlayerX, previousPlayerY;
var trailImg = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
var trailPosX, trailPosY, trailWidth, trailHeight;
ctx.fillStyle = '#c7ecee';
var spawnRateStages = [
    384,
    192,
    96,
    48,
    24,
    12,
    6,
    3 // 128 enemies on screen
];
var spawnRate = 0;
// Create a data instance for our player
var playerCursor = {
    img: new Image(),
    width: 40,
    height: 40,
    x: 0,
    y: 0
};
playerCursor.img.src = constants_1.PLAYER.imgEast;
/**
 * Functions
 */
var nextFrameBegin = function () {
    ctx.drawImage(background, 0, 0, canvas.clientWidth, canvas.clientHeight);
};
var AiMoveAway = function (creature, speed) {
    if (playerCursor.x > creature.x && Math.abs(playerCursor.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x -= speed;
    }
    else if (playerCursor.x < creature.x && Math.abs(playerCursor.x - creature.x) < 90 && creature.x < window.innerWidth - 60 && creature.x > 0) {
        creature.x += speed;
    }
};
var collision = function (cursor, enemy) {
    var dx = cursor.x - enemy.x;
    var dy = cursor.y - enemy.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
};
var drawAnim = function (x, y, width, height, src, framesNumber) {
    var image = new Image();
    image.src = src;
    var thisFrame = Math.round(interval % (framesNumber * 10) / 10);
    ctx.drawImage(image, width * thisFrame, 0, width, height, x, y, width, height);
};
/**
 * Canvas Rendering
 */
var gameRender = setInterval(function () {
    nextFrameBegin();
    // Setup animations on every position change
    onmousemove = function (e) {
        if (e.clientX < previousPlayerX) {
            playerCursor.img.src = constants_1.PLAYER.imgWest;
            trailImg = 'https://i.postimg.cc/GmCTYmVV/blue-Trail-Left.png';
            trailPosX = -38.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        }
        else if (e.clientX > previousPlayerX) {
            playerCursor.img.src = constants_1.PLAYER.imgEast;
            trailImg = 'https://i.postimg.cc/QdJ9qrrt/blue-Trail-Right.png';
            trailPosX = 100.5;
            trailPosY = 30;
            trailWidth = 85;
            trailHeight = 20;
        }
        else {
            playerCursor.img.src = constants_1.PLAYER.imgNorth;
            trailImg = 'https://i.postimg.cc/NMQXwzGF/blue-Trail8.png';
            trailPosX = -14;
            trailPosY = 60;
            trailWidth = 20;
            trailHeight = 53;
        }
        // Update player position info
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
        // Saving previous mouse pos for above position checking
        previousPlayerX = e.clientX;
        previousPlayerY = e.clientY;
    };
    interval++;
    // Set enemies spawn speed by a certain amount of time
    if (interval / 1000 > 0) {
        spawnRate = spawnRateStages[0];
    }
    else if (interval / 1000 > 2) {
        spawnRate = spawnRateStages[1];
    }
    else if (interval / 1000 > 4) {
        spawnRate = spawnRateStages[2];
    }
    else if (interval / 1000 > 6) {
        spawnRate = spawnRateStages[6];
    }
    if (interval % spawnRate === 3) {
        // Defining every enemy of this type
        var enemyLv1 = {
            img: new Image(),
            width: constants_1.ENEMYLV1.width,
            height: constants_1.ENEMYLV1.height,
            x: Math.floor((Math.random() * window.innerWidth + 50) - 25),
            y: constants_1.ENEMYLV1.y,
            speed: constants_1.ENEMYLV1.speed,
            radius: constants_1.ENEMYLV1.radius
        };
        enemyLv1.img.src = constants_1.ENEMYLV1.img;
        enemies.push(enemyLv1);
        //console.log(enemies)
    }
    enemies.forEach(function (element) {
        // Apply logic to enemy
        AiMoveAway(element, 5);
        ctx.drawImage(element.img, element.x, element.y, element.width, element.height);
        element.y += element.speed;
        // Enemy arrived to it's destination
        if (element.y >= window.innerHeight) {
            var index = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        // If enemy collides with cursor
        if (collision(playerCursor, element) <= element.radius / 2) {
            var index = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        ;
    });
    /**
     * Sword trail
     */
    var trail = {
        img: new Image(),
        x: playerCursor.x,
        y: playerCursor.y,
        width: constants_1.TRAIL.width,
        height: constants_1.TRAIL.height
    };
    trail.img.src = constants_1.TRAIL.img;
    trailsArray.push(trail);
    trailsArray.forEach(function (element) {
        drawAnim(element.x - trailPosX, element.y - trailPosY, trailWidth, trailHeight, trailImg, 7);
    });
    if (interval % 23 === 1 || interval % 23 === 2) {
        trailsArray.forEach(function (element) {
            var index = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        });
    }
    // Drawing player
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
}, 1000 / 120);
