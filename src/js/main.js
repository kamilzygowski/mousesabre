var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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
    onmousemove = function (e) {
        nextFrameBegin();
        console.log(e.clientX, e.clientY);
        ctx.drawImage(mouseImg, e.clientX - mouseImg.width / 2, e.clientY - mouseImg.height / 2);
    };
}, 1000 / 60);
