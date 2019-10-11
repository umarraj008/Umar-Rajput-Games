const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;
var dt;

var scrollOffset = {
    x: 0,
    y: 0,
}

var player = {
    x: 0,
    y: 0,
    a: 0,
    
    dir: {
        left: null,
        right: null,
        up: null,
        down: null,
    },
    
    bullets: [],
}

var bull = {
    x: 960,
    y: 540,
}

var enemies = [];

class Enemy {
    constructor(xPOS, yPOS, size) {
        this.x = xPOS;
        this.y = yPOS;
        this.s = size;
    }
}

var scrollSpeed = 5;
var bullSpeed = 10;

//ENEMIES SETUP
for (i = 0; i < 200; i++) {
    
    var xP = getRandomInt(-900, 900);
    var yP = getRandomInt(-600, 600);
    
    enemies.push(new Enemy(xP, yP, 30));
    
}


function draw() {
    //base
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);
    
    
    //player
    ctx.fillStyle = "blue";
    ctx.fillRect(960 - 25, 540 - 25, 50, 50);
    
    
    ctx.save();
    
    //set world pos
    ctx.translate(960, 540);
    ctx.rotate(player.a);

    
    
    //enemies
    for (i = 0; i < enemies.length; i++) {
        ctx.fillStyle = "red";
        ctx.fillRect(enemies[i].x - (enemies[i].s / 2) + scrollOffset.x, enemies[i].y - (enemies[i].s / 2) + scrollOffset.y, enemies[i].s, enemies[i].s);
    }
    
    //bullets
    for (i = 0; i < player.bullets.length; i++) {
        ctx.fillStyle = "yellow";
        //ctx.fillRect(player.bullets[i].x - 10 + scrollOffset.x, player.bullets[i].y - 10 + scrollOffset.y, 20, 20)
        
        ctx.beginPath();
        ctx.ellipse(player.bullets[i].x + scrollOffset.x, player.bullets[i].y + scrollOffset.y,
                    10, 10, Math.PI / 4, 0, 2 * Math.PI)
        ctx.fill(); 
    }
    
    
    ctx.restore();
    
    //MOUSE
//    ctx.fillStyle = "orange";
//    ctx.fillRect(MouseX - 5, MouseY - 5, 10, 10);
//
//    ctx.beginPath();
//    ctx.moveTo(MouseX, MouseY);
//    ctx.lineTo(960, 540);
//    ctx.lineWidth = "4px";
//    ctx.strokeStyle = "orange"
//    ctx.stroke()
}

var f = 90 / 180 * Math.PI;

function playerMove() {
    
    
    if (player.dir.left) {
        scrollOffset.x += scrollSpeed * Math.cos(player.a);
        scrollOffset.y -= scrollSpeed * Math.sin(player.a);
    } 
    
    if (player.dir.right) {
        scrollOffset.x -= scrollSpeed * Math.cos(player.a);
        scrollOffset.y += scrollSpeed * Math.sin(player.a);
    } 
    
    if (player.dir.up) {
        scrollOffset.x += scrollSpeed * Math.cos(player.a - f);
        scrollOffset.y -= scrollSpeed * Math.sin(player.a - f);
    } 
    
    if (player.dir.down) {
        scrollOffset.x -= scrollSpeed * Math.cos(player.a - f);
        scrollOffset.y += scrollSpeed * Math.sin(player.a - f);
    }
    
}

function bulletMove() {

    for (var i = 0; i < player.bullets.length; i++) {
        player.bullets[i].x += player.bullets[i].xv;
        player.bullets[i].y += player.bullets[i].yv;
     
        for (e = 0; e < enemies.length; e++) {
            if (player.bullets[i].x < enemies[e].x + enemies[e].s && player.bullets[i].x > enemies[e].x - enemies[e].s &&
               player.bullets[i].y < enemies[e].y + enemies[e].s && player.bullets[i].y > enemies[e].y - enemies[e].s) {
                player.bullets.splice(i,1);
                enemies.splice(e,1);
                break;
            }
            
        }
        
        //remove bullet touching edge
//        if (player.bullets[i].x < 0 || player.bullets[i].x > c.width || 
//            player.bullets[i].y < 0 || player.bullets[i].y > c.height) {
//            player.bullets.splice(i, 1);
//        }
    }
}

function Shoot() {
    var dir;
    if (MouseX < 960) {
        dir = 180 - player.a;
    }else if (MouseX > 960) {
        dir = -180 - player.a;
    }
    
    dir = dir / 180 * Math.PI;
    
    dir = (90/180*Math.PI) - dir;
    
    //dir = 0;
    
    
    console.log(player.a);
    player.bullets.push({
        x: (-scrollOffset.x),
        y: (-scrollOffset.y),
        xv: bullSpeed * Math.cos(dir - player.a),
        yv: bullSpeed * Math.sin(dir - player.a),
    });
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;

    playerMove();
    bulletMove();
    draw();
    requestAnimationFrame(update);
}

function find_angle(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    var ANSWER = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
    
    if (A.x < B.x) {
        return -ANSWER;
    } else if (A.x > B.x) {
        return ANSWER
    }
}

document.onmousemove = handleMouseMove;
var MouseX;
var MouseY;
function handleMouseMove(event) {

	event = event || window.event; // IE-ism
    
	//MouseX = event.pageX;
	//MouseY = event.pageY;
    
    var rect = canvas.getBoundingClientRect()
    
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
    
    MouseX = Math.abs((event.clientX - rect.left) * scaleX);
    MouseY = Math.abs((event.clientY - rect.top) * scaleY);
   
    
    player.a = find_angle({x:MouseX, y:MouseY}, {x:960, y:540}, {x:960, y:440})
    //MouseX = event.clientX;
    //MouseY = event.clientY;
    
    if (player.a == undefined || player.a == null || player.a == NaN || player.a < -360 || player.a > 360) {
        
        if (MouseY > 540) {
            player.a = 180 / 180 * Math.PI;
        } else {
            player.a = 360 / 180 * Math.PI;
        }
    }
    
    //player.a = player.a * 180 / Math.PI
}

//INPUT
document.addEventListener("keydown", event => {
    
    switch(event.keyCode) {
        //LEFT
        case 37: player.dir.left = true;
            break;
        
        case 65: player.dir.left = true;
            break;
        
        //RIGHT
        case 39: player.dir.right = true;
            break;
        
        case 68: player.dir.right = true;
            break;
        
        //UP
        case 38: player.dir.up = true;
            break;
        
        case 87: player.dir.up = true;
            break;
        
        //DOWN
        case 40: player.dir.down = true;
            break;
        
        case 83: player.dir.down = true;
            break;
        
        case 32: 
            Shoot();
            break;
        
    }
    
});

document.addEventListener("keyup", event => {
   
      switch(event.keyCode) {
        //LEFT
        case 37: player.dir.left = false;
            break;
        
        case 65: player.dir.left = false;
            break;
        
        //RIGHT
        case 39: player.dir.right = false;
            break;
        
        case 68: player.dir.right = false;
            break;
        
        //UP
        case 38: player.dir.up = false;
            break;
        
        case 87: player.dir.up = false;
            break;
        
        //DOWN
        case 40: player.dir.down = false;
            break;
        
        case 83: player.dir.down = false;
            break;
    }
});

document.addEventListener("click", event => {
    Shoot();
    
    //console.log((player.a) * 180 / Math.PI, (player.a / 180 * Math.PI) * 180 / Math.PI);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

update();