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
/**
 * Canvas Rendering
 */
var newEnemy = {
    img: new Image(),
    width: 40,
    height: 40,
    x: Math.floor(Math.random() * window.innerWidth),
    y: 0,
    speed: 2
};
newEnemy.img.src = 'https://i.postimg.cc/MZ05K17Q/enemy.png';
var playerCursor = {
    img: new Image(),
    width: 40,
    height: 40,
    x: 0,
    y: 0
};
playerCursor.img.src = 'https://i.postimg.cc/sDSjbD7K/mouse.png';
var gameRender = setInterval(function () {
    nextFrameBegin();
    // Track player cursor to update it's position
    onmousemove = function (e) {
        playerCursor.x = e.clientX;
        playerCursor.y = e.clientY;
    };
    interval++;
    if (interval % 135 === 3) {
        var enemy = {
            img: new Image(),
            width: 40,
            height: 40,
            x: Math.floor(Math.random() * window.innerWidth),
            y: 0,
            speed: 2
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
    });
    ctx.drawImage(newEnemy.img, newEnemy.x, newEnemy.y, newEnemy.width, newEnemy.height);
    ctx.drawImage(playerCursor.img, playerCursor.x - playerCursor.width / 2, playerCursor.y - playerCursor.height / 2);
    newEnemy.y += newEnemy.speed;
}, 1000 / 60);
