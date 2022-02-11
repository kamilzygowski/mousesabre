var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var interval = 0;
var mouseImg = new Image(64, 64);
mouseImg.src = 'https://i.postimg.cc/sDSjbD7K/mouse.png';
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
setInterval(function () {
    nextFrameBegin();
    var newEnemy = {
        img: new Image(),
        width: 40,
        height: 40,
        x: Math.floor(Math.random() * window.innerWidth),
        y: 0
    };
    interval++;
    if (interval % 1356) {
        console.log(newEnemy);
        newEnemy.img.src = 'https://i.postimg.cc/MZ05K17Q/enemy.png';
    }
    ctx.drawImage(newEnemy.img, newEnemy.x, newEnemy.y, newEnemy.width, newEnemy.height);
    newEnemy.y++;
    onmousemove = function (e) {
        ctx.drawImage(mouseImg, e.clientX - mouseImg.width / 2, e.clientY - mouseImg.height / 2);
    };
}, 1000 / 60);
