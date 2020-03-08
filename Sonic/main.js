// JavaScript Document

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
ctx.imageSmoothingEnabled = false;
let lastTime = 0;
var dt;

var sonicFace = document.getElementById("sFace");
var myLogo = document.getElementById("ml");
var BBG = document.getElementById("bbg");
var FBG = document.getElementById("fbg");
var lockIMG = document.getElementById("lock");
var backgroundImg = document.getElementById("background");
var htpInfoIMG = document.getElementById("htp");
var htpTextIMG = document.getElementById("htpText");
var titleIMG = document.getElementById("title");
var spritesheet = document.getElementById("ss");
var gSpritesheet = document.getElementById("gss");
var platformsIMG = document.getElementById("platforms");
var lsTitleIMG = document.getElementById("lsTitle");
var ywTitleIMG = document.getElementById("ywTitle");
var goTitleIMG = document.getElementById("goTitle");
var waterIMG = document.getElementById("water");
var paralaxSpeed = {p1: 4, p2: 2};
var background1X = 0;
var background2X = 0;
var background3X = 0;
var l2Unlock = false; // FALSE ON RELEASE
var l3Unlock = false; // FALSE ON RELEASE
var state = "loading"; // "loading" ON RELEASE
var menuPulse = 0;
var menuZoom = true;
var menuBackScrollX1 = 0;
var menuBackScrollX2 = 0;
var scroll = {x: 0, y: 0, boundLeft: 400, boundRight: 1100, smoothing: 0.5, speed: 15};

var loadingCircleR = 0;

var transisionOut = {
    enabled: false,
    x: 0,
    speed: 0.02,
    state: null,
    color: "#000",
}

var transisionIn = {
    enabled: false,
    x: 1,
    speed: 0.03,
    color: "#000",
}

var buttons = {
       	play: {x: 40, y: c.height / 2 - 120, w: 420, h: 100, over: false, color: "rgba(128, 14, 62, 1)", highcolor: "rgb(52, 143, 235)", text: {string: "", color: "white", size: "50px", xOff: 0, yOff: 20}},
	
        quit: {x: 40, y: c.height / 2, w: 420, h: 100, over: false, color: "rgba(128, 14, 62, 1)", highcolor: "rgb(52, 143, 235)", text: {string: "", color: "white", size: "50px", xOff: 0, yOff: 20}},
        
        HTP: {x: 40, y: c.height / 2 + 120, w: 420, h: 100, over: false, color: "rgba(128, 14, 62, 1)", highcolor: "rgb(52, 143, 235)", text: {string: "", color: "white", size: "50px", xOff: 0, yOff: 20}},
    
        back: {x: c.width / 2 - 210, y: c.height - 140, w: 420, h: 100, over: false, color: "rgba(128, 14, 62, 1)", highcolor: "rgb(52, 143, 235)", text: {string: "", color: "white", size: "50px", xOff: 0, yOff: 20}},
}

var player = new function() {
    //menu
	this.menuX = 1000;
	this.menuY = 650;
    
    //level select
    this.lSelectX = 450;
    
    //game
    this.x = 500;
    this.y = 0;
    this.yVel = 0;
    this.jumping = false;
    this.jumpHeight = 30;
    this.jumpSpeed = 10;
    this.grounded = false;
    this.left = false;
    this.right = false;
    this.speed = 15;
    this.gravity = 2;
    this.width = 150;
    this.height = 200;
    //this.width = 600;
    //this.height = 700;
    this.canJump = true;
    this.dead = false;
    this.deathDown = false;
    this.boundingBox = false;
    
    //animation
    this.state = "walk";
    this.fCount = 0;
	this.images = [
        //idle
        {x: 180, y: 1036, w: 30, h: 40}, //0
        {x: 213, y: 1036, w: 30, h: 40}, //1
        {x: 244, y: 1036, w: 30, h: 40}, //2
        {x: 213, y: 1036, w: 30, h: 40}, //3

        //walk right
        {x: 319, y: 330, w: 30, h: 40}, //4
        {x: 351, y: 330, w: 30, h: 40}, //5
        {x: 385, y: 330, w: 30, h: 40}, //6
        {x: 422, y: 330, w: 30, h: 40}, //7
        {x: 458, y: 330, w: 30, h: 40}, //8
        {x: 491, y: 330, w: 30, h: 40}, //9
        {x: 526, y: 330, w: 30, h: 40}, //10
        {x: 562, y: 330, w: 30, h: 40}, //11
        
        //walk left
        {x: 563, y: 379, w: 30, h: 40}, //12
        {x: 531, y: 379, w: 30, h: 40}, //13
        {x: 497, y: 379, w: 30, h: 40}, //14
        {x: 460, y: 379, w: 30, h: 40}, //15
        {x: 424, y: 379, w: 30, h: 40}, //16
        {x: 391, y: 379, w: 30, h: 40}, //17
        {x: 356, y: 379, w: 30, h: 40}, //18
        {x: 320, y: 379, w: 30, h: 40}, //19
        
        //jump
        {x: 315, y: 444, w: 30, h: 40}, //20
        {x: 365, y: 444, w: 30, h: 40}, //21
        {x: 415, y: 444, w: 30, h: 40}, //22
        {x: 465, y: 444, w: 30, h: 40}, //23
        {x: 515, y: 444, w: 30, h: 40}, //24
        {x: 565, y: 444, w: 30, h: 40}, //25
        
        //dead
        {x: 219, y: 906, w: 33, h: 40}, //26
        
    ]
    this.c = 0;
    
	    
    this.draw = function() {
        //ctx.drawImage(sonicImg, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        //ctx.save();
        ctx.drawImage(spritesheet, 
                      this.images[this.fCount].x, this.images[this.fCount].y, this.images[this.fCount].w, this.images[this.fCount].h, 
                      
                      this.x - (this.width / 2), 
                      this.y - (this.height / 2), 
                      this.width, 
                      this.height);
        
        
        //col box
        if (this.boundingBox) {
            ctx.strokeStyle = "red"
            ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        
            
        switch (this.state) {
            case "idle":
                this.c += dt;
                if (this.c > 200) {
                    this.c = 0;
                    this.fCount++;

                    if (this.fCount > 3) {
                        this.fCount = 0;
                    }
                }
                break;
            
            case "walkR":
                this.c += dt;
                if (this.c > 50) {
                    this.c = 0;
                    this.fCount++;

                    if (this.fCount > 11) {
                        this.fCount = 4;
                    }
                }
                break;
                
            case "walkL":
                this.c += dt;
                if (this.c > 50) {
                    this.c = 0;
                    this.fCount++;

                    if (this.fCount > 19) { //19 12
                        this.fCount = 12;
                    }
                }
                break;
            
            case "jump":
                this.c += dt;
                if (this.c > 50) {
                    this.c = 0;
                    this.fCount++;

                    if (this.fCount > 25) { //19 12
                        this.fCount = 25;
                    }
                }
                break;
                
            case "dead":
                this.c += dt;
                if (this.c > 50) {
                    this.c = 0;
                    this.fCount++;

                    if (this.fCount > 26) { //19 12
                        this.fCount = 26;
                    }
                }
                break;
        }

        //ctx.fillStyle = "red";
        //ctx.strokeStyle = "red";
        //ctx.fillRect(this.x - 5, this.y - 5, 10, 10)
        //ctx.strokeRect(this.x - this.width2 / 2, this.y - this.height2 / 2, this.width2, this.height2)
        
    }
       
    var xP = 0;
    this.drawMenu = function() {
        //ctx.drawImage(sonicImg, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        //ctx.save();
        xP+= 0.01;
        ctx.drawImage(spritesheet, 
                      this.images[this.fCount].x, this.images[this.fCount].y, this.images[this.fCount].w, this.images[this.fCount].h, 
                      
                      this.menuX - (this.width / 2) + 200 + (Math.sin(xP) * 200), 
                      this.menuY - (this.height / 2), 
                      this.width, 
                      this.height);
        
        
        this.c += dt;
        if (this.c > 130) {
            this.c = 0;
            this.fCount++;

            if (this.fCount > 11) {
                this.fCount = 4;
            }
                
        }

        //ctx.fillStyle = "red";
        //ctx.strokeStyle = "red";
        //ctx.fillRect(this.x - 5, this.y - 5, 10, 10)
        //ctx.strokeRect(this.x - this.width2 / 2, this.y - this.height2 / 2, this.width2, this.height2)
    }
    
    this.lSelectDraw = function() {
        
        ctx.drawImage(spritesheet, 
                      this.images[this.fCount].x, this.images[this.fCount].y, this.images[this.fCount].w, this.images[this.fCount].h, 
                      
                      this.lSelectX - (this.width / 2), 
                      (c.height / 2) - this.height / 2 - 60, 
                      this.width, 
                      this.height);
        
        
        this.c += dt;
        if (this.c > 130) {
            this.c = 0;
            this.fCount++;

            if (this.fCount > 11) {
                this.fCount = 4;
            }
                
        }

        //ctx.fillStyle = "red";
        //ctx.strokeStyle = "red";
        //ctx.fillRect(this.x - 5, this.y - 5, 10, 10)
        //ctx.strokeRect(this.x - this.width2 / 2, this.y - this.height2 / 2, this.width2, this.height2)
    }
    
    
    this.move = function() {
        
        //player move left right
        if (this.left) {
            if (this.grounded && !this.jumping) {
                this.state = "walkL";
            }
            
            this.x-= this.speed;
        
        } else if (this.right) {
            if (this.grounded && !this.jumping) {
                this.state = "walkR";
            }
            
            this.x+= this.speed;
        
        }
        
        if (!this.right && !this.left && this.grounded && !this.jumping) {
            this.state = "idle"
        }
        
        
        //platform collision - set grounded val
        if (this.groundCol()) {
            
            if (!this.grounded) {
                var t = this.find_colided_platform();

                if (this.y + this.height / 2 > platforms1[t].y) {
                    this.y -= ((this.y + (this.height / 2)) - platforms1[t].y);
                }
            }
            
            this.canJump = true;
            this.grounded = true;
            
        } else {
            this.grounded = false;
        }
        
        
        //gravity
        if (!this.grounded && !this.jumping) {
            this.yVel += this.gravity;
        } else if (this.grounded) {
            this.yVel = 0;
        }
        
        
        //jumping
        if (this.jumping) {
            this.state = "jump";
            this.grounded = false;
            this.yVel -= this.jumpSpeed;
            if (Math.abs(this.yVel) > this.jumpHeight) {
                this.jumping = false;
            }
        }
        
        //dead
        if ((this.y - this.height / 2) > c.width) {
            scroll.x = 0;
            this.yVel = 0;
            this.right = false;
            this.left = false;
            this.jumping = false;
            this.grounded = false;
            this.dead = true;
            this.y = c.height + this.height / 2;
        }
        
        
        //camera scroll
        if (player.x > scroll.boundRight) {
            if(Math.abs(scroll.x) < scroll.speed) {
                scroll.x -= 2;
            }
        } else if (player.x < scroll.boundLeft) {
            if(Math.abs(scroll.x) < scroll.speed) {
                scroll.x += 2;
            }
        } else {
            if (Math.abs(scroll.x) > 0) {
                if (scroll.x > 0) {
                    scroll.x -= scroll.smoothing;
                } else {
                    scroll.x += scroll.smoothing;
                }

                if (Math.abs(scroll.x) <= 0.2) {
                    scroll.x = 0;
                }
            } else {
                scroll.x = 0;
            }
        }
        
        background1X = background1X + (scroll.x / paralaxSpeed.p1);
        background2X = background2X + (scroll.x / paralaxSpeed.p2);
        background3X = background3X + (scroll.x / paralaxSpeed.p2);
        this.y += this.yVel; 
        this.x = this.x + scroll.x; 
    
    }
    
    this.find_colided_platform = function() {
        for (i = 0; i < platforms1.length; i++) {
            if (this.platformTOPcol(platforms1[i].x, platforms1[i].y, platforms1[i].width, platforms1[i].height)) {
                return i;
            }
        }
    }
    
    this.collisionAABB = function(px, py, pw, ph) {
        if (this.x - (this.width / 2) < px + pw &&
            this.x + (this.width / 2) > px &&
            this.y - (this.height / 2) < py + ph &&
            this.y + (this.height / 2) > py) {
            return true;
        } else {return false};
    }
    
    this.platformTOPcol = function(p1,p2,p3,p4) {
        if (this.collisionAABB(p1,p2,p3,p4) && 
            this.y + (this.width /4) <= p2) {
            
            return true;
            
        } else {return false};
    }
    
    this.groundCol = function() {
        if (state = "l1") {
            var p = platforms1;
            if (this.platformTOPcol(p[0].x, p[0].y, p[0].width, p[0].height) ||
                this.platformTOPcol(p[1].x, p[1].y, p[1].width, p[1].height)) {
                return true;
            } else {
                return false;
            }
        }
    }
    
    this.reset = function(start_posX, start_posY, p) {
        
        background1X = 0;
        background2X = 0;
        background3X = 0;

        for (i = 0; i < p.length; i++) {
            p[i].x = p[i].startPos;
        }
         
        this.x = start_posX;
        this.y = start_posY;
        this.yVel = 0;
        this.jumping = false;
        this.deathDown = false;
        this.grounded = false;
        this.left = false;
        this.right = false;
        this.canJump = true;
        this.dead = false;
        this.state = "walk";
        this.fCount = 0;
    }
    
}

var water = {
    fCount: 0,
	images: [       
        {x: 0, y: 0, w: 255, h: 107}, 
        {x: 261, y: 0, w: 255, h: 107}, 
        {x: 522, y: 0, w: 255, h: 107}, 
        {x: 783, y: 0, w: 255, h: 107},
    ],
    c: 0,
    
    draw: function(x, y) {
        ctx.drawImage(waterIMG, 
                      this.images[this.fCount].x, this.images[this.fCount].y, this.images[this.fCount].w, this.images[this.fCount].h, 
                      
                      x, 
                      y, 
                      510, 
                      440); //214
        
        
        this.c += dt;
        if (this.c > 1000) {
            this.c = 0;
            this.fCount++;

            if (this.fCount > 3) {
                this.fCount = 0;
            }
                
        }

    }
}

class platform {
    constructor(x_pos, y_pos, wid, hei, i) {
        this.x = x_pos;
        this.y = y_pos;
        this.width = wid;
        this.height = hei;
        this.img = i;
        this.startPos = x_pos;
    }
    
    draw() {
        ctx.drawImage(this.img, 0, 38, 256, 70, 
                      this.x,this.y,this.width,this.height);
        
        this.x = this.x + scroll.x;
    }
}

// X Y W H IMG
var platforms1 = [new platform(0, 800, 1920, 500, platformsIMG),
                  new platform(1920, 800, 6000, 500, platformsIMG)];

//platform setup



function DrawMenu() {
    //base
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, c.width, c.height);

	//background
	ctx.drawImage(backgroundImg, menuBackScrollX1, 0, c.width, c.height)
	ctx.drawImage(backgroundImg, menuBackScrollX1 + c.width, 0, c.width, c.height)
	
    //ground
    ctx.drawImage(platformsIMG, 0, 35, 256, 50, 
                  menuBackScrollX2, c.height - 355, c.width, 355);
    
    ctx.drawImage(platformsIMG, 0, 35, 256, 50, 
                  menuBackScrollX2 + c.width, c.height - 355, c.width, 355);
    
	//sonic
	player.drawMenu();
    
    //move background
    menuBackScrollX1 -= 1.15;
    menuBackScrollX2 -= 2.3;
    
    
    if (menuBackScrollX1 <= -c.width) {
        menuBackScrollX1 = 0;
    }
    
    if (menuBackScrollX2 <= -c.width) {
        menuBackScrollX2 = 0;
    }
	
	//grey back
	ctx.fillStyle = "rgb(23,23,23,0.6)"
	ctx.fillRect(0,0,500,c.height);
	
	//title
    if (menuZoom) {
        menuPulse += 0.02;
        
        if (menuPulse > 2) {
            menuPulse = 2;
            menuZoom = false;
        }
    }
    
    
    ctx.save()
    ctx.translate(1250,300);
    if (menuZoom) {
        ctx.scale(Math.sin(menuPulse), Math.sin(menuPulse))
    } else {
        ctx.scale(Math.sin(menuPulse), Math.sin(menuPulse));
    }
	ctx.drawImage(titleIMG, -500,-250,1000,500)
    ctx.restore();
    
	//buttons
	drawButton(buttons.play);
	drawButton(buttons.quit);
	drawButton(buttons.HTP);
    
    //button text
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(htpTextIMG, 150,320,500,100, 160, 425, 500, 100)
    ctx.drawImage(htpTextIMG, 150,420,500,100, 170, 530, 500, 100)
    ctx.drawImage(htpTextIMG, 20,540,500,100, 80, 665, 400, 90)
    ctx.imageSmoothingEnabled = false;
    
    //draw logo
    ctx.drawImage(myLogo, c.width - 110, c.height - 100, 100,100);
    
    transisIn();
    transisOut();
}

function DrawLevelSelect() {
    
    //base
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, c.width, c.height);

    //line
	ctx.fillStyle = "#b1ffda";
    ctx.fillRect(0, c.height / 2 - 25, c.width, 50);
    
    //levels
    ctx.fillStyle = "#f0923e";
    ctx.fillRect(c.width / 2 - 50, c.height / 2 - 50, 100, 100);
    ctx.fillRect(c.width / 2 - 50 - 500, c.height / 2 - 50, 100, 100);
    ctx.fillRect(c.width / 2 - 50 + 500, c.height / 2 - 50, 100, 100);
    
    //locks
    if (!l2Unlock) {
        ctx.drawImage(lockIMG, c.width / 2 - 50, c.height / 2 -70);
    }
    
    if (!l3Unlock) {
        ctx.drawImage(lockIMG, c.width / 2 + 450, c.height / 2 - 70);
    }
    
    //level label
    ctx.drawImage(htpTextIMG, 700,120,630,100, c.width / 2 - 615, 570, 600, 100);
    ctx.drawImage(htpTextIMG, 700,210,630,100, c.width / 2 - 120, 570, 600, 100);
    ctx.drawImage(htpTextIMG, 700,310,630,100, c.width / 2 + 375, 570, 600, 100);
    
    //title
    ctx.drawImage(lsTitleIMG, c.width / 2 - 609,40);
    
    
    //player
    player.lSelectDraw();
    
    
    
    transisIn();
    transisOut();
}

function DrawHTP() {
	//base
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, c.width, c.height);
	
    //background
	ctx.drawImage(backgroundImg, menuBackScrollX1, 0, c.width, c.height)
	ctx.drawImage(backgroundImg, menuBackScrollX1 + c.width, 0, c.width, c.height)
	
    //ground
    ctx.drawImage(platformsIMG, 0, 35, 256, 50, 
                  menuBackScrollX2, c.height - 355, c.width, 355);
    
    ctx.drawImage(platformsIMG, 0, 35, 256, 50, 
                  menuBackScrollX2 + c.width, c.height - 355, c.width, 355);
    
	//sonic
	player.drawMenu();
    
    //move background
    menuBackScrollX1 -= 1.15;
    menuBackScrollX2 -= 2.3;
    
    
    if (menuBackScrollX1 <= -c.width) {
        menuBackScrollX1 = 0;
    }
    
    if (menuBackScrollX2 <= -c.width) {
        menuBackScrollX2 = 0;
    }
	
	//grey back
	ctx.fillStyle = "rgb(23,23,23,0.6)"
	ctx.fillRect(0,c.height - 200, c.width,c.height);
	ctx.fillStyle = "rgb(23,23,23,0.6)"
	ctx.fillRect(1300, c.height - 340, c.width,140);
	
    //text
    ctx.drawImage(htpTextIMG, 0,0,630,400, 1300, 750, 600, 400);
    
	//title
	ctx.drawImage(titleIMG, c.width / 2 - 500,20,1000,500)
    
    //graphic
	ctx.drawImage(htpInfoIMG, 40, 500);
    
	//buttons
	drawButton(buttons.back);
    
    //button text
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(htpTextIMG, 700,0,630,120, c.width / 2 - 118, c.height - 165, 600, 120)
    ctx.imageSmoothingEnabled = false;
    
    transisIn();
    transisOut();
}

function Level1() {
    
    //base
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, c.width, c.height);

    //paralax background 1
    ctx.drawImage(BBG, background1X ,0, 1920, c.height);
    ctx.drawImage(BBG, background1X + 1920 ,0, 1920, c.height);
    ctx.drawImage(BBG, background1X + -1920 ,0, 1920, c.height);
    
    if (background1X <= -c.width) {
        background1X = 0;
    }
    
    if (background1X >= c.width) {
        background1X = 0;
    }
    
    //paralax background 1 //1122x88
    ctx.drawImage(FBG, background2X ,215, 6144, 528);
    ctx.drawImage(FBG, background2X + 6144,215, 6144, 528);
    ctx.drawImage(FBG, background2X - 6144,215, 6144, 528);
    
    if (background2X <= -6144) {
        background2X = 0;
    }
    
    if (background2X >= 6144) {
        background2X = 0;
    }
    
    //paralax water
    water.draw(background3X - 510, 731)
    water.draw(background3X, 731);
    water.draw(background3X + 510, 731);
    water.draw(background3X + 1020, 731);
    water.draw(background3X + 1530, 731);
    water.draw(background3X + 2040, 731);
    //water.draw(background2X + 3040, 731);
    //water.draw(background2X + 3550, 731);
    //water.draw(background2X + 4060, 731);
    //water.draw(background2X + 4570, 731);
    
    if (background3X <= -510) {
        background3X = 0;
    }
    
    if (background3X >= 510) {
        background3X = 0;
    }
    
    //player
    player.draw();
    
    
    //platforms
    for (i = 0; i < platforms1.length; i++) {
        platforms1[i].draw();
    }
    
    
    //dead
    if (player.dead) {
        player.fCount = 26;
        player.state = "dead"
        
        if(player.y > 200 && !player.deathDown) {
            if (Math.abs(player.yVel) < player.jumpHeight) {
                player.yVel-= player.jumpSpeed;
            }
            
            player.y += player.yVel;
            
            if (player.y <= 600) {
                player.deathDown = true;
            }
        } else if (player.deathDown){
            player.yVel+= player.gravity;
            player.y += player.yVel;
            
            if (player.y - player.height / 2 > c.height) {
                transisionOut.enabled = true;
                transisionOut.state = "go";
                transisOut();
            }
        }
    }
    
	transisIn();
    transisOut();
}

function Level2() {
    
    //base
    ctx.fillStyle = "green";      
    ctx.fillRect(0, 0, c.width, c.height);

    transisIn();
    transisOut();
}

function GameOverDraw() {
    
    //base
    ctx.fillStyle = "green";      
    ctx.fillRect(0, 0, c.width, c.height);

    //base
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, c.width, c.height);

	//background
	ctx.drawImage(backgroundImg, menuBackScrollX1, 0, c.width, c.height)
	ctx.drawImage(backgroundImg, menuBackScrollX1 + c.width, 0, c.width, c.height)
	
    //ground
    ctx.drawImage(platformsIMG, 0, 35, 256, 50, 
                  menuBackScrollX2, c.height - 355, c.width, 355);
    
    ctx.drawImage(platformsIMG, 0, 35, 256, 50, 
                  menuBackScrollX2 + c.width, c.height - 355, c.width, 355);
    
	//sonic
	player.drawMenu();
    
    //move background
    menuBackScrollX1 -= 1.15;
    menuBackScrollX2 -= 2.3;
    
    
    if (menuBackScrollX1 <= -c.width) {
        menuBackScrollX1 = 0;
    }
    
    if (menuBackScrollX2 <= -c.width) {
        menuBackScrollX2 = 0;
    }
    
    //grey back
	ctx.fillStyle = "rgb(23,23,23,0.6)"
	ctx.fillRect(0,c.height - 200, c.width,c.height);
    
    //buttons
	drawButton(buttons.back);
    
    //game over
    ctx.drawImage(goTitleIMG, (c.width / 2) - 756.5, (c.height / 2) - 200);//1513
    
    //button text
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(htpTextIMG, 700,0,630,120, c.width / 2 - 118, c.height - 165, 600, 120)
    ctx.imageSmoothingEnabled = false;
    
    transisIn();
    transisOut();
}

function YouWinDraw() {
    
    //base
    ctx.fillStyle = "green";      
    ctx.fillRect(0, 0, c.width, c.height);

    //base
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, c.width, c.height);

	//background
	ctx.drawImage(backgroundImg, menuBackScrollX1, 0, c.width, c.height)
	ctx.drawImage(backgroundImg, menuBackScrollX1 + c.width, 0, c.width, c.height)
	
    //ground
    ctx.drawImage(platformsIMG, 0, 35, 256, 50, 
                  menuBackScrollX2, c.height - 355, c.width, 355);
    
    ctx.drawImage(platformsIMG, 0, 35, 256, 50, 
                  menuBackScrollX2 + c.width, c.height - 355, c.width, 355);
    
	//sonic
	player.drawMenu();
    
    //move background
    menuBackScrollX1 -= 1.15;
    menuBackScrollX2 -= 2.3;
    
    
    if (menuBackScrollX1 <= -c.width) {
        menuBackScrollX1 = 0;
    }
    
    if (menuBackScrollX2 <= -c.width) {
        menuBackScrollX2 = 0;
    }
    
    //grey back
	ctx.fillStyle = "rgb(23,23,23,0.6)"
	ctx.fillRect(0,c.height - 200, c.width,c.height);
    
    //buttons
	drawButton(buttons.back);
    
    //you win
    ctx.drawImage(ywTitleIMG, (c.width / 2) - 756.5, (c.height / 2) - 200);//1513
    
    //button text
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(htpTextIMG, 700,0,630,120, c.width / 2 - 118, c.height - 165, 600, 120)
    ctx.imageSmoothingEnabled = false;
    
    transisIn();
    transisOut();
}

function Level3() {
    
    //base
    ctx.fillStyle = "blue";      
    ctx.fillRect(0, 0, c.width, c.height);

	transisIn();
    transisOut();
}

function transisOut() {
    if (transisionOut.enabled) {
        
        ctx.save()
        ctx.translate(c.width / 2, c.height / 2);
        ctx.scale(transisionOut.x * 2,transisionOut.x * 2)
        ctx.fillStyle = transisionOut.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 600, 600, 0, 0, 360, false);
        ctx.fill();
        ctx.restore();
        
        ctx.save()
        ctx.translate(c.width / 2, c.height / 2);
        ctx.scale(transisionOut.x,transisionOut.x)
        ctx.drawImage(sonicFace, -596, - 486)
        ctx.restore();
        
        
        
        transisionOut.x += transisionOut.speed;
        
        if (transisionOut.x > 1) {
            transisionOut.enabled = false;
            state = transisionOut.state;
            transisionOut.state = null;
            transisionOut.x = 0;
            transisionIn.enabled = true;
        }
        
//        transisionOut.x += transisionOut.speed;
//        
//        if (transisionOut.x > c.width) {
//            transisionOut.enabled = false;
//            state = transisionOut.state;
//            transisionOut.state = null;
//            transisionOut.x = 0;
//            transisionIn.enabled = true;
//        }
    }
}

function transisIn() {
    
    
    if (transisionIn.enabled) {
        ctx.save()
        ctx.translate(c.width / 2, c.height / 2);
        ctx.scale(transisionIn.x * 2,transisionIn.x * 2)
        ctx.fillStyle = transisionIn.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 600, 600, 0, 0, 360, false);
        ctx.fill();
        ctx.restore();
        
        ctx.save()
        ctx.translate(c.width / 2, c.height / 2);
        ctx.scale(transisionIn.x,transisionIn.x)
        ctx.drawImage(sonicFace, -596, - 486)
        ctx.restore();
        
        transisionIn.x -= transisionIn.speed;
        
        if (transisionIn.x <= 0) {
            transisionIn.enabled = false;
            transisionIn.x = 1;
        }
    }
    
    
//    if (transisionIn.enabled) {
//        ctx.fillStyle = transisionIn.color;
//        ctx.fillRect(transisionIn.x, 0, c.width, c.height)
//        
//        transisionIn.x += transisionIn.speed;
//        
//        if (transisionIn.x > c.width) {
//            transisionIn.enabled = false;
//            transisionIn.x = 0;
//        }
//    }
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    
    switch(state) {
        case "loading":
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,c.width, c.height);
            
            ctx.save();
            ctx.translate(c.width / 2, c.height / 2 - 40);
            ctx.rotate(loadingCircleR);
            ctx.strokeStyle = "white";
            ctx.lineWidth = "15";
            ctx.ellipse(0,0,70,70,0, 2*Math.PI, false, false);
            ctx.stroke();
            
            ctx.fillStyle = "black";
            ctx.fillRect(-10,10, 125, -125);
            ctx.restore();
            
            ctx.textAlign = "center";
            ctx.font = "50px roboto";
            ctx.fillStyle = "white";
            ctx.fillText("Loading", c.width / 2, c.height /2 + 100);
            loadingCircleR+= 0.1;
            break;
        
        case "menu":
            DrawMenu();
            break;
        
        case "lselect":
            DrawLevelSelect();
            break;
			
		case "htp":
			DrawHTP();
			break;
        
        case "l1":
            Level1();
            if (!player.dead) {
                player.move();
            }
            break;
        
        case "l2":
            Level2();
            break;
            
        case "l3":
            Level3();
            break;
               
        case "go":
            GameOverDraw();
            break; 
            
        case "yw":
            YouWinDraw();
            break;
            
        case "sprite":
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,c.width, c.height);
            
            player.draw();
            break;
            
    }

    requestAnimationFrame(update);
}

//BUTTON HANDELERS
function drawButton(b) {
    if (b.highlight) {
        ctx.fillStyle = b.highcolor;
    } else {
        ctx.fillStyle = b.color;
    }
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = b.text.color;
    ctx.textAlign = "center"
    ctx.font = "300 " + b.text.size + " roboto"
    ctx.fillText(b.text.string, b.x + (b.w / 2) + b.text.xOff, b.y + (b.h / 2) + b.text.yOff);
}
function drawBorderButton(b) {
    if (b.highlight) {
        ctx.fillStyle = b.highcolor;
        ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = b.text.color;
    ctx.textAlign = "center"
    ctx.font = "300 " + b.text.size + " roboto"
    ctx.fillText(b.text.string, b.x + (b.w / 2) + b.text.xOff, b.y + (b.h / 2) + b.text.yOff);
}
function buttonHighlight(b, mx, my) {
    if (mx > b.x &&
        mx < b.x + b.w &&
        my > b.y &&
        my < b.y + b.h) {
        b.highlight = true;
    } else {
        b.highlight = false;
    }
}
function buttonClick(b, mx, my) {
    if (b.x < mx &&
        b.x + b.w > mx &&
        b.y < my &&
        b.y + b.h > my) {
        return true
    } else {
        return false;
    }
}
/////////////////


       
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
   
    
    //player.a = find_angle({x:MouseX, y:MouseY}, {x:960, y:540}, {x:960, y:440})
    //MouseX = event.clientX;
    //MouseY = event.clientY;
    
//    if (player.a == undefined || player.a == null || player.a == NaN || player.a < -360 || player.a > 360) {
//        
//        if (MouseY > 540) {
//            player.a = 180 / 180 * Math.PI;
//        } else {
//            player.a = 360 / 180 * Math.PI;
//        }
//    }
    
    //player.a = player.a * 180 / Math.PI
    
    //BUTTON HIGHLIGHT
	switch (state) {
	   case "menu":
		   buttonHighlight(buttons.play, MouseX, MouseY);
		   buttonHighlight(buttons.quit, MouseX, MouseY);
		   buttonHighlight(buttons.HTP, MouseX, MouseY);
		   break;
			
		case "lselect":
			break;
			
		case "htp":
            buttonHighlight(buttons.back, MouseX, MouseY);
			break;
	
		case "go":
            buttonHighlight(buttons.back, MouseX, MouseY);
			break;

		case "yw":
            buttonHighlight(buttons.back, MouseX, MouseY);
			break;

        case "l1":
            break;
			
   }
	
    
}

function MouseDown(event) {
    
}

function MouseUp(event) {
    
}

//INPUT
document.addEventListener("keydown", event => {
    switch (state) {
        case "menu":
            if (event.keyCode == 32 || event.keyCode == 13) {
                transisionOut.enabled = true;
                transisionOut.state = "lselect";
            }
            break;
        
        case "htp":
            if (event.keyCode == 32 || event.keyCode == 13) {
                transisionOut.enabled = true;
                transisionOut.state = "menu";
            }
            break;
            
        case "go":
            if (event.keyCode == 32 || event.keyCode == 13) {
                transisionOut.enabled = true;
                transisionOut.state = "menu";
            }
            break;
               
        case "yw":
            if (event.keyCode == 32 || event.keyCode == 13) {
                transisionOut.enabled = true;
                transisionOut.state = "menu";
            }
            break;
            
        case "lselect":
            if (event.keyCode == 37 || event.keyCode == 65) {
                //LEFT
                switch (player.lSelectX) {
                    case 950:
                        player.lSelectX = 450 
                        break;
                        
                    case 1460:
                        player.lSelectX = 950
                        break;
                }

            }else if (event.keyCode == 39 || event.keyCode == 68) {
                //RIGHT

                switch (player.lSelectX) {
                    case 450:
                        if (l2Unlock) {
                            player.lSelectX = 950;
                        }
                        break;
                        
                    case 950:
                        if (l3Unlock) {
                            player.lSelectX = 1460; 
                        }
                        break;
                }
                
            } else if (event.keyCode == 32 || event.keyCode == 13) {
                //SPACE Or Enter
                switch (player.lSelectX) {
                    case 450:
                        player.reset(500, 0, platforms1);
                        player.state = "idle";
                        transisionOut.state = "l1";
                        transisionOut.enabled = true;
                        break
                    
                    case 950:
                        player.reset(0, 0);
                        player.state = "idle";
                        transisionOut.state = "l2";
                        transisionOut.enabled = true;
                        break

                    case 1460:
                        player.reset(0, 0);
                        player.state = "idle";
                        transisionOut.state = "l3";
                        transisionOut.enabled = true;
                        break
                }
                
            }

            break;
            
        case "l1" || "l2" || "l3":
            
            if (event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 38) {
                //SPACE or Enter or UP
                if (!player.jumping && player.canJump) {
                    player.grounded = true;
                    player.y-= 40;
                    
                }
                
                if (!player.jumping && player.grounded) {
                    player.fCount = 21;
                    player.state = "jump"
                    player.canJump = false;
                    player.jumping = true;
                }
                
                break;
            }
            
            
            if ((event.keyCode == 37 || event.keyCode == 65) && !player.right) {
                player.right = false;
                
                //LEFT
                if (!player.left && player.grounded && !player.jumping) {
                    player.fCount = 13;
                    player.state = "walkL"
                }
                player.left = true;
                
                break;
            } else if ((event.keyCode == 39 || event.keyCode == 68) && !player.left) {
                //RIGHT
                
                player.left = false;
                
                if (!player.right && player.grounded && !player.jumping)  {
                    player.fCount = 5;
                    player.state = "walkR"
                }
                player.right = true;
            
                break;
            }
            
        case "sprite":
            switch (event.keyCode) {
                case 49:
                    player.fCount = 11
                    break;
                
                case 50:
                    player.fCount = 20
                    break;
                
                case 51:
                    player.fCount = 21
                    break;
                
                case 52:
                    player.fCount = 22
                    break;
                
                case 53:
                    player.fCount = 23
                    break;
                
                case 54:
                    player.fCount = 24
                    break;
                case 54:
                    player.fCount = 25
                    break;
                
                case 55:
                    player.fCount = 26
                    break;
            }
            break;
            
    }    

});

document.addEventListener("keypress", event => {
    player.right = false;
    player.left = false;

});

document.addEventListener("keyup", event => {
    switch (state) {
            
            case "l1":
                if (event.keyCode == 37 || event.keyCode == 65) {
                    //LEFT
                    player.left = false;

                }else if (event.keyCode == 39 || event.keyCode == 68) {
                    //RIGHT
                    player.right = false;


                } else if (event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 38) {
                    //SPACE Or Enter
                    
                }

                break;

        }    
});

document.addEventListener("click", event => {
   switch (state) {
	   case "menu":
		   if (buttonClick(buttons.play, MouseX, MouseY)) {
				transisionOut.enabled = true;
                transisionOut.state = "lselect";
		   }
		   if (buttonClick(buttons.quit, MouseX, MouseY)) {
               location.href = "../index.html";
		   }
		   if (buttonClick(buttons.HTP, MouseX, MouseY)) {
				transisionOut.enabled = true;
                transisionOut.state = "htp";
		   }
		   
		   break;
       
       case "htp":
		   if (buttonClick(buttons.back, MouseX, MouseY)) {
				transisionOut.enabled = true;
                transisionOut.state = "menu";
           }
		   break;
           
       case "go":
		   if (buttonClick(buttons.back, MouseX, MouseY)) {
				transisionOut.enabled = true;
                transisionOut.state = "menu";
           }
		   break;
           
       case "yw":
		   if (buttonClick(buttons.back, MouseX, MouseY)) {
				transisionOut.enabled = true;
                transisionOut.state = "menu";
           }
		   break;
   }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genRand(min, max, decimalPlaces) {  
    var rand = Math.random()*(max-min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand*power) / power;
}


//lockIMG src="images/backbackgrdn.png"
//backgroundImg src="images/Logo.png"
//htpInfoIMG src="images/spritesheet.png"
//htpTextIMG src="images/gSpritesheet.png"
//titleIMG src="images/background2.png"
//spritesheet src="images/platforms.png"
//gSpritesheet src="images/htpInfo.png"
//backgroundIMG1 src="images/htpText.png"
//platformsIMG src="images/gameOverTitle.png"
//lsTitleIMG src="images/YouWinTitle.png"
//ywTitleIMG src="images/LevelSelectTitle.png"
//goTitleIMG src="images/lock.png"
//waterIMG src="images/waterSpriteSheet.png"

//set onload event
sFace.onload = function() {imgLoad();}
myLogo.onload = function() {imgLoad();}
BBG.onload = function() {imgLoad();}
FBG.onload = function() {imgLoad();}
lockIMG.onload = function() {imgLoad();}
backgroundImg.onload = function() {imgLoad();}
htpInfoIMG.onload = function() {imgLoad();}
htpTextIMG.onload = function() {imgLoad();}
titleIMG.onload = function() {imgLoad();}
spritesheet.onload = function() {imgLoad();}
gSpritesheet.onload = function() {imgLoad();}
platformsIMG.onload = function() {imgLoad();}
lsTitleIMG.onload = function() {imgLoad();}
ywTitleIMG.onload = function() {imgLoad();}
goTitleIMG.onload = function() {imgLoad();}
waterIMG.onload = function() {imgLoad();}

//set image source
sFace.src = "images/sonicFace.png";
myLogo.src = "../logo/favicon.png";
BBG.src = "images/background1.png";
FBG.src = "images/fbg.png";
lockIMG.src = "images/lock.png";
backgroundImg.src = "images/backbackgrdn.png";
htpInfoIMG.src = "images/htpInfo.png";
htpTextIMG.src = "images/htpText.png";
titleIMG.src = "images/Logo.png";
spritesheet.src = "images/spritesheet.png";
gSpritesheet.src = "images/gSpritesheet.png";
platformsIMG.src = "images/platforms.png";
lsTitleIMG.src = "images/LevelSelectTitle.png";
ywTitleIMG.src = "images/YouWinTitle.png";
goTitleIMG.src = "images/gameOverTitle.png";
waterIMG.src = "images/waterSpriteSheet.png";

var imgCount = 0, imgMax = 16;
function imgLoad() {
    imgCount++;
    if (imgCount == imgMax) {
        console.log("Loading Successfull")
        state = "menu" ///MENU ON RELEASE
//        player.width = 600;
//        player.height = 700;
//        player.fCount = 25
//        player.x = (c.width / 2) - (player.width / 2) + 300;
//        player.y = (c.height / 2) - (player.height / 2) + 300;
    }
}

window.setTimeout( function() {
    
    if (imgCount !== imgMax) {
        window.alert("Timeout: Client took too long to load assets.");
        location.reload();
    }
}, 10000)

window.onresize = resizeWindow; 

function resizeWindow() {
    var off = 0;
    c.style.left = 0;
    off = (window.innerWidth - c.clientWidth) / 2;
    c.style.left = off + "px";
}

resizeWindow();
update();