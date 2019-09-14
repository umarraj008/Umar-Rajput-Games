const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(20,20);
let lastTime = 0;

var deltaTime;
var gameStart = true;

var player = {
    x: (c.width / 2) / 20,
    y: 4 + (c.height / 2) / 20,
};

var fruit = {
    x: 0,
    y: 0,
};

var snake = [];
var snakeLength = 1;

var direction;
var moveCounter = 0;
var moveInterval = 100;

var goUp;
var goDown;
var goLeft;
var goRight;
var dead = false;

var inputKey;

var BackColor = "black"
var NumBackColor = "#242424"

function draw() {
    //background
    ctx.fillStyle = BackColor;
    ctx.fillRect(0,0,c.width, c.height);
    
    //snake counter
    ctx.fillStyle = NumBackColor;
    
    ctx.textAlign = "center";
    if (snakeLength > 99) {
        ctx.font = "22px Roboto";
        ctx.fillText(snakeLength, 19, 28);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.15;
        ctx.strokeText(snakeLength, 19, 28);
        

    } else if (snakeLength > 9){
        ctx.font = "35px Roboto";
        ctx.fillText(snakeLength, 19.5, 33);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.15;
        ctx.strokeText(snakeLength, 19.5, 33);

    } else {
        ctx.font = "50px Roboto";
        ctx.fillText(snakeLength, 19, 37);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.15;
        ctx.strokeText(snakeLength, 19, 37);

    }
    ctx.textAlign = "left";

    
    //snake
    //outer snake square
    ctx.fillStyle = "black";    
    ctx.fillRect(player.x, player.y, 1, 1);
    
    //inner snake square
    ctx.fillStyle = "lime";    
    ctx.fillRect(player.x + 0.1, player.y + 0.1, 1 - 0.2, 1 - 0.2);
    
    for (i = 0; i < snake.length; i++) {
    
        //outer snake square
        ctx.fillStyle = "black";
        ctx.fillRect(snake[i].x, snake[i].y, 1, 1);
        
        //inner snake square
        if (!dead) {
            ctx.fillStyle = "lime";
        }else {
            ctx.fillStyle = "red";
        }   
        
        ctx.fillRect(snake[i].x + 0.1, snake[i].y + 0.1, 1 - 0.2, 1 - 0.2);
        
    }
    
    //fruit
    //outer
    ctx.fillStyle = "black";    
    ctx.fillRect(fruit.x, fruit.y, 1, 1 );
    //innner square
    ctx.fillStyle = "magenta";    
    ctx.fillRect(fruit.x + 0.1, fruit.y + 0.1, 1 - 0.2, 1 - 0.2);
    
    
    
    //title warning
    if (gameStart) {
        
        ctx.fillStyle = "white";
        ctx.font = "2px Roboto"
        ctx.fillText("Move To Start", ((c.width / 2) / 20) - 6, (c.height / 2) / 20);
    }
    
    //Game Over
    if (dead) {
        
        ctx.fillStyle = "Red";
        ctx.font = "6px Roboto"
        ctx.fillText("Game Over", ((c.width / 2) / 20) -14, (c.height / 2) / 20);
    }
}

function moveSnake() {
   
    for (i = 0; i < snakeLength - 1; i++) {
        snake[i] = snake[i + 1];
    }
    
    
    if (goUp) {
        player.y -= 1; 
        
    }
    
    if (goRight) {
        player.x += 1; 
        
    }
    
    if (goDown) {
        player.y += 1; 
        
    }
    
    if (goLeft) {
        player.x -= 1; 
        
    }
    
}


function CheckForDeaths() {
    //die if touch self
    if (!gameStart) {
        for (i = 0; i < snake.length; i++) {
            if (player.x == snake[i].x && player.y == snake[i].y) {
                moveInterval = 10000000000;
                dead = true;
            }
        }
    }
    
    //die if touch wall
    if (player.x <= -1 || player.x >= 40 || player.y <= -1 || player.y >= 40) {
        moveInterval = 10000000000;
        dead = true;
    }
}

function update(time = 0) {
    deltaTime = time - lastTime;
    lastTime = time;
    
    moveCounter += deltaTime;
    if (moveCounter > moveInterval) {
        backgroundStuffs();
        Input();
        moveSnake();
        CheckForDeaths();
        eatingFruit();
        
        
        moveCounter = 0;
    }
    
    draw();
    document.getElementById("body").style.background = NumBackColor
    requestAnimationFrame(update);
}


function backgroundStuffs() {
    switch (snakeLength) {
        case 10:
            BackColor = "#ff4516"
            NumBackColor = "#ffb916"
            break;
        case 20:
            BackColor = "#923fff"
            NumBackColor = "#ff3fac"
            break;
        case 30:
            BackColor = "#36c6ff"
            NumBackColor = "#80ff36"
            break;
            
        case 40:
            BackColor = "#fff153"
            NumBackColor = "#70ff53"
            break;
            
        case 50:
            BackColor = "#93ffc4"
            NumBackColor = "#aa93ff"
            break;
            
        case 60:
            BackColor = "#c3ff62"
            NumBackColor = "#f062fd"
            break;
            
        case 70:
            BackColor = "#c47cff"
            NumBackColor = "#7cf0ff"
            break;
            
        case 80:
            BackColor = "#fd75ff"
            NumBackColor = "#ff7577"
            break;
            
        case 90:
            BackColor = "#4afcff"
            NumBackColor = "#a1ff4a"
            break;
            
        case 100:
            BackColor = "#ff53cb"
            NumBackColor = "#ff6d53"
            break;
            
        case 110:
            BackColor = "#1aff5b"
            NumBackColor = "#e0ff1a"
            break
            
        case 120:
            BackColor = "#7462ff"
            NumBackColor = "#ff62ed"
            break;
            
        case 130:
            BackColor = "#ff9e61"
            NumBackColor = "#ffed61"
            break;
            
        case 140:
            BackColor = "#a3f7ff"
            NumBackColor = "#d4a3ff"
            break;
            
        case 150:
            BackColor = "#ffcb3b"
            NumBackColor = "#a7ff3b"
            break;
    }
}


function eatingFruit() {
    if (snakeLength == snake.length) {
        if (player.x == fruit.x && player.y == fruit.y) {
            RandomFruitPlacement();
            snakeLength++;
            moveInterval--;
        }
    }
    
    snake[snakeLength - 1] = {x: player.x, y: player.y};
}

function RandomFruitPlacement() {
    fruit.x = getRandomInt(0, 39);
    fruit.y = getRandomInt(0, 39);
    
    for(i = 0; i < snake.length; i++) {
        if (fruit.x == snake[i].x && fruit.y == snake[i].y) {
            RandomFruitPlacement();
        }
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Input() {
    //left
    if (inputKey == 37 || inputKey == 65) {
        if (!goRight) {
            goLeft = true;
            goRight = false;
            goUp = false;
            goDown = false;
        }
   }
    
    //right
    if (inputKey == 39 || inputKey == 68) {
        if (!goLeft) {
            goRight = true;
            goLeft = false;
            goUp = false;
            goDown = false;
        }
   }
    
    //up
    if (inputKey == 38 || inputKey == 87) {
      if (!goDown) {
            goUp = true;
            goRight = false;
            goDown = false;
            goLeft = false;
        }
   }
    
    //down
    if (inputKey == 40 || inputKey == 83) {
       if (!goUp) {
            goDown = true;
            goRight = false;
            goUp = false;
            goLeft = false;
        }
   }
}


//INPUT
document.addEventListener("keydown", event => {
    inputKey = event.keyCode;
    
    if (event.keyCode == 37 || event.keyCode == 65 || event.keyCode == 39 || event.keyCode == 68 || event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 40 || event.keyCode == 83) {
        gameStart = false;
    }
    
    
    if (dead) {
        location.reload();
    }

    
});

document.addEventListener("click", event => {
   if (dead) {
        location.reload();
    }
});

RandomFruitPlacement()
update();