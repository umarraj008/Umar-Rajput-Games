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
var selectCol = true;
var aiON = false;

var goUp;
var goDown;
var goLeft;
var goRight;
var dead = false;

var inputKey;

var BackColor = "black"
var NumBackColor = "#242424"

var colors = [
    {back: "#ff4516", num: "#ffb916"},
    {back: "#923fff", num: "#ff3fac"},
    {back: "#36c6ff", num: "#80ff36"},
    {back: "#fff153", num: "#70ff53"},
    {back: "#93ffc4", num: "#aa93ff"},
    {back: "#c3ff62", num: "#f062fd"},
    {back: "#c47cff", num: "#7cf0ff"},
    {back: "#fd75ff", num: "#ff7577"},
    {back: "#4afcff", num: "#a1ff4a"},
    {back: "#ff53cb", num: "#ff6d53"},
    {back: "#1aff5b", num: "#e0ff1a"},
    {back: "#7462ff", num: "#ff62ed"},
    {back: "#ff9e61", num: "#ffed61"},
    {back: "#a3f7ff", num: "#d4a3ff"},
    {back: "#ffcb3b", num: "#a7ff3b"},
];

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
               

    } else if (snakeLength > 9){
        ctx.font = "35px Roboto";
        ctx.fillText(snakeLength, 19.5, 33);
        

    } else {
        ctx.font = "50px Roboto";
        ctx.fillText(snakeLength, 19, 37);
            
    }
    ctx.textAlign = "left";

    
    //snake
    //outer snake square
    ctx.fillStyle = "black";    
    ctx.fillRect(player.x, player.y, 1, 1);
    
    //inner snake square
    ctx.fillStyle = "lime";    
    ctx.fillRect(player.x + 0.1, player.y + 0.1, 1 - 0.2, 1 - 0.2);
    
    //ai direction
    if (aiON) {
        switch (true) {
            case goLeft:
                ctx.fillStyle = "red";    
                ctx.fillRect(player.x - 1, player.y, 1, 1);
                ctx.fillStyle = BackColor;    
                ctx.fillRect(player.x + 0.1 - 1, player.y + 0.1, 1 - 0.2, 1 - 0.2);
                break;
                
            case goRight:
                ctx.fillStyle = "red";    
                ctx.fillRect(player.x + 1,  player.y, 1, 1);
                ctx.fillStyle = BackColor;    
                ctx.fillRect(player.x + 0.1 + 1, player.y + 0.1, 1 - 0.2, 1 - 0.2);
                break;
                
            case goUp:
                ctx.fillStyle = "red";    
                ctx.fillRect(player.x, player.y - 1, 1, 1);
                ctx.fillStyle = BackColor;    
                ctx.fillRect(player.x + 0.1, player.y + 0.1 - 1, 1 - 0.2, 1 - 0.2);
                break;
                
            case goDown:
                ctx.fillStyle = "red";    
                ctx.fillRect(player.x, player.y + 1, 1, 1);
                ctx.fillStyle = BackColor;    
                ctx.fillRect(player.x + 0.1, player.y + 0.1 + 1, 1 - 0.2, 1 - 0.2);
                break;
        }
        
    }
    
    
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
        
        if (aiON){
            ai()
            
        }
        
        moveCounter = 0;
    }
    
    
    draw();
    requestAnimationFrame(update);
}

function pickRandomColorBack() {
    if (selectCol) {
        let val = getRandomInt(0, 14);

        while (colors[val].back == BackColor) {
            let val = getRandomInt(0, 14);
        }

        
        BackColor = colors[val].back;
        NumBackColor = colors[val].num;
        selectCol = false;
    }
}

let amount = 1;

function aiMoveLeft() {
    for (i = 0; i < snakeLength; i++) {
        if ((player.x - 1 == snake[i].x && player.y == snake[i].y) || goRight || player.x - 1 == -1 || lastMove[lastMove.length] == "r") {
            return false;
        }else if (i == snakeLength - amount) {
            return true;
        }
    }  
}

function aiMoveRight() {
    for (i = 0; i < snakeLength; i++) {
        if ((player.x + 1 == snake[i].x && player.y == snake[i].y) || goLeft || player.x + 1 == 40 || lastMove[lastMove.length] == "l") {
            return false;

        }else if (i == snakeLength - amount) {
            return true;
        }
    }
}

function aiMoveUp() {
    for (i = 0; i < snakeLength; i++) {
        if ((player.y - 1 == snake[i].y && player.x == snake[i].x) || goDown || player.y - 1 == -1 || lastMove[lastMove.length] == "d") {
            return false;
        }else if (i == snakeLength - amount) {
            return true;
        }
    }
}

function aiMoveDown() {
    for (i = 0; i < snakeLength; i++) {
        if ((player.y + 1 == snake[i].y && player.x == snake[i].x) || goUp || player.y + 1 == 40 || lastMove[lastMove.length] == "u") {
            return false;

        }else if (i == snakeLength - amount) {
            return true;
        }
    }
}

var lastMove = [];

function MOVE(dir) {
    
    if (dir == "l") {
        goLeft = true;
        lastMove.push("l")
        console.log("LEFT")
    }else { goLeft = false; }
  
    
    if (dir == "r") {
        goRight = true;
        lastMove.push("r")
        console.log("RIGHT")

    }else { goRight = false; }
  
    
    if (dir == "u") {
        goUp = true;
        lastMove.push("u")
        console.log("UP")

    }else { goUp = false; }
  
    
    if (dir == "d") {
        goDown = true;
        lastMove.push("d")
        console.log("DOWN")

    }else { goDown = false; }
  
}


function ai() {
    try {
        gameStart = false;
        //not at x
        if (player.x != fruit.x) {

            if (player.x > fruit.x) {
                //left

                if (aiMoveLeft()) {
                    MOVE("l");

                }else {
                    if (aiMoveUp()) {
                        MOVE("u")

                    }else {
                        MOVE("d") 
                    }
                }                    


            }else if (player.x < fruit.x) {
                //right

                if (aiMoveRight()) {
                     MOVE("r");


                }else {
                    if (aiMoveDown()) {
                        MOVE("d")



                    }else {
                        MOVE("u")


                    }
                }
            }



        } else if (player.y != fruit.y){

            if (player.y > fruit.y) {

                //up

                if (aiMoveUp()) {
                     MOVE("u");




                }else {
                    if (aiMoveRight()) {
                        MOVE("r")



                    }else {
                        MOVE("l")

                    }
                }



            }else if (player.y < fruit.y) {
                //down

                if (aiMoveDown()) {
                     MOVE("d");




                }else {
                    if (aiMoveLeft()) {
                        MOVE("l")



                    }else {
                        MOVE("r")

                    }
                }
            }
        }
    }
    
    catch(error) {
        console.error("ai crashed: " + error);
        alert("ai crashed: " + error);
        location.reload();
    }
}
    

function backgroundStuffs() {
    switch (snakeLength) {
        case 9:
            selectCol = true;
            break;
            
        case 10:
            pickRandomColorBack();    
            break;
        case 19:
            selectCol = true;
            break;
            
        case 20:
            pickRandomColorBack();
            break;
        case 29:
            selectCol = true;
            break;
            
        case 30:
            pickRandomColorBack();
            break;
        case 39:
            selectCol = true;
            break;
            
        case 40:
            pickRandomColorBack();
            break;
        case 49:
            selectCol = true;
            break;
            
        case 50:
            pickRandomColorBack();
            break;
        case 59:
            selectCol = true;
            break;
            
        case 60:
            pickRandomColorBack();
            break;
        case 69:
            selectCol = true;
            break;
            
        case 70:
            pickRandomColorBack();
            break;
        case 79:
            selectCol = true;
            break;
            
        case 80:
            pickRandomColorBack();
            break;
        case 89:
            selectCol = true;
            break;
            
        case 90:
            pickRandomColorBack();
            break;
        case 99:
            selectCol = true;
            break;
            
        case 100:
            pickRandomColorBack();
            break;
        case 109:
            selectCol = true;
            break;
            
        case 110:
            pickRandomColorBack();
            break
            case 119:
            selectCol = true;
            break;
            
        case 120:
            pickRandomColorBack();
            break;
        case 129:
            selectCol = true;
            break;
            
        case 130:
            pickRandomColorBack();
            break;
        case 139:
            selectCol = true;
            break;
            
        case 140:
            pickRandomColorBack();
            break;
        case 149:
            selectCol = true;
            break;
            
        case 150:
            pickRandomColorBack();
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

let key1 = false;

//INPUT
document.addEventListener("keydown", event => {
    inputKey = event.keyCode;
    
    if (event.keyCode == 37 || event.keyCode == 65 || event.keyCode == 39 || event.keyCode == 68 || event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 40 || event.keyCode == 83) {
        gameStart = false;
    }
    
    
    if (dead) {
        location.reload();
    }
    
        
    if (event.keyCode == 16) {
        key1 = true;
    }
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 16) {
        key1 = false;
    }
    
});

document.addEventListener("keypress", event => {
    if (key1 && event.keyCode == 76) {
        aiON = true;
        console.log("ai started");
    } 
    
    
});


document.addEventListener("click", event => {
   if (dead) {
        location.reload();
    }
});

RandomFruitPlacement()
update();