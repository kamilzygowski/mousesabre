"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
var interval = 0;
var enemies = [];
var trailsArray = new Array;
var previousPlayerX, previousPlayerY;
ctx.fillStyle = '#c7ecee';
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
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
};
var collision = function (cursor, enemy) {
    var dx = cursor.x - enemy.x;
    var dy = cursor.y - enemy.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
};
/**
 * Canvas Rendering
 */
var gameRender = setInterval(function () {
    nextFrameBegin();
    // Track player cursor to update it's position
    onmousemove = function (e) {
        if (e.clientX < previousPlayerX) {
            playerCursor.img.src = constants_1.PLAYER.imgWest;
        }
        else if (e.clientX > previousPlayerX) {
            playerCursor.img.src = constants_1.PLAYER.imgEast;
        }
        else {
            playerCursor.img.src = constants_1.PLAYER.imgNorth;
        }
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
        // Saving previous mouse pos for above position checking
        previousPlayerX = e.clientX;
        previousPlayerY = e.clientY;
    };
    interval++;
    if (interval % 12 === 3) {
        // Defining every enemy of this type
        var enemyLv1 = {
            img: new Image(),
            width: constants_1.ENEMYLV1.width,
            height: constants_1.ENEMYLV1.height,
            x: Math.floor((Math.random() * window.innerWidth + 50) - 25),
            y: constants_1.ENEMYLV1.y,
            speed: constants_1.ENEMYLV1.speed
        };
        enemyLv1.img.src = constants_1.ENEMYLV1.img;
        enemies.push(enemyLv1);
        console.log(enemies);
    }
    enemies.forEach(function (element) {
        ctx.drawImage(element.img, element.x, element.y, element.width, element.height);
        element.y += element.speed;
        // Enemy arrived to it's destination
        if (element.y >= window.innerHeight) {
            var index = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        // If enemy collides with cursor
        if (collision(playerCursor, element) <= element.width + element.height / 8) {
            var index = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        ;
    });
    /**
     * Trail
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
        ctx.drawImage(element.img, element.x, element.y, element.width, element.height);
    });
    if (interval % 23 === 1) {
        trailsArray.forEach(function (element) {
            var index = trailsArray.indexOf(element);
            trailsArray.splice(index, 1);
        });
    }
    // Drawing player
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
}, 1000 / 120);
