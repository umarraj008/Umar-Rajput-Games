// JavaScript Document

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
ctx.imageSmoothingEnabled = false;
let lastTime = 0;
var dt;

var lockIMG = document.getElementById("lock");
var backgroundImg = document.getElementById("background");
var htpInfoIMG = document.getElementById("htp");
var htpTextIMG = document.getElementById("htpText");
var titleIMG = document.getElementById("title");
var spritesheet = document.getElementById("ss");
var gSpritesheet = document.getElementById("gss");
var backgroundIMG1 = document.getElementById("b1");
var platformsIMG = document.getElementById("platforms");
var lsTitleIMG = document.getElementById("lsTitle");
var ywTitleIMG = document.getElementById("ywTitle");
var goTitleIMG = document.getElementById("goTitle");
var waterIMG = document.getElementById("water");

var l2Unlock = false; // FALSE ON RELEASE
var l3Unlock = false; // FALSE ON RELEASE
var state = "loading"; // "menu ON RELEASE
var menuBackScrollX1 = 0;
var menuBackScrollX2 = 0;
var scroll = {x: 0, y: 0};

var loadingCircleR = 0;

var transisionOut = {
    enabled: false,
    x: 0,
    speed: 80,
    state: null,
    color: "#f6ff4f",
}

var transisionIn = {
    enabled: false,
    x: 0,
    speed: 80,
    color: "#f6ff4f",
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
    this.grounded = false;
    this.left = false;
    this.right = false;
    this.speed = 7;
    this.gravity = 2;
    this.width = 150;
    this.height = 200;
    //this.width = 600;
    //this.height = 700;
    
    //animation
    this.state = "walk";
    this.fCount = 0;
	this.images = [
        //idle
        {x: 180, y: 1036, w: 30, h: 40}, 
        {x: 213, y: 1036, w: 30, h: 40}, 
        {x: 244, y: 1036, w: 30, h: 40}, 
        {x: 213, y: 1036, w: 30, h: 40},

        //walk right
        {x: 319, y: 330, w: 30, h: 40}, 
        {x: 351, y: 330, w: 30, h: 40}, 
        {x: 385, y: 330, w: 30, h: 40}, 
        {x: 422, y: 330, w: 30, h: 40}, 
        {x: 458, y: 330, w: 30, h: 40}, 
        {x: 491, y: 330, w: 30, h: 40}, 
        {x: 526, y: 330, w: 30, h: 40}, 
        {x: 562, y: 330, w: 30, h: 40}, 
        
        //walk left
        {x: 563, y: 379, w: 30, h: 40}, 
        {x: 531, y: 379, w: 30, h: 40}, 
        {x: 497, y: 379, w: 30, h: 40}, 
        {x: 460, y: 379, w: 30, h: 40}, 
        {x: 424, y: 379, w: 30, h: 40}, 
        {x: 391, y: 379, w: 30, h: 40}, 
        {x: 356, y: 379, w: 30, h: 40}, 
        {x: 320, y: 379, w: 30, h: 40}, 
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
        ctx.strokeStyle = "red"
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
            
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

                    if (this.fCount > 18) { //19 12
                        this.fCount = 12;
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
        //player move
        if (this.left) {
            this.state = "walkL";
            this.x-= this.speed;
        } else if (this.right) {
            this.state = "walkR";
            this.x+= this.speed;
        } else if (!this.right && !this.left) {
            this.state = "idle"
        }
    
        //platform collision
        if (this.platformTOPcol(platforms1[0].x, platforms1[0].y, platforms1[0].width, platforms1[0].height)) {
            this.grounded = true;
        } else {this.grounded = false;}
        
        //gravity
        if (!this.grounded && !this.jumping) {
            this.yVel += this.gravity;
        } else {
            this.yVel = 0;
        }
        
        this.y += this.yVel; 
    }
    
    
    this.jump = function() {
        this.jumping = true;
        player.yVel += 1;
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
                      214);
        
        
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
    constructor(x_pos, y_pos, wid, hei, col) {
        this.x = x_pos;
        this.y = y_pos;
        this.width = wid;
        this.height = hei;
        this.color = col;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var platforms1 = [
    new platform(0,800,c.width - 400,500,"blue"),
];

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
	ctx.drawImage(titleIMG, 700,70,1000,500)
	
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

    //paralax background 2
    ctx.drawImage(backgroundIMG1, 0,0, 4488, c.height);
    
    //paralax water
    water.draw(0, 641);
    water.draw(510, 641);
    water.draw(1020, 641);
    water.draw(1530, 641);
    water.draw(2040, 641);
        
    //player
    player.draw();
    
    
    //platforms
    for (i = 0; i < platforms1.length; i++) {
        platforms1[i].draw();
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

function Level3() {
    
    //base
    ctx.fillStyle = "blue";      
    ctx.fillRect(0, 0, c.width, c.height);

	transisIn();
    transisOut();
}

function transisOut() {
    if (transisionOut.enabled) {
        ctx.fillStyle = transisionOut.color;
        ctx.fillRect(0, 0, transisionOut.x, c.height)
        
        transisionOut.x += transisionOut.speed;
        
        if (transisionOut.x > c.width) {
            transisionOut.enabled = false;
            state = transisionOut.state;
            transisionOut.state = null;
            transisionOut.x = 0;
            transisionIn.enabled = true;
        }
    }
}

function transisIn() {
    if (transisionIn.enabled) {
        ctx.fillStyle = transisionIn.color;
        ctx.fillRect(transisionIn.x, 0, c.width, c.height)
        
        transisionIn.x += transisionIn.speed;
        
        if (transisionIn.x > c.width) {
            transisionIn.enabled = false;
            transisionIn.x = 0;
        }
    }
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
            player.move();
            break;
        
        case "l2":
            Level2();
            break;
            
        case "l3":
            Level3();
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
                        player.state = "idle";
                        transisionOut.state = "l1";
                        transisionOut.enabled = true;
                        break
                    
                    case 950:
                        player.state = "idle";
                        transisionOut.state = "l2";
                        transisionOut.enabled = true;
                        break

                    case 1460:
                        player.state = "idle";
                        transisionOut.state = "l3";
                        transisionOut.enabled = true;
                        break
                }
                
            }

            break;
            
        case "l1":
            
            if ((event.keyCode == 37 || event.keyCode == 65) && !player.right) {
                //LEFT
                if (!player.left) {
                    player.fCount = 12;
                }
                player.left = true;

            }else if ((event.keyCode == 39 || event.keyCode == 68) && !player.left) {
                //RIGHT
                
                if (!player.right) {
                    player.fCount = 4;
                }
                player.right = true;
            
                
            } else if (event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 38) {
                //SPACE Or Enter
                if (!player.jump && player.grounded) {
                    player.jump();
                }
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
lockIMG.onload = function() {imgLoad();}
backgroundImg.onload = function() {imgLoad();}
htpInfoIMG.onload = function() {imgLoad();}
htpTextIMG.onload = function() {imgLoad();}
titleIMG.onload = function() {imgLoad();}
spritesheet.onload = function() {imgLoad();}
gSpritesheet.onload = function() {imgLoad();}
backgroundIMG1.onload = function() {imgLoad();}
platformsIMG.onload = function() {imgLoad();}
lsTitleIMG.onload = function() {imgLoad();}
ywTitleIMG.onload = function() {imgLoad();}
goTitleIMG.onload = function() {imgLoad();}
waterIMG.onload = function() {imgLoad();}

//set image source
lockIMG.src = "images/Lock.png";
backgroundImg.src = "images/backbackgrdn.png";
htpInfoIMG.src = "images/htpInfo.png";
htpTextIMG.src = "images/htpText.png";
titleIMG.src = "images/Logo.png";
spritesheet.src = "images/spritesheet.png";
gSpritesheet.src = "images/gSpritesheet.png";
backgroundIMG1.src = "images/background2.png";
platformsIMG.src = "images/platforms.png";
lsTitleIMG.src = "images/LevelSelectTitle.png";
ywTitleIMG.src = "images/YouWinTitle.png";
goTitleIMG.src = "images/gameOverTitle.png";
waterIMG.src = "images/waterSpriteSheet.png";

var imgCount = 0, imgMax = 13;
function imgLoad() {
    imgCount++;
    if (imgCount == imgMax) {
        state = "menu"
    }
}

window.setTimeout( function() {
    if (imgCount !== imgMax) {
        window.alert("Timeout: Client took too long to load.");
        location.reload();
    }
}, 10000)

update();
