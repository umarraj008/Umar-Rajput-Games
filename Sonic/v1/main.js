// JavaScript Document

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;
var dt;

var sonicImg = document.getElementById("sonic")
var groundImg = document.getElementById("ground")
var backgroundImg = document.getElementById("background")

var state = "menu";
var menuBackScrollX1 = 0;
var menuBackScrollX2 = c.width;
var menuBackScrollX3 = 0;
var menuBackScrollX4 = c.width;
var groundPoints = [
    {x: 0, y: 710},
    {x: 96, y: 720},
    {x: 192, y: 735},
    {x: 288, y: 725},
    {x: 384, y: 720},
    {x: 480, y: 715},
    {x: 576, y: 715},
    {x: 672, y: 720},
    {x: 768, y: 715},
    {x: 864, y: 715},
    {x: 960, y: 715},
    {x: 1056, y: 725},
    {x: 1152, y: 735},
    {x: 1248, y: 735},
    {x: 1344, y: 720},
    {x: 1440, y: 715},
    {x: 1536, y: 720},
    {x: 1632, y: 715},
    {x: 1728, y: 715},
    {x: 1824, y: 715},
    {x: 1920, y: 720},
];

//var tempX = -c.width / 20;
//for (i = 0; i < groundPoints.length; i++) {
//    tempX+=c.width / 20;
//    groundPoints[i].x += tempX;
//}

var player = new function() {
	this.x = 220;
	this.y = 220;
    this.collisionBound = 40;
    this.yVel = 0;
    
	this.draw = function() {
        
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.drawImage(sonicImg, -75, -100, 150,200);
        
        
        ctx.beginPath()
        ctx.ellipse(0, 50, this.collisionBound, this.collisionBound, Math.PI / 4, 0, 2 * Math.PI)
        ctx.strokeStyle = "red"
        ctx.lineWidth = "4";
        ctx.stroke()
        
        ctx.restore();
        
    
        this.y -= this.yVel;
    }
}
    

function Menu() {
    
    //base
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, c.width, c.height);

	//background
	ctx.drawImage(backgroundImg, menuBackScrollX1, 0, c.width, c.height)
    //ctx.fillStyle = "rgba(255,50,50,0.5)";
    //ctx.fillRect(menuBackScrollX1, 0, c.width, c.height);
	ctx.drawImage(backgroundImg, menuBackScrollX2, 0, c.width, c.height)
    //ctx.fillStyle = "rgba(50,50,255,0.5)";
    //ctx.fillRect(menuBackScrollX2, 0, c.width, c.height);
	
    //ground
    ctx.drawImage(groundImg, menuBackScrollX3, c.height - 400, c.width, 400)
    ctx.drawImage(groundImg, menuBackScrollX4, c.height - 400, c.width, 400)
	
	//sonic
	player.draw();
    
    menuBackScrollX1 -= 0.1 * dt;
    menuBackScrollX2 -= 0.1 * dt;
    menuBackScrollX3 -= 0.2 * dt;
    menuBackScrollX4 -= 0.2 * dt;
    
    
    if (menuBackScrollX1 <= -c.width) {
        menuBackScrollX1 = c.width;
    }
    
    if (menuBackScrollX2 <= -c.width) {
        menuBackScrollX2 = c.width;
    } else if (menuBackScrollX2 >= menuBackScrollX1 + c.width) {
        menuBackScrollX2 += (menuBackScrollX1 + c.width) - menuBackScrollX2;
    }
    
    if (menuBackScrollX3 <= -c.width) {
        menuBackScrollX3 = c.width;
    }
    
    if (menuBackScrollX4 <= -c.width) {
        menuBackScrollX4 = c.width;
    }
    
    
    for (i = 0 ; i < groundPoints.length; i++) {
        ctx.fillStyle = "red";
        ctx.fillRect(groundPoints[i].x - 5,groundPoints[i].y - 5, 10,10)
    }
}

function LevelSelect() {
    
    //base
    ctx.fillStyle = "white";      
    ctx.fillRect(0, 0, c.width, c.height);

	
}

function Level1() {
    
    //base
    ctx.fillStyle = "red";      
    ctx.fillRect(0, 0, c.width, c.height);

	
}

function Level2() {
    
    //base
    ctx.fillStyle = "green";      
    ctx.fillRect(0, 0, c.width, c.height);

	
}


function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    
    switch(state) {
        case "menu":
            Menu();
            break;
        
        case "lselect":
            LevelSelect();
            break;
        
        case "l1":
            Level1();
            break;
        
        case "l2":
            Level2();
            break;
            
    }
    
    requestAnimationFrame(update);
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
    
    
}

function MouseDown(event) {
    
}

function MouseUp(event) {
    
}

//INPUT
document.addEventListener("keydown", event => {
   if (state == "menu") {
        if (event.keyCode == 37 || event.keyCode == 65) {
            //LEFT
            player.x-= 10;
        }else if (event.keyCode == 39 || event.keyCode == 68) {
            //RIGHT
            player.x+= 10;
        } else if (event.keyCode == 38 || event.keyCode == 87) {
            //UP
            //player.dir.up = true;
        }else if (event.keyCode == 40 || event.keyCode == 83) {
            //DOWN
            //player.dir.down = true;
        }else if (event.keyCode == 32 && player.canShoot) {
            //SPACE
            //player.shoot = true;
            //player.image = playerShootIMG;
        }
   }
    
    //pollygon tuner
//    if (event.keyCode == 37 || event.keyCode == 65) {
//		//LEFT
//		selectedI--
//	}else if (event.keyCode == 39 || event.keyCode == 68) {
//		//RIGHT
//		selectedI++
//	} else if (event.keyCode == 38 || event.keyCode == 87) {
//		//UP
//		menuGroundCollision[selectedI].y--
//	}else if (event.keyCode == 40 || event.keyCode == 83) {
//		//DOWN
//		menuGroundCollision[selectedI].y++
//	}else if (event.keyCode == 32 && player.canShoot) {
//		//SPACE
//		//player.shoot = true;
//		//player.image = playerShootIMG;
//	}

});

document.addEventListener("keyup", event => {
    
		if (event.keyCode == 37 || event.keyCode == 65) {
			//LEFT
			//player.dir.left = false;
		}else if (event.keyCode == 39 || event.keyCode == 68) {
			//RIGHT
			//player.dir.right = false;
		} else if (event.keyCode == 38 || event.keyCode == 87) {
			//UP
			//player.dir.up = false;
		}else if (event.keyCode == 40 || event.keyCode == 83) {
			//DOWN
			//player.dir.down = false;
		}else if (event.keyCode == 32) {
			//SPACE
			//player.shoot = false;
			//player.canShoot = true;
		}
});

document.addEventListener("click", event => {
   
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

update();