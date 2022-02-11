"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var interval = 0;
var enemies = [];
ctx.fillStyle = '#c7ecee';
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
var playerCursor = {
    img: new Image(),
    width: 40,
    height: 40,
    x: 0,
    y: 0
};
playerCursor.img.src = constants_1.PLAYER.img;
var gameRender = setInterval(function () {
    nextFrameBegin();
    // Track player cursor to update it's position
    onmousemove = function (e) {
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
    };
    interval++;
    if (interval % 4 === 3) {
        // Defining every enemy of this type
        var enemy = {
            img: new Image(),
            width: 40,
            height: 40,
            x: Math.floor((Math.random() * window.innerWidth - 50) + 50),
            y: -50,
            speed: 5
        };
        enemy.img.src = 'https://i.postimg.cc/MZ05K17Q/enemy.png';
        enemies.push(enemy);
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
        if (collision(playerCursor, element) <= element.width + element.height / 2) {
            var index = enemies.indexOf(element);
            enemies.splice(index, 1);
        }
        ;
    });
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
}, 1000 / 60);
