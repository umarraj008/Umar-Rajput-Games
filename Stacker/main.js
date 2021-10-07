const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;

var dt;
var moveSpeed = 0.15; //was 0.1
var score = 0;
var GlobalSize = 600;
var gameOver = false;

var ai = false;
var ai2 = false;
var ai3 = false;
var ai4 = false;
var ai5 = false;
var ai6 = false;
var ai7 = false;
var help = false;

class block {

    constructor(start) {
        this.x = start;
        this.y = c.height / 2 + 70;
        this.size = GlobalSize;
        this.color = getRandomColor();
    }
}

var player = new block(2); 

var blocks = [];

function draw() {
    
    if (gameOver) {
        
        moveSpeed = 0;
        ctx.fillStyle = "red";
        ctx.fillRect(blocks[0].x,blocks[0].y,blocks[0].size, 50);
        
        ctx.textAlign = "center";
        ctx.font = "40px Roboto"
        
        ctx.fillText("Click To Play Again", c.width / 2, c.height / 2);
        
        ctx.fillStyle = "white";
        ctx.font = "26px Roboto"
        ctx.fillText("Your Tower :", 110, 30);
        
        var off = 50;
        for (i = 1; i < blocks.length; i++) {
            ctx.fillStyle = blocks[i].color;
            ctx.fillRect(blocks[i].x * 0.1,5 + off,blocks[i].size * 0.1, 5);
            off += 6;
        }
        
        ctx.strokeStyle = "white";
        ctx.strokeRect(0,0, 200, off + 10);
    }else {
        
        //background
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,c.width, c.height);
        
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x,player.y,player.size, 50);
        
        var off = 50;
        for (i = 0; i < blocks.length; i++) {
            ctx.fillStyle = blocks[i].color;
            ctx.fillRect(blocks[i].x,blocks[i].y + off,blocks[i].size, 50);
            off += 50;
        }
        ctx.textAlign = "center";
        ctx.font = "200px Roboto"
        ctx.fillStyle = "white"
        ctx.fillText(score, c.width / 2, 200);
    }
}


function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    AI()
	MovePlayer();
    draw();
    requestAnimationFrame(update);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addBlockToStack() {
    removeOverhang();
    blocks.unshift(player);
    player = new block(2);
}


function removeOverhang() {
    var lastBlock = blocks[0];
    
    if (((player.x + player.size) < lastBlock.x) || (player.x > (lastBlock.x + lastBlock.size))) {
        gameOver = true;
    }else{
    
        score++;
        if (player.x < lastBlock.x) {
            player.size -= lastBlock.x - player.x;
            player.x = lastBlock.x;
        }

        if ((player.x + player.size) > (lastBlock.x + lastBlock.size)) {
            player.size += (lastBlock.x + lastBlock.size) - (player.x + player.size);
            player.x = lastBlock.x + (lastBlock.size - player.size)
        }


        //player.x = lastBlock.x;
        GlobalSize = player.size;
        moveSpeed += 0.02;
    }
}

function MovePlayer() {
    player.x += moveSpeed * dt;
    
    if ((player.x + player.size >= c.width) || (player.x <= 0)) {
        moveSpeed = -moveSpeed;
    }
}

function AI() {
    //AI 1
    if (ai) {
        if (player.x >= blocks[0].x) {
            addBlockToStack();
            console.log("AI ALGORITHM 1: ", !Boolean(player.x >= blocks[0].x)); 

        }
    }
    
    //AI 2
    if (ai2) {
        if ((player.x + player.size) >= (blocks[0].x + blocks[0].size)) {
        addBlockToStack();
        console.log("AI ALGORITHM 2: ", !(player.x + player.size) >= (blocks[0].x + blocks[0].size)); 

        }
    }
    
    //AI 3
    if (ai3 && help) {
        var calc = (blocks[1].x - blocks[0].x);
        var text = "C1"
        var l = blocks.length - 1;
        
        if (player.x >= (blocks[0].x + calc)) {
            addBlockToStack();
            console.log("AI ALGORITHM 3: ", text, blocks[1].x - blocks[0].x); 
        }
    }
    
    if (ai3 && (help !== true)) {
        if (player.x >= blocks[0].x) {
            addBlockToStack();
            help = true;
            console.log("helped", help);
        }
    }
    
    //AI 4
    if (ai4 && help) {
        var text = "C1"
        var l = blocks.length - 1;
        var calc = blocks[l].x - blocks[0].x;
        
        if (player.x >= (blocks[0].x + calc)) {
            addBlockToStack();
            console.log("AI ALGORITHM 4: ", text, blocks[1].x - blocks[0].x); 
        }
    }
    
    if (ai4 && (help !== true)) {
        if (player.x >= blocks[0].x) {
            addBlockToStack();
            help = true;
            console.log("helped", help);
        }
    }
    
    //AI 5
    if (ai5) {
        
        var sum = 0;
        for( var i = 0; i < blocks.length; i++ ){
            sum += (blocks[i].x);
        }

        var calc = (sum / blocks.length);
        
        if (player.x >= (blocks[0].x - calc)) {
            addBlockToStack();
            console.log("AI ALGORITHM 5: ", calc); 
        }
    }
    
    //AI 6
    if (ai6) {
        
        var sum = 0;
        for( var i = 0; i < blocks.length; i++ ){
            sum += (blocks[i].x);
        }

        var calc = (sum / blocks.length);
        
        if (player.x >= (calc)) {
            addBlockToStack();
            console.log("AI ALGORITHM 6: ", calc); 
        }
    }
    
    //AI 7
    if (ai7) {
        
        var sum = 0;
        var Av = 0;
        for( var i = 0; i < blocks.length; i++ ){
            sum += (blocks[i].x);
        }
        
        av = moveSpeed * dt;

        var calc = (sum / blocks.length) - av;
        
        if (player.x >= (calc)) {
            addBlockToStack();
            console.log("AI ALGORITHM 7: ",av ,calc); 
        }
    }
}


//INPUT
document.addEventListener("keydown", event => {
    if (event.keyCode == 32) {
        if (gameOver == false) { 
            addBlockToStack();   
        }else {
           location.reload();
        }
    }   
});

document.addEventListener("click", event => {
   if (gameOver == false) {
        addBlockToStack();   
   }else {
       location.reload();
   }
});

blocks.unshift(new block(c.width / 2 - 300));
update();
