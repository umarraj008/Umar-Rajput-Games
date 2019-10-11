const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;
var dt;

var scrollOffset = {
    x: 0,
    y: 0,
}

var guns = {
    pistol: {r: 20000, s: 10, i: 20},
    ak: {r: 20000, s: 10, i: 20},
}

var player = {
    x: 0,
    y: 0,
    a: 0,
    image: null,
    gun: guns.pistol,
    
    dir: {
        left: false,
        right: false,
        up: false,
        down: false,
    },
    
    bullets: [],
    shoot: false,
    canShoot: true,
    health: 100,
}

var playerIMG = document.getElementById("player");
var playerShootIMG = document.getElementById("shoot");

var enemies = [];
var gridRows = [];
var gridCols = [];

var score = 0;
var gameOver = false;

class Enemy {
    constructor(xPOS, yPOS, size, range) {
        this.x = xPOS;
        this.y = yPOS;
        this.s = size;
        this.r = range;
    }
}

class bull {
    constructor(X, Y, R, S) {
        this.speed = S;
        this.x = X;
        this.y = Y;
        this.xv = this.speed * Math.cos(player.a - (90 / 180 * Math.PI));
        this.yv = this.speed * Math.sin(player.a - (90 / 180 * Math.PI));
        this.range = R;
        this.count = 0;
    }
}

var EnemyMoveSpeed = 1;
var scrollSpeed = 5;
var bullSpeed = 10;
var ShootCount = 0;
//var ShootInterval = 1000;

//ENEMIES SETUP
for (i = 0; i < 200; i++) {
    SpawnEnemy(300);    
}

var ROWoffset = 0;
var COLSoffset = 0;
var rows = 20;
var cols = 12;
var GRIDoffsetX = 0;
var GRIDoffsetY = 0;
var GridSpeed = 5;
//gridSetup
for (i = 0; i < rows; i++) {
    gridRows.push({x:-(c.width / 2) + ROWoffset, y: 0});
    ROWoffset += c.width / rows;
}

for (i = 0; i < cols; i++) {
    gridCols.push({x: 0, y:-(c.height / 2) + COLSoffset});
    COLSoffset += c.height / cols;
}

function SpawnEnemy(start) {
    var xP = getRandomInt(-2000, 2000);
    var yP = getRandomInt(-2000, 2000);
    
    while (!(Math.abs(xP) > start && Math.abs(yP) > start)) {
        xP = getRandomInt(-2000, 2000);
        yP = getRandomInt(-2000, 2000);
        
        if((Math.abs(xP) > start && Math.abs(yP) > start)) {
            enemies.push(new Enemy(xP, yP, 30, 500));
            return;
        }
    }
}

function draw() {
    //base
    if (!gameOver) {
        ctx.fillStyle = "white";

    } else {
        ctx.fillStyle = "red";        
    }
    ctx.fillRect(0, 0, c.width, c.height);
    
    ctx.save();
    ctx.translate(960, 540);
    //grid
    for (i = 0; i < gridRows.length; i++) {
        ctx.fillStyle = "grey";
        ctx.fillRect(gridRows[i].x - 2 + GRIDoffsetX, -c.height / 2, 4, c.height);
    }
    
    for (i = 0; i < gridCols.length; i++) {
        ctx.fillStyle = "grey";
        ctx.fillRect(-c.width / 2, gridCols[i].y - 2 + GRIDoffsetY, c.width, 4);
    }
    
    ctx.restore();
    
    ctx.save();
    ctx.translate(960, 540);
    ctx.rotate(player.a);

    
    //player
    //ctx.fillStyle = "blue";
    //ctx.fillRect(0 - 25, 0 - 25, 50, 50);
    ctx.drawImage(player.image, -100, -100, 200, 200);
    
    ctx.restore();
    
    ctx.save();
    
    //set world pos
    ctx.translate(960, 540);
    
    
    
    //enemies
    for (i = 0; i < enemies.length; i++) {
        ctx.fillStyle = "red";
        
        //draw enemies on screen
        if (!(enemies[i].x  + scrollOffset.x + 960 < 0 || enemies[i].x  + scrollOffset.x + 960 > c.width ||
            enemies[i].y  + scrollOffset.y + 540 < 0 || enemies[i].y  + scrollOffset.y + 540 > c.height)) {
            ctx.fillRect(enemies[i].x - (enemies[i].s / 2) + scrollOffset.x, enemies[i].y - (enemies[i].s / 2) + scrollOffset.y, enemies[i].s, enemies[i].s);
        }
    }
    
    //bullets
    for (i = 0; i < player.bullets.length; i++) {
        ctx.fillStyle = "gold";
        //ctx.fillRect(player.bullets[i].x - 10 + scrollOffset.x, player.bullets[i].y - 10 + scrollOffset.y, 20, 20)
        
        ctx.beginPath();
        ctx.ellipse(player.bullets[i].x + scrollOffset.x, player.bullets[i].y + scrollOffset.y,
                    10, 10, Math.PI / 4, 0, 2 * Math.PI)
        ctx.fill(); 
    }
    
    
    ctx.restore();
    
    
    //MAP
    ctx.fillStyle = "rgba(200,200,200,0.5)";
    ctx.fillRect(0,0,480,270)
    
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = "4";
    ctx.strokeRect(0,0,480,270)
    
    ctx.save();
    ctx.scale(0.2,0.2);
    ctx.translate(1200, 675);
    ctx.fillStyle = "blue";
    ctx.fillRect(-25,-25,50,50)
    
    for (i = 0; i < enemies.length; i++) {
        ctx.fillStyle = "red";
        
        //draw enemies on screen
        if (!(enemies[i].x  + scrollOffset.x + 960 < 0 - 240 || enemies[i].x  + scrollOffset.x + 960 > c.width + 240 ||
            enemies[i].y  + scrollOffset.y + 540 < 0 - 135 || enemies[i].y  + scrollOffset.y + 540 > c.height + 135)) {
            ctx.fillRect(enemies[i].x - (enemies[i].s / 2) + scrollOffset.x, enemies[i].y - (enemies[i].s / 2) + scrollOffset.y, enemies[i].s, enemies[i].s);
        }
    }
    ctx.restore();
    
    //health Bar
    ctx.fillStyle = "lime";
    ctx.fillRect(460 ,c.height / 2 - 15 + 500 ,player.health * 10,30)
    
    ctx.fillStyle = "black";
    ctx.font = "40px roboto";
    ctx.fillText("Score: " + score, c.width - 200,60);
}

var f = 90 / 180 * Math.PI;

function playerMove() {
    
    
    if (player.dir.left) {
        scrollOffset.x += scrollSpeed //* Math.cos(player.a);
        GRIDoffsetX += GridSpeed;
    } 
    
    if (player.dir.right) {
        scrollOffset.x -= scrollSpeed //* Math.cos(player.a);
        GRIDoffsetX -= GridSpeed;
    } 
    
    if (player.dir.up) {
        scrollOffset.y += scrollSpeed //* Math.sin(player.a - f);
        GRIDoffsetY += GridSpeed;
    } 
    
    if (player.dir.down) {
        scrollOffset.y -= scrollSpeed //* Math.sin(player.a - f);
        GRIDoffsetY -= GridSpeed;
    }
    
    ShootCount += dt;
    
    if (ShootCount > player.gun.i) {
        player.canShoot = true;
    } else {
        player.canShoot = false;
    }
    
    
    if (player.shoot && player.canShoot) {
        Shoot();
        ShootCount = 0;
    } else {
        player.image = playerIMG;
    }
    
    
    //grid lines
    for(i = 0; i < gridRows.length; i++) {
        if (gridRows[i].x + GRIDoffsetX <= -c.width / 2) {
            GRIDoffsetX += c.width / rows;
        }
        
        if (gridRows[i].x + GRIDoffsetX >= c.width / 2) {
            GRIDoffsetX -= c.width / rows;
        }
                
    }
    
    for(i = 0; i < gridCols.length; i++) {
        if (gridCols[i].y + GRIDoffsetY <= -c.height / 2) {
            GRIDoffsetY += c.height / cols;
        }
        
        if (gridCols[i].y + GRIDoffsetY >= c.height / 2) {
            GRIDoffsetY -= c.height / cols;
        }
                
    }
    
    //enemies follow temp
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].x + scrollOffset.x > player.x - enemies[i].r && enemies[i].x + scrollOffset.x < player.x + enemies[i].r &&
           enemies[i].y + scrollOffset.y < player.y + enemies[i].r && enemies[i].y + scrollOffset.y > player.y - enemies[i].r) {
            //right
            if (enemies[i].x + scrollOffset.x < player.x) {
                enemies[i].x += EnemyMoveSpeed;
            }
            
            //left
            if (enemies[i].x + scrollOffset.x > player.x) {
                enemies[i].x -= EnemyMoveSpeed;
            }
            
            //down
            if (enemies[i].y + scrollOffset.y < player.y) {
                enemies[i].y += EnemyMoveSpeed;
            }
            
            //up
            if (enemies[i].y + scrollOffset.y > player.y) {
                enemies[i].y -= EnemyMoveSpeed;
            }
        }
        
        //right
            if (enemies[i].x + scrollOffset.x < player.x) {
                enemies[i].x += 0.2;
            }
            
            //left
            if (enemies[i].x + scrollOffset.x > player.x) {
                enemies[i].x -= 0.2;
            }
            
            //down
            if (enemies[i].y + scrollOffset.y < player.y) {
                enemies[i].y += 0.2;
            }
            
            //up
            if (enemies[i].y + scrollOffset.y > player.y) {
                enemies[i].y -= 0.2;
            }
        
        if (enemies[i].x + scrollOffset.x > player.x - 25 && enemies[i].x + scrollOffset.x < player.x + 25 &&
           enemies[i].y + scrollOffset.y < player.y + 25 && enemies[i].y + scrollOffset.y > player.y - 25) {
            player.health--;
        }
    }
    
    if (player.health <= 0) {
        EnemyMoveSpeed = 0;
        player.health = 0;
        gameOver = true;
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
                score++;
                SpawnEnemy(300);
                break;
            }
            
            
            if (player.bullets[i].count >= player.bullets[i].range) {
                player.bullets.splice(i,1);
                break;
            } else {
                player.bullets[i].count += 1;
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
    player.image = playerShootIMG;
    player.bullets.push(new bull(-scrollOffset.x, -scrollOffset.y, player.gun.r, player.gun.s));
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    if (!gameOver) {
        playerMove();
        bulletMove();
    }
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
    
    if (event.keyCode == 37 || event.keyCode == 65) {
        //LEFT
        player.dir.left = true;
    }else if (event.keyCode == 39 || event.keyCode == 68) {
        //RIGHT
        player.dir.right = true;
    } else if (event.keyCode == 38 || event.keyCode == 87) {
        //UP
        player.dir.up = true;
    }else if (event.keyCode == 40 || event.keyCode == 83) {
        //DOWN
        player.dir.down = true;
    }else if (event.keyCode == 32 && player.canShoot) {
        //SPACE
        player.shoot = true;
        player.image = playerShootIMG;
    }
   
    
});

document.addEventListener("keyup", event => {
   
    if (event.keyCode == 37 || event.keyCode == 65) {
        //LEFT
        player.dir.left = false;
    }else if (event.keyCode == 39 || event.keyCode == 68) {
        //RIGHT
        player.dir.right = false;
    } else if (event.keyCode == 38 || event.keyCode == 87) {
        //UP
        player.dir.up = false;
    }else if (event.keyCode == 40 || event.keyCode == 83) {
        //DOWN
        player.dir.down = false;
    }else if (event.keyCode == 32) {
        //SPACE
        player.shoot = false;
        player.canShoot = true;
    }
});

document.addEventListener("click", event => {
    if (player.canShoot) {
        Shoot();
        player.image = playerShootIMG;
    }
    
    //console.log((player.a) * 180 / Math.PI, (player.a / 180 * Math.PI) * 180 / Math.PI);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

update();