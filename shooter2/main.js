const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;
var dt;

var displayMenu = true;
var howToPlay = false;

//testing
var s1 = true;
var s2 = true;

var menu = {
    buttons: {
        play: {x: c.width / 2 - 565, y: c.height / 2 - 100 + 50, w: 350, h: 200, over: false, 
               color: "rgba(10,10,10,0.5)", highlight: "rgba(0,0,0,0.7)", 
               text: {string: "Play", x: c.width / 2 - 390, y: c.height / 2 + 15 + 50, color: "white", size: "50px roboto"}},
        
        quit: {x: c.width / 2 - 175, y: c.height / 2 - 100 + 50, w: 350, h: 200, over: false, 
               color: "rgba(10,10,10,0.5)", highlight: "rgba(0,0,0,0.7)", 
               text: {string: "Quit", x: c.width / 2, y: c.height / 2 + 15 + 50, color: "white", size: "50px roboto"}},
        
        HTP: {x: c.width / 2 + 215, y: c.height / 2 - 100 + 50, w: 350, h: 200, over: false, 
              color: "rgba(10,10,10,0.5)", highlight: "rgba(0,0,0,0.7)", 
              text: {string: "How to Play", x: c.width / 2 + 390, y: c.height / 2 + 15 + 50, color: "white", size: "50px roboto"}},
        
        back: {x: c.width / 2 - 175, y: c.height / 2 + 300, w: 350, h: 200, over: false, 
               color: "rgba(10,10,10,0.5)", highlight: "rgba(0,0,0,0.7)", 
               text: {string: "Back", x: c.width / 2, y: c.height / 2 + 410, color: "white", size: "50px roboto"}},
        
        gameBack: {x: c.width / 2 - 175, y: c.height / 2 + 300 - 200, w: 350, h: 200, over: false, 
               color: "rgba(10,10,10,0.5)", highlight: "rgba(0,0,0,0.7)", 
               text: {string: "Back to Menu", x: c.width / 2, y: c.height / 2 + 410 - 200, color: "white", size: "50px roboto"}},
    },
}

var scrollOffset = {
    x: 0,
    y: 0,
}

// RANGE SPEED INCREMENT/per DAMAGE IMAGE
var guns = {
    empty: {r: 0, s: 0, i: 0, d: 0, image: document.getElementById("null")},
    pistol: {r: 40000, s: 20, i: 500, d: 25, image: document.getElementById("pistol")},
    ak: {r: 40000, s: 20, i: 50, d: 50, image: document.getElementById("ak")},
}

var playerIMG = document.getElementById("player");
var playerShootIMG = document.getElementById("shoot");
var playerDamageImg = document.getElementById("damage");
var howToPlayIMG = document.getElementById("HTP");

var player = {
    x: 0,
    y: 0,
    a: 0,
    image: playerIMG,
    gun: [guns.pistol, guns.ak, guns.empty, guns.empty, guns.empty],
    
    dir: {
        left: false,
        right: false,
        up: false,
        down: false,
    },
    gunSelection: 0,
    bullets: [],
    shoot: false,
    canShoot: true,
    health: 100,
    canDamage: true,
    gracePeriodCount: 0,
    healCount: 0,
    healTime: 300,
    healIncrement: 0.02,
}

var enemies = [];
var gridRows = [];
var gridCols = [];

var score = 0;
var gameOver = false;
var barColor = "lime";
var gamePause = false;

var EnemyParticles = [];
var particleSpots = [];

class particle {
    constructor(xPOS, yPOS, size, col, dec) {
        this.x = xPOS;
        this.y = yPOS;
        this.s = size;
        this.color = col;
        this.decay = dec;
        this.count = 0;
    }
}

class Enemy {
    constructor(xPOS, yPOS, size, range, health, C, D) {
        this.x = xPOS;
        this.y = yPOS;
        this.s = size;
        this.r = range;
        this.h = health;
        this.color = C;
        this.damage = D;
    }
}

class bull {
    constructor(X, Y, R, S, D) {
        this.speed = S;
        this.x = X;
        this.y = Y;
        this.xv = this.speed * Math.cos(player.a - (90 / 180 * Math.PI));
        this.yv = this.speed * Math.sin(player.a - (90 / 180 * Math.PI));
        this.range = R;
        this.count = 0;
        this.damage = D;
    }
}

var EnemyMoveSpeed = 1;
var scrollSpeed = 5;
var bullSpeed = 10;
var ShootCount = 0;
//var ShootInterval = 1000;

//ENEMIES SETUP
for (i = 0; i < 1000; i++) {
    SpawnEnemy(300, 100, "red", 10);    
}

var GRIDoffset2X = 0;
var GRIDoffset2Y = 0;


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

function SpawnEnemy(start, health, col, dam) {
    var xP = getRandomInt(-2000, 2000);
    var yP = getRandomInt(-2000, 2000);
    
    while (!(Math.abs(xP) > start && Math.abs(yP) > start)) {
        xP = getRandomInt(-2000, 2000);
        yP = getRandomInt(-2000, 2000);
        
        if((Math.abs(xP) > start && Math.abs(yP) > start)) {
            enemies.push(new Enemy(xP, yP, 30, 500, health, col, dam));
            return;
        }
    }
}

function SpawnEnemy2(x, y, health, col, dam, siz) {
    enemies.push(new Enemy(x, y, siz, 500, health, col, dam));
}

function drawMenu() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,c.width,c.height);
    
    ctx.save();
    ctx.translate(960, 540);
    //grid
    for (i = 0; i < gridRows.length; i++) {
        ctx.fillStyle = "grey";
        ctx.fillRect(gridRows[i].x - 2 + GRIDoffset2X, -c.height / 2, 4, c.height);
    }
    
    for (i = 0; i < gridCols.length; i++) {
        ctx.fillStyle = "grey";
        ctx.fillRect(-c.width / 2, gridCols[i].y - 2 + GRIDoffset2Y, c.width, 4);
    }
    ctx.restore();
    
    if (!howToPlay) {
        //TITLE
        ctx.fillStyle = "rgb(20, 0, 0)"; 
        ctx.font = "200px roboto";
        ctx.textAlign = "center";
        ctx.fillText("Shooter", c.width / 2, c.height / 2 - 200 + 90);

        //WARNING
        ctx.fillStyle = "rgb(255, 0, 0)"; 
        ctx.font = "40px roboto";
        ctx.textAlign = "center";
        ctx.fillText("Game is Still in Development", c.width / 2, c.height / 2 - 200 + 390);
        
        //PLAY BUTTON
        if (menu.buttons.play.over) {
            ctx.fillStyle = menu.buttons.play.highlight;
            ctx.fillRect(menu.buttons.play.x, menu.buttons.play.y, menu.buttons.play.w, menu.buttons.play.h);

        } else {
            ctx.fillStyle = menu.buttons.play.color;
            ctx.fillRect(menu.buttons.play.x, menu.buttons.play.y, menu.buttons.play.w, menu.buttons.play.h);
        }

        ctx.fillStyle = menu.buttons.play.text.color; 
        ctx.font = menu.buttons.play.text.size;
        ctx.textAlign = "center";
        ctx.fillText(menu.buttons.play.text.string, menu.buttons.play.text.x, menu.buttons.play.text.y);

        //QUIT BUTTON
        if (menu.buttons.quit.over) {
            ctx.fillStyle = menu.buttons.quit.highlight;
            ctx.fillRect(menu.buttons.quit.x, menu.buttons.quit.y, menu.buttons.quit.w, menu.buttons.quit.h);

        } else {
            ctx.fillStyle = menu.buttons.quit.color;
            ctx.fillRect(menu.buttons.quit.x, menu.buttons.quit.y, menu.buttons.quit.w, menu.buttons.quit.h);
        }

        ctx.fillStyle = menu.buttons.quit.text.color; 
        ctx.font = menu.buttons.quit.text.size;
        ctx.textAlign = "center";
        ctx.fillText(menu.buttons.quit.text.string, menu.buttons.quit.text.x, menu.buttons.quit.text.y);

        //HOW TO PLAY BUTTON
        if (menu.buttons.HTP.over) {
            ctx.fillStyle = menu.buttons.HTP.highlight;
            ctx.fillRect(menu.buttons.HTP.x, menu.buttons.HTP.y, menu.buttons.HTP.w, menu.buttons.HTP.h);

        } else {
            ctx.fillStyle = menu.buttons.HTP.color;
            ctx.fillRect(menu.buttons.HTP.x, menu.buttons.HTP.y, menu.buttons.HTP.w, menu.buttons.HTP.h);
        }

        ctx.fillStyle = menu.buttons.HTP.text.color; 
        ctx.font = menu.buttons.HTP.text.size;
        ctx.textAlign = "center";
        ctx.fillText(menu.buttons.HTP.text.string, menu.buttons.HTP.text.x, menu.buttons.HTP.text.y);
    } else { //HOW TO PLAY
        //TITLE
        ctx.fillStyle = "rgb(20, 0, 0)"; 
        ctx.font = "160px roboto";
        ctx.textAlign = "center";
        ctx.fillText("How to Play", c.width / 2, c.height / 2 - 370);

        //BACK BUTTON

        if (menu.buttons.back.over) {
            ctx.fillStyle = menu.buttons.back.highlight;
            ctx.fillRect(menu.buttons.back.x, menu.buttons.back.y, menu.buttons.back.w, menu.buttons.back.h);

        } else {
            ctx.fillStyle = menu.buttons.back.color;
            ctx.fillRect(menu.buttons.back.x, menu.buttons.back.y, menu.buttons.back.w, menu.buttons.back.h);
        }
        
        ctx.fillStyle = menu.buttons.back.text.color; 
        ctx.font = menu.buttons.back.text.size;
        ctx.textAlign = "center";
        ctx.fillText(menu.buttons.back.text.string, menu.buttons.back.text.x, menu.buttons.back.text.y);
        
        
        //image
        ctx.drawImage(howToPlayIMG, 50,220);
    }
    
    GRIDoffset2X -= 1;
    GRIDoffset2Y -= 1;
    
    for(i = 0; i < gridRows.length; i++) {
        if (gridRows[i].x + GRIDoffset2X <= -c.width / 2) {
            GRIDoffset2X += c.width / rows;
        }
        
        if (gridRows[i].x + GRIDoffset2X >= c.width / 2) {
            GRIDoffset2X -= c.width / rows;
        }
                
    }
    
    for(i = 0; i < gridCols.length; i++) {
        if (gridCols[i].y + GRIDoffset2Y <= -c.height / 2) {
            GRIDoffset2Y += c.height / cols;
        }
        
        if (gridCols[i].y + GRIDoffset2Y >= c.height / 2) {
            GRIDoffset2Y -= c.height / cols;
        }
                
    }
}

function draw() {
    //base
    ctx.fillStyle = "white";      
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
    
    for (i = 0; i < particleSpots.length; i++) {
        for(p = 0; p < particleSpots[i].length; p++) {
            ctx.fillStyle = particleSpots[i][p].color;    
            ctx.fillRect(particleSpots[i][p].x - (particleSpots[i][p].s / 2) + scrollOffset.x, particleSpots[i][p].y - (particleSpots[i][p].s / 2) + scrollOffset.y, particleSpots[i][p].s, particleSpots[i][p].s);    
        } 
    }
    
    //enemies
    for (i = 0; i < enemies.length; i++) {
        ctx.fillStyle = enemies[i].color;
        
        //draw enemies on screen
        if (!(enemies[i].x  + scrollOffset.x + 960 < 0 || enemies[i].x  + scrollOffset.x + 960 > c.width ||
            enemies[i].y  + scrollOffset.y + 540 < 0 || enemies[i].y  + scrollOffset.y + 540 > c.height)) {
            ctx.fillRect(enemies[i].x - (enemies[i].s / 2) + scrollOffset.x, enemies[i].y - (enemies[i].s / 2) + scrollOffset.y, enemies[i].s, enemies[i].s);
            
            //draw healthbars
            
            //bar empty
            ctx.fillStyle = "rgba(200,200,200,0.5)";
            ctx.fillRect(enemies[i].x - (enemies[i].s / 2) + scrollOffset.x - 10, enemies[i].y - (enemies[i].s / 2) + scrollOffset.y - 15, 
                         50, 10)
            
            //bar color fill
            ctx.fillStyle = "red";
            ctx.fillRect(enemies[i].x - (enemies[i].s / 2) + scrollOffset.x - 10, enemies[i].y - (enemies[i].s / 2) + scrollOffset.y - 15, 
                         ((enemies[i].h / 1000) * 50), 10);
            
            //bar outline
            ctx.strokeStyle = "rgba(0,0,0,0.8)";
            ctx.lineWidth = "2";
            ctx.strokeRect(enemies[i].x - (enemies[i].s / 2) + scrollOffset.x - 10, enemies[i].y - (enemies[i].s / 2) + scrollOffset.y - 15, 
                         50, 10)
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
        ctx.fillStyle = enemies[i].color;
        
        //draw enemies on screen
        if (!(enemies[i].x  + scrollOffset.x + 960 < 0 - 240 || enemies[i].x  + scrollOffset.x + 960 > c.width + 240 ||
            enemies[i].y  + scrollOffset.y + 540 < 0 - 135 || enemies[i].y  + scrollOffset.y + 540 > c.height + 135)) {
            ctx.fillRect(enemies[i].x - (enemies[i].s / 2) + scrollOffset.x, enemies[i].y - (enemies[i].s / 2) + scrollOffset.y, enemies[i].s, enemies[i].s);
            
        }
    }
    ctx.restore();
    
    //health Bar
    //bar background
    ctx.fillStyle = "rgba(200,200,200,0.5)";
    ctx.fillRect(460 ,c.height / 2 - 15 + 500 ,1000,30)
    
    //bar green
    ctx.fillStyle = barColor;
    ctx.fillRect(460 ,c.height / 2 - 15 + 500 ,player.health * 10,30)
    
    //bar outline
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = "4";
    ctx.strokeRect(460 ,c.height / 2 - 15 + 500 ,1000,30)
    
    //score text
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.font = "40px roboto";
    ctx.fillText("Kills: " + score, c.width - 20,60);
    
    //location COORDS
    ctx.fillStyle = "black"; 
    ctx.textAlign = "left"; 
    ctx.font = "40px roboto";
    ctx.fillText("X: " + scrollOffset.x + " Y: " + scrollOffset.y, 20, 320);
    
    //gun rack display
    ctx.fillStyle = "rgba(200,200,200,0.5)";
    ctx.fillRect(20 ,c.height / 2 - 15 + 440 ,420,90);
    
    //outline //76
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = "4";
    ctx.strokeRect(20 ,c.height / 2 - 15 + 440 ,420,90);
    
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = "4";
    ctx.beginPath();
    ctx.moveTo(20 + 84, c.height / 2 - 15 + 440);
    ctx.lineTo(20 + 84,c.height / 2 - 15 + 530);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(20 + 84 * 2, c.height / 2 - 15 + 440);
    ctx.lineTo(20 + 84 * 2,c.height / 2 - 15 + 530);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(20 + 84 * 3, c.height / 2 - 15 + 440);
    ctx.lineTo(20 + 84 * 3,c.height / 2 - 15 + 530);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(20 + 84 * 4, c.height / 2 - 15 + 440);
    ctx.lineTo(20 + 84 * 4,c.height / 2 - 15 + 530);
    ctx.stroke();
    
    //BAR SELECTION HIGHLIGHT
    if(player.gunSelection == 0) {
        ctx.fillStyle = "rgba(33,214,255,0.5)";
        ctx.fillRect(20,c.height / 2 - 15 + 440 ,84,90);
        
    }else if(player.gunSelection == 1) {
        ctx.fillStyle = "rgba(33,214,255,0.5)";
        ctx.fillRect(104,c.height / 2 - 15 + 440 ,84,90);
        
    }else if(player.gunSelection == 2) {
        ctx.fillStyle = "rgba(33,214,255,0.5)";
        ctx.fillRect(188,c.height / 2 - 15 + 440 ,84,90);
        
    }else if(player.gunSelection == 3) {
        ctx.fillStyle = "rgba(33,214,255,0.5)";
        ctx.fillRect(272,c.height / 2 - 15 + 440 ,84,90);
        
    }else if(player.gunSelection == 4) {
        ctx.fillStyle = "rgba(33,214,255,0.5)";
        ctx.fillRect(356,c.height / 2 - 15 + 440 ,84,90);
    }
    
    //DRAW PISTOL IN BAR
    DrawGunInRack(guns.pistol);
    DrawGunInRack(guns.ak);
    
    //PAUSE OVERLAY MUST BE AT BOTTOM
    if (gamePause) {
        ctx.fillStyle = "rgba(200,200,200,0.7)";
        ctx.fillRect(0 ,0, c.width, c.height)

        ctx.fillStyle = "black"; 
        ctx.font = "80px roboto";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", c.width / 2, c.height / 2 + 30);
        
        //BACK BUTTON
        if (menu.buttons.gameBack.over) {
            ctx.fillStyle = menu.buttons.gameBack.highlight;
            ctx.fillRect(menu.buttons.gameBack.x, menu.buttons.gameBack.y, menu.buttons.gameBack.w, menu.buttons.gameBack.h);

        } else {
            ctx.fillStyle = menu.buttons.gameBack.color;
            ctx.fillRect(menu.buttons.gameBack.x, menu.buttons.gameBack.y, menu.buttons.gameBack.w, menu.buttons.gameBack.h);
        }
        
        ctx.fillStyle = menu.buttons.gameBack.text.color; 
        ctx.font = menu.buttons.gameBack.text.size;
        ctx.textAlign = "center";
        ctx.fillText(menu.buttons.gameBack.text.string, menu.buttons.gameBack.text.x, menu.buttons.gameBack.text.y);

    }
    
    //GAMEOVER OVERLAY MUST BE AT BOTTOM
    if (gameOver) {
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.fillRect(0 ,0, c.width, c.height)

        ctx.fillStyle = "rgb(20, 0, 0)"; 
        ctx.font = "160px roboto";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", c.width / 2, c.height / 2 + 40);
        
        //BACK BUTTON
        if (menu.buttons.gameBack.over) {
            ctx.fillStyle = menu.buttons.gameBack.highlight;
            ctx.fillRect(menu.buttons.gameBack.x, menu.buttons.gameBack.y, menu.buttons.gameBack.w, menu.buttons.gameBack.h);

        } else {
            ctx.fillStyle = menu.buttons.gameBack.color;
            ctx.fillRect(menu.buttons.gameBack.x, menu.buttons.gameBack.y, menu.buttons.gameBack.w, menu.buttons.gameBack.h);
        }
        
        ctx.fillStyle = menu.buttons.gameBack.text.color; 
        ctx.font = menu.buttons.gameBack.text.size;
        ctx.textAlign = "center";
        ctx.fillText(menu.buttons.gameBack.text.string, menu.buttons.gameBack.text.x, menu.buttons.gameBack.text.y);

    }
}

function drawGun(x, y, g) {
    switch(g){
        case guns.pistol: 
            ctx.drawImage(g.image, x,y, 70, 70);
            break;
        
        case guns.ak: 
            ctx.drawImage(g.image, x,y, 70, 70);
            break;
    }
}

function DrawGunInRack(g) {
    if (player.gun[0]== g) {
        drawGun(20 + 7, c.height / 2 - 15 + 448, g)
    } 
    
    if (player.gun[1] == g) {
        drawGun(104 + 7, c.height / 2 - 15 + 448, g)
    } 
    
    if (player.gun[2] == g) {
        drawGun(188 + 7, c.height / 2 - 15 + 448, g)
    } 
    
    if (player.gun[3] == g) {
        drawGun(272 + 7, c.height / 2 - 15 + 448, g)
    } 
    
    if (player.gun[4] == g) {
        drawGun(356 + 7, c.height / 2 - 15 + 448, g)
    } 
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
    
    if (ShootCount > player.gun[player.gunSelection].i) {
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
    
    
    if (player.health <= 0) {
        EnemyMoveSpeed = 0;
        player.health = 0;
        gameOver = true;
    }
    
    if (!player.canDamage) {
        player.gracePeriodCount += 1;
        
        if (player.gracePeriodCount >= 0 && player.gracePeriodCount < 17.5) {
            barColor = "red"
            player.image = playerDamageImg;
        }else if (player.gracePeriodCount >= 17.5 && player.gracePeriodCount < 35) {
            barColor = "lime"
            player.image = playerIMG;
        }else if (player.gracePeriodCount >= 35 && player.gracePeriodCount < 52.5) {
            barColor = "red"
            player.image = playerDamageImg;
        }else if (player.gracePeriodCount >= 52.5 && player.gracePeriodCount < 70) {
            barColor = "lime"
            player.image = playerIMG;
        }
    }
    
    if (!player.canDamage && player.gracePeriodCount > 70) {
        player.gracePeriodCount = 0;
        player.canDamage = true;
        barColor = "lime";
    }
    
    
    if (score > 100 && s1) {
        for (i = 0; i< 2000; i++) {
            SpawnEnemy(300, 100, "red", 10);
            
        }
        s1 = false
    }
    if (score > 500 && s2) {
        
        for (i = 0; i< 1000; i++) {
            SpawnEnemy(400, 500, "green", 20);
        }
        s2 = false
    }
    
    if (player.health < 100 && player.canDamage && player.healCount > player.healTime) {
        player.health += player.healIncrement;
    }
    
    player.healCount += 1;
    
}


function EnemyMove() {
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
            
            //ANTI ENEMY CLUMP
            for (e = 0; e < enemies.length; e++) {
                if (enemies[i].x + scrollOffset.x - enemies[i].s < enemies[e].x + enemies[e].s + scrollOffset.x && 
                    enemies[i].x + scrollOffset.x + enemies[i].s > enemies[e].x - enemies[e].s + scrollOffset.x &&
                    enemies[i].y + scrollOffset.y - enemies[i].s < enemies[e].y + enemies[e].s + scrollOffset.y &&
                    enemies[i].y + scrollOffset.y + enemies[i].s > enemies[e].y - enemies[e].s + scrollOffset.y) {
                    //right
                    if (enemies[i].x + scrollOffset.x < enemies[e].x + scrollOffset.x) {
                        enemies[i].x -= 1;
                    }

                    //left
                    if (enemies[i].x + scrollOffset.x > enemies[e].x + scrollOffset.x) {
                        enemies[i].x += 1;
                    }

                    //down
                    if (enemies[i].y + scrollOffset.y < enemies[e].y + scrollOffset.y) {
                        enemies[i].y -= 1;
                    }

                    //up
                    if (enemies[i].y + scrollOffset.y > enemies[e].y + scrollOffset.y) {
                        enemies[i].y += 1;
                    }
                }
                
            }
            
        }
        
        //MOVE TO PLAYER SLOWLY
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
        
        //ENEMY COLLISION WITH PLAYER
        if (enemies[i].x + scrollOffset.x > player.x - 25 && enemies[i].x + scrollOffset.x < player.x + 25 &&
           enemies[i].y + scrollOffset.y < player.y + 25 && enemies[i].y + scrollOffset.y > player.y - 25) {
            DamagePlayer(enemies[i].damage);
            
        }
    }
}


function DamagePlayer(amount) {
    if (player.canDamage) {
        player.health -= amount;
        barColor = "red";
        player.canDamage = false;
        player.healCount = 0;
    }
}

function bulletMove() {

    for (var i = 0; i < player.bullets.length; i++) {
        player.bullets[i].x += player.bullets[i].xv;
        player.bullets[i].y += player.bullets[i].yv;
     
        //bullet enemy collision
        for (e = 0; e < enemies.length; e++) {
            if (player.bullets[i].x < enemies[e].x + enemies[e].s && player.bullets[i].x > enemies[e].x - enemies[e].s &&
               player.bullets[i].y < enemies[e].y + enemies[e].s && player.bullets[i].y > enemies[e].y - enemies[e].s) {
                KillEnemy(i, e, enemies[e].x, enemies[e].y)
                SpawnEnemy(300, 100, "red", 10);
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

function KillEnemy(bullet, enemy, ex, ey) {
    player.bullets.splice(bullet,1);
    
    enemies[enemy].h -= player.gun[player.gunSelection].d;
    if (enemies[enemy].h <= 0) {
        var parts = [
            new particle(ex, ey, 5, "red", 50),
            new particle(ex, ey, 5, "red", 50),
            new particle(ex, ey, 5, "red", 50),
            new particle(ex, ey, 5, "red", 50),
            new particle(ex, ey, 5, "red", 50),
            new particle(ex, ey, 5, "red", 50),
            new particle(ex, ey, 5, "red", 50),
            new particle(ex, ey, 5, "red", 50),
        ]
        particleSpots.push(parts);
        enemies.splice(e,1);
        score++;    
    }
}

function Shoot() {
    player.image = playerShootIMG;
    player.bullets.push(new bull(-scrollOffset.x, -scrollOffset.y, player.gun[player.gunSelection].r, player.gun[player.gunSelection].s));
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    if (!displayMenu) {
        if (!gamePause) {
            if (!gameOver) {
                particlesAnim();
                EnemyMove();
                playerMove();
                bulletMove();
            }
        }
        draw();
    } else {
        drawMenu();
    }
    requestAnimationFrame(update);
}

function particlesAnim() {
    for (i = 0; i < particleSpots.length; i++) {
        for (p = 0; p < particleSpots[i].length; p++) {
            particleSpots[i][p].count++;
            
            if (p == 0) {
                particleSpots[i][p].y -= 1.5;
            }
            if (p == 1) {
                particleSpots[i][p].x += 1;
                particleSpots[i][p].y -= 1;
            }
            if (p == 2) {
                particleSpots[i][p].x += 1.5;
            }
            if (p == 3) {
                particleSpots[i][p].x += 1;
                particleSpots[i][p].y += 1;
            }
            if (p == 4) {
                particleSpots[i][p].y += 1.5;
            }
            if (p == 5) {
                particleSpots[i][p].x -= 1;
                particleSpots[i][p].y += 1;
            }
            if (p == 6) {
                particleSpots[i][p].x -= 1.5;
            }
            if (p == 7) {
                particleSpots[i][p].x -= 1;
                particleSpots[i][p].y -= 1;
            }
            
        }
        
        if (particleSpots[i][0].count > particleSpots[i][0].decay) {
            particleSpots.splice(i, 1);
        }
    }

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
document.onmousedown = MouseDown;
document.onmouseup = MouseUp;
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
    
    //MENU BUTTON HIGHLIGHT
    if (displayMenu) {
        if (MouseX <= (menu.buttons.play.x + menu.buttons.play.w) && MouseX >= menu.buttons.play.x &&
            MouseY <= (menu.buttons.play.y + menu.buttons.play.h) && MouseY >= menu.buttons.play.y) {
            menu.buttons.play.over = true;
        } else {
            menu.buttons.play.over = false;
        }
        
        if (MouseX <= (menu.buttons.quit.x + menu.buttons.quit.w) && MouseX >= menu.buttons.quit.x &&
            MouseY <= (menu.buttons.quit.y + menu.buttons.quit.h) && MouseY >= menu.buttons.quit.y) {
            menu.buttons.quit.over = true;
        } else {
            menu.buttons.quit.over = false;
        }
        
        if (MouseX <= (menu.buttons.HTP.x + menu.buttons.HTP.w) && MouseX >= menu.buttons.HTP.x &&
            MouseY <= (menu.buttons.HTP.y + menu.buttons.HTP.h) && MouseY >= menu.buttons.HTP.y) {
            menu.buttons.HTP.over = true;
        } else {
            menu.buttons.HTP.over = false;
        }
        
        if (MouseX <= (menu.buttons.back.x + menu.buttons.back.w) && MouseX >= menu.buttons.back.x &&
            MouseY <= (menu.buttons.back.y + menu.buttons.back.h) && MouseY >= menu.buttons.back.y) {
            menu.buttons.back.over = true;
        } else {
            menu.buttons.back.over = false;
        }
        
    }
    
    if (gamePause || gameOver) {
        if (MouseX <= (menu.buttons.gameBack.x + menu.buttons.gameBack.w) && MouseX >= menu.buttons.gameBack.x &&
            MouseY <= (menu.buttons.gameBack.y + menu.buttons.gameBack.h) && MouseY >= menu.buttons.gameBack.y) {
            menu.buttons.gameBack.over = true;
        } else {
            menu.buttons.gameBack.over = false;
        }
    }
    
}

function MouseDown(event) {
    player.shoot = true;
    player.image = playerShootIMG;
}

function MouseUp(event) {
    player.shoot = false;
    player.canShoot = true;
}

//INPUT
document.addEventListener("keydown", event => {
    if (!displayMenu) {
        if (!gamePause) {
            if (!gameOver) {
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
                }else if (event.keyCode == 49) {
                    player.gunSelection = 0;
                }else if (event.keyCode == 50) {
                    player.gunSelection = 1;
                }else if (event.keyCode == 51) {
                    player.gunSelection = 2;
                }else if (event.keyCode == 52) {
                    player.gunSelection = 3;
                }else if (event.keyCode == 53) {
                    player.gunSelection = 4;
                } 
            }
        }

        if ((event.keyCode == 80 || event.keyCode == 27) && !gameOver) {
            gamePause = !gamePause;
        }
    }
});

document.addEventListener("keyup", event => {
    if (!displayMenu) {
        if (!gamePause) {
            if (!gameOver) {
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
            }
        }
    }
});

document.addEventListener("click", event => {
    if (!displayMenu) {
        if (!gamePause) {
            if (!gameOver) {
                
            } else {
                if (MouseX <= (menu.buttons.gameBack.x + menu.buttons.gameBack.w) && MouseX >= menu.buttons.gameBack.x &&
                    MouseY <= (menu.buttons.gameBack.y + menu.buttons.gameBack.h) && MouseY >= menu.buttons.gameBack.y) {
                    location.reload();
                }
            }
        } else {
            if (MouseX <= (menu.buttons.gameBack.x + menu.buttons.gameBack.w) && MouseX >= menu.buttons.gameBack.x &&
                MouseY <= (menu.buttons.gameBack.y + menu.buttons.gameBack.h) && MouseY >= menu.buttons.gameBack.y) {
                location.reload();
            }
        }
    } else {
        if (MouseX <= (menu.buttons.play.x + menu.buttons.play.w) && MouseX >= menu.buttons.play.x &&
            MouseY <= (menu.buttons.play.y + menu.buttons.play.h) && MouseY >= menu.buttons.play.y) {
            displayMenu = false;
        }else if (MouseX <= (menu.buttons.quit.x + menu.buttons.quit.w) && MouseX >= menu.buttons.quit.x &&
            MouseY <= (menu.buttons.quit.y + menu.buttons.quit.h) && MouseY >= menu.buttons.quit.y) {
            location.href = "../index.html";
        }else if (MouseX <= (menu.buttons.HTP.x + menu.buttons.HTP.w) && MouseX >= menu.buttons.HTP.x &&
            MouseY <= (menu.buttons.HTP.y + menu.buttons.HTP.h) && MouseY >= menu.buttons.HTP.y) {
            howToPlay = true;
        }else if (MouseX <= (menu.buttons.back.x + menu.buttons.back.w) && MouseX >= menu.buttons.back.x &&
            MouseY <= (menu.buttons.back.y + menu.buttons.back.h) && MouseY >= menu.buttons.back.y) {
            howToPlay = false;
        }
        
    }
    
    //console.log((player.a) * 180 / Math.PI, (player.a / 180 * Math.PI) * 180 / Math.PI);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

update();