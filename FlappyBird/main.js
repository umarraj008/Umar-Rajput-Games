const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.scale(1,1);
let lastTime;
var gravity = 1.5;
var thrust = -30;
var maxVel = -30;
var PipeGap = 500;
var pipeMiddle = 400;
var pipeMargin = 150;
var moveSpeed = 5;
var lose = false;
var MX;
var MY;
var score = 0;
var collecting = true;
var berd = document.getElementById("berd");
var flash = false;
document.getElementById("button").style.visibility = "hidden";

var player = {
	x: 100,
	y: canvas.height / 2,
    v: 0,
    h: 20,
};

class pipe {
    constructor() {
        this.x = canvas.width + 30;
        this.y = 0;
        this.Th = getRandomInt(200, canvas.height - pipeMiddle - pipeMargin);
        this.Bh = canvas.height - this.Th - pipeMiddle;

    }
    
} 

var pipe1 = new pipe();
var pipe2 = new pipe();
var pipe3 = new pipe();
var pipe4 = new pipe();

pipe2.x = pipe1.x + PipeGap;
pipe3.x = pipe2.x + PipeGap;
pipe4.x = pipe3.x + PipeGap;

function draw() {

    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    ctx.fillStyle = "red"
//    ctx.beginPath();
//    ctx.arc(player.x, player.y, player.h, 0, 2 * Math.PI);
//    ctx.fill();
    ctx.drawImage(berd, player.x - 35, player.y - 35, 60, 60);
    
    ctx.fillStyle = "#red";
    ctx.fillRect(pipe1.x, pipe1.y, 30, pipe1.Th);
    ctx.fillRect(pipe2.x, pipe2.y, 30, pipe2.Th);
    ctx.fillRect(pipe3.x, pipe3.y, 30, pipe3.Th);
    ctx.fillRect(pipe4.x, pipe4.y, 30, pipe4.Th);
    
    ctx.fillRect(pipe1.x, pipe1.Th + pipeMiddle, 30, pipe1.Bh);
    ctx.fillRect(pipe2.x, pipe2.Th + pipeMiddle, 30, pipe2.Bh);
    ctx.fillRect(pipe3.x, pipe3.Th + pipeMiddle, 30, pipe3.Bh);
    ctx.fillRect(pipe4.x, pipe4.Th + pipeMiddle, 30, pipe4.Bh);
    
    ctx.fillStyle = "white";
    ctx.font = "200px Comic Sans MS"
    ctx.textAlign = "center"
    ctx.fillText(score, canvas.width / 2, 200);
    
    
    if (flash) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        setTimeout(function() {flash = false}, 20);;
    }
}

function update (time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    playerMove();
    movePipes(pipe1);
    movePipes(pipe2);
    movePipes(pipe3);
    movePipes(pipe4);
    detectCollision(pipe1);
    detectCollision(pipe2);
    detectCollision(pipe3);
    detectCollision(pipe4);
    draw();
    
    if (lose) {
        gameEnd();
        ctx.fillStyle = "white"
        ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 120, 300, 200);
        ctx.fillStyle = "black";
        ctx.font = "50px Comic Sans MS"
        ctx.textAlign = "center"
        ctx.fillText("Play Again", canvas.width / 2, canvas.height / 2);
        document.getElementById("button").style.visibility = "visible";
    }
   
    requestAnimationFrame(update);
}

function playerMove() {
    player.v += gravity;
    
    if (player.v < maxVel) {
        player.v += 30;
    }
    
    player.y += player.v;

    if (player.y >= canvas.height - player.h) {
	   player.v = 0;
	   player.y = canvas.height - player.h;    	 
    }
    
    if (player.y <= player.h) {
	   player.v = 0;
	   player.y = player.h;
    }
}


function movePipes(p) {
    p.x -= moveSpeed;
    
    if (p.x <= -20) {
        moveSpeed += 0.05;
        pipeMiddle -= 5;
        p.x = new pipe().x;
        p.th = getRandomInt(200, canvas.height - pipeMiddle - pipeMargin);
        collecting = true;
    }
}

document.addEventListener("mousedown", function(event) {
   if (lose == false) {
        player.v += thrust;
   }
    if (lose) {
        if (MX > ((canvas.width / 2) - 150) && MX < (((canvas.width / 2) - 150) + 300) && MY > (canvas.height / 2 - 170) && MY < (((canvas.height / 2) - 120) + 150)) {
            location.reload();
        }
    }
});

document.addEventListener("keypress", event => {
   if (event.keyCode == 32 && lose == false) {
	player.v += thrust;
    }
    
    if (lose && (event.keyCode == 13 || event.keyCode == 32)) {
        location.reload();
    }
});

document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
	var dot, eventDoc, doc, body, pageX, pageY;
	event = event || window.event; // IE-ism

	MX = event.pageX;
	MY = event.pageY;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gameEnd() {
    moveSpeed = 0;
    player.v = 0
}

function detectCollision(p) {
    
    //top pipe
    if (player.x > p.x &&
       player.x < p.x + 300 && 
        player.y < p.Th && 
        player.y > p.y) {
        lose = true;
    }
    
    //bottom pipe
    if (player.x > p.x &&
       player.x < p.x + 300 && 
        player.y > p.Th + pipeMiddle && 
        player.y < canvas.height) {
        lose = true;
    }
        
    if (collecting) {
        if (player.x > p.x &&
            player.x < p.x + 300 && 
            player.y > p.Th && 
            player.y < p.Th + pipeMiddle) {
            score++;
            collecting = false;
            flash = true;
        }
    }
    
}

update();