const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(40,40);
let lastTime = 0;

var dt;
var state = "menu";
// CHERRY #D66853

var titleIMG = document.getElementById("title");
var faceIMG = document.getElementById("face");
var faceIMG2 = document.getElementById("face2");
var faceIMG3 = document.getElementById("face3");
var faceIMG4 = document.getElementById("face4");
var cherry = document.getElementById("cherry");
var ms = [
    {x: 3, y: 13},
    {x: 4, y: 13},
    {x: 5, y: 13},
    {x: 6, y: 13},
    {x: 7, y: 13},
    {x: 8, y: 13},
    {x: 9, y: 13},
    {x: 10, y: 13},
    {x: 11, y: 13},
    {x: 12, y: 13},
    {x: 13, y: 13},
    {x: 14, y: 13},
    {x: 15, y: 13},
    {x: 16, y: 13},
    
    {x: 16, y: 14},
    {x: 16, y: 15},
    {x: 16, y: 16},
    {x: 16, y: 17},
    
    {x: 16, y: 18},
    {x: 15, y: 18},
    {x: 14, y: 18},
    {x: 13, y: 18},
    {x: 12, y: 18},
    {x: 11, y: 18},
    {x: 10, y: 18},
    {x: 9, y: 18},
    {x: 8, y: 18},
    {x: 7, y: 18},
    {x: 6, y: 18},
    {x: 5, y: 18},
    {x: 4, y: 18},
    {x: 3, y: 18},
    
    {x: 3, y: 17},
    {x: 3, y: 16},
    {x: 3, y: 15},
    {x: 3, y: 14},

];
var hidden = 0;
var count = 0;
var count2 = 0;
var m = {x: 9.5, y: 9.5, w: 1, h: 1};
var transis = false;
var transis2 = false;
var tState = "menu";
var gameStart = true;
var time = 3;
var tc = 0;
var fruit = {x: rand(0,19), y: rand(0,19)};
var score = 0;
var snake = [{x: 10, y: 10, col: "#34eb9b"}];
var interval = 400;
var ic = 0;
var dir = "u";
var dead = false;
var deadR = true;
var di = 0;
var dc = 0;
var nextMove = true;
var moving = "u";
var canRefresh = false;
var auto = true;
var key1 = false;
var key3 = true;
var help = false;
var timeout = 0;
var cc= 0;
var ec= 0;
var popper = false;
var enabled = false;

function background() {
    //background
    ctx.fillStyle = "#212D40";
    ctx.fillRect(0,0,c.width, c.height);
    
    ctx.fillStyle = "#364156"
    for (i = 0; i < 19; i+=2) {
        for(p = 0; p < 19; p+=2) {
            ctx.fillRect(i, p, 1, 1);
            ctx.fillRect(i + 1, p + 1, 1, 1);
        }
    }
}


function move(dir) {
        
    //move in dir
    if (dir == "u") {
        snake.unshift({x: snake[0].x, y: snake[0].y - 1, col: "#34eb9b"});
        snake.pop();
        moving = "u"
    }else if (dir == "d") {
        snake.unshift({x: snake[0].x, y: snake[0].y + 1, col: "#34eb9b"});
        snake.pop();
        moving = "d"
    }else if (dir == "l") {
        snake.unshift({x: snake[0].x - 1, y: snake[0].y, col: "#34eb9b"});
        snake.pop();
        moving = "l"
    }else if (dir == "r") {
        snake.unshift({x: snake[0].x + 1, y: snake[0].y, col: "#34eb9b"});
        snake.pop();
        moving = "r"
    }
    
    //edge
    if (snake[0].x >= 20) {
        snake[0].x = 0;
    }
    
    if (snake[0].x <= -1) {
        snake[0].x = 19;
    }
    
    if (snake[0].y >= 20) {
        snake[0].y = 0;
    }
    
    if (snake[0].y <= -1) {
        snake[0].y = 19;
    }
    
    //self
    if (!deadR) {
        for (i = 1; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                dead = true;
            }        
        }
    }
        
    //fruit col
    if (snake[0].x == fruit.x && snake[0].y == fruit.y) {
        replaceFruit();
        score++;
        snake.push({x: snake[0].x, y: snake[0].y, col: "#34eb9b"})
        if (interval > 50) {
            interval-=2;
        }
    }
    
//    if (!nextMove) {
//        nextMove = true;
//    }
}

function replaceFruit() {
    fruit.x = rand(0, 19);
    fruit.y = rand(0, 19);
    var t = false;
    
    while(!t) {
        fruit.x = rand(0, 19);
        fruit.y = rand(0, 19);
        
        var p = false;
        for ( i = 0; i < snake.length; i++) {
            if (fruit.x == snake[i].x && fruit.y == snake[i].y) {
               p = false; 
            } else {p = true;}
        }
        
        if (p) {
            t = true;
            return;
        }
    }
}
var ang = 140
function draw() {
    background();
    
    if (gameStart) {
        
        //fruit
        ctx.fillStyle = "#D66853";
        ctx.drawImage(cherry, fruit.x, fruit.y, 1, 1);
  
        //snake
        ic+=dt;
        if (ic > interval) {
            ic = 0;
            if (!auto) {
                move(dir);
            }
        }
        
        //draw snake
        for (i = 0; i < snake.length; i++) {
            ctx.fillStyle = snake[i].col;
            if (!dead && auto && !help) {
                ctx.fillStyle = "cyan";
            } else if (help) {
                ctx.fillStyle = "orange";
            }
            ctx.fillRect(snake[i].x, snake[i].y, 1, 1);
        }
        
        ctx.fillStyle = "#ff365a";
        switch (moving) {
            case "u":
                ctx.fillRect(snake[0].x + 0.4, snake[0].y, 0.2, -0.5);
                ctx.drawImage(faceIMG, snake[0].x, snake[0].y, 1, 1);
                
                break;
                
            case "d":
                ctx.fillRect(snake[0].x + 0.4, snake[0].y + 1, 0.2, 0.5);
                ctx.drawImage(faceIMG2, snake[0].x, snake[0].y, 1, 1);
                break;
                
            case "l":
                ctx.fillRect(snake[0].x, snake[0].y + 0.4, -0.5, 0.2);
                
                ctx.save();
                ctx.drawImage(faceIMG3, snake[0].x, snake[0].y, 1, 1)
                break;
                
            case "r":
                ctx.fillRect(snake[0].x + 1, snake[0].y + 0.4, 0.5, 0.2);
                
                ctx.save();
                ctx.drawImage(faceIMG4, snake[0].x, snake[0].y, 1, 1);
                break;
                
                
        }
        
        //dead
        if (dead) {
            interval = 100000000;
            
            window.setTimeout(function l() {
                canRefresh = true;
            }, 1000);
            
            di += dt;
            
            if (di > 50) {
                di = 0;
                snake[dc].col = "red";
                if (dc <= snake.length - 2) {
                    dc++;
                }
                
            }
            
            if (canRefresh) {
                //score
                ctx.fillStyle = "white";
                ctx.font = "1px roboto";
                ctx.fillText("Press Any To Restart", 5.5, 15.5);
    
            }

            //score
            ctx.fillStyle = "white";
            ctx.font = "3px roboto";
            ctx.fillText("Score: " + score, 4, 12.5);
            ctx.fillStyle = "darkred";
            ctx.fillText("GAME OVER", 2, 10);
        
        } else {
            //score
            if (deadR) {
                ctx.fillStyle = "blue";
            } else {
                ctx.fillStyle = "white";
            }
            ctx.font = "1px roboto";
            ctx.fillText("Score: " + score, 0.2, 1);
        }
        
        
    } else {
        tc+=dt;
        
        if (tc > 1000) {
            
            tc = 0;
            
            if (time < 2) {
                gameStart = true;
            } else {
                time--;
            }
        
        }
        
        ctx.fillStyle = "#D66853";
        ctx.drawImage(cherry, fruit.x, fruit.y, 1, 1);
        
        ctx.fillStyle = "#34eb9b";
        if (!dead && auto) {
            ctx.fillStyle = "cyan";
        }
        ctx.fillRect(10, 10, 1, 1);
        
        ctx.fillStyle = "white";
        ctx.font = "10px roboto";
        ctx.fillText(time, 7.5, 8);
    }
    
    transistionIN();
    transistionOUT();
}

function drawMenu() {
    background();
    
//    count += dt;
//    
//    if (count >= 200) {
//        hidden++;
//        count = 0;
//    }
//
//    if (hidden > ms.length - 3) {
//        hidden = 0;
//    }
//    
//    //snake
//    for(i = 0; i < ms.length; i++) {
//        
//        ctx.fillStyle = "#34eb9b";
//        if (i != hidden && i != hidden + 1 && i != hidden + 2) {
//            ctx.fillRect(ms[i].x, ms[i].y, 1, 1);
//        }
//    }
    
    if (auto) {
        autoF();
    }
    timeout+= dt;
    //fruit
    ctx.fillStyle = "#D66853";
    ctx.drawImage(cherry, fruit.x, fruit.y, 1, 1);

    //draw snake
    for (i = 0; i < snake.length; i++) {
        ctx.fillStyle = snake[i].col;
        if (!dead && auto && !help) {
            ctx.fillStyle = "cyan";
        } else if (help) {
            ctx.fillStyle = "orange";
        }
        ctx.fillRect(snake[i].x, snake[i].y, 1, 1);
    }

    ctx.fillStyle = "#ff365a";
    switch (moving) {
        case "u":
            ctx.fillRect(snake[0].x + 0.4, snake[0].y, 0.2, -0.5);
            ctx.drawImage(faceIMG, snake[0].x, snake[0].y, 1, 1);

            break;

        case "d":
            ctx.fillRect(snake[0].x + 0.4, snake[0].y + 1, 0.2, 0.5);
            ctx.drawImage(faceIMG2, snake[0].x, snake[0].y, 1, 1);
            break;

        case "l":
            ctx.fillRect(snake[0].x, snake[0].y + 0.4, -0.5, 0.2);

            ctx.save();
            ctx.drawImage(faceIMG3, snake[0].x, snake[0].y, 1, 1)
            break;

        case "r":
            ctx.fillRect(snake[0].x + 1, snake[0].y + 0.4, 0.5, 0.2);

            ctx.save();
            ctx.drawImage(faceIMG4, snake[0].x, snake[0].y, 1, 1);
            break;


        }
    
    //title
    if( timeout < 10000) {
            ctx.drawImage(titleIMG, 0.5, 5, 19, 4);
        if (enabled) {
            ctx.fillStyle = "black";
            ctx.fillText("Press Any To Start", 2.05, 12.1)
            ctx.fillStyle = "white";
            ctx.font = "2px roboto";
            ctx.fillText("Press Any To Start", 2, 12)
        }
    } else {
        if (enabled) {
            ctx.fillStyle = "black";
            ctx.fillText("Press Any To Start", 2.05, 18.1)
            ctx.fillStyle = "white";
            ctx.font = "2px roboto";
            ctx.fillText("Press Any To Start", 2, 18)
        }
    }
    
    ec+=dt;
    if (ec > 800) {
        ec = 0;
        enabled = !enabled;
    }
    
    transistionIN();
    transistionOUT();
}

function mReset() {
    m = {x: 9.5, y: 9.5, w: 1, h: 1};
}

function transistionOUT() {
    if (transis) {
        count2+=dt;
        if (count2 > 50) {
            m.x--;
            m.y--;
            m.w+=2;
            m.h+=2;
            count2 = 0;
            
            if (m.x <= -1) {
                transis = false;
                state = tState;
                transis2 = true;
            }
        }

        ctx.fillStyle = "black";
        ctx.fillRect(9, 9, 1, 1);
        ctx.fillRect(10, 9, 1, 1);
        ctx.fillRect(10, 10, 1, 1);
        ctx.fillRect(9, 10, 1, 1);

        ctx.fillRect(m.x, m.y, m.w, m.h);
    }
}

function transistionIN() {
    if (transis2) {

        count2+=dt;
        if (count2 > 50) {
            m.x++;
            m.y++;
            m.w-=2;
            m.h-=2;
            count2 = 0;
            
            if (m.x >= 9.5) {
                transis = false;
                transis2 = false;
            }
        }

        ctx.fillStyle = "black";
        ctx.fillRect(9, 9, 1, 1);
        ctx.fillRect(10, 9, 1, 1);
        ctx.fillRect(10, 10, 1, 1);
        ctx.fillRect(9, 10, 1, 1);

        ctx.fillRect(m.x, m.y, m.w, m.h);
    }
}

function check(d) {
    var t = true;
    
    if (d == "u") {
        for (i = 0; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y - 1 == snake[i].y) {
                t = false;
            }
            
            if (snake[0].x == snake[i].x && snake[0].y - 2 == snake[i].y) {
                t = false;
            }
            
            if (snake[0].x == snake[i].x && snake[0].y - 3 == snake[i].y) {
                t = false;
            }
        }

    }else if (d == "d") {
        for (i = 0; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y + 1 == snake[i].y) {
                t = false;
            }
             
            if (snake[0].x == snake[i].x && snake[0].y + 2 == snake[i].y) {
                t = false;
            }
            
            if (snake[0].x == snake[i].x && snake[0].y + 3 == snake[i].y) {
                t = false;
            }
                    
        }

    }else if (d == "l") {
        for (i = 0; i < snake.length; i++) {
            if (snake[0].x == snake[i].x - 1 && snake[0].y == snake[i].y) {
                t = false;
            }
            
            if (snake[0].x == snake[i].x - 2 && snake[0].y == snake[i].y) {
                t = false;
            }
            
            if (snake[0].x == snake[i].x - 3 && snake[0].y == snake[i].y) {
                t = false;
            }
        }

    }else if (d == "r") {
        for (i = 0; i < snake.length; i++) {
            if (snake[0].x == snake[i].x + 1 && snake[0].y == snake[i].y) {
                t = false;
            }
            
            if (snake[0].x == snake[i].x + 2 && snake[0].y == snake[i].y) {
                t = false;
            }
            
            if (snake[0].x == snake[i].x + 3 && snake[0].y == snake[i].y) {
                t = false;
            }
        }
    }
    
    return t;
}

function judgeMovement() {
    switch (moving) {
        case "u":
            for (i = 0; i < snake.length; i++) {
                if (snake[0].x == snake[i].x && snake[0].y - 1 == snake[i].y) {
                    if (check("r")) {
                        dir = "r";    
                    } else if (check("l")) {
                        dir = "l";    

                    }
                    return;
                }
            }
            break;
            
        case "d":
            for (i = 0; i < snake.length; i++) {
                if (snake[0].x == snake[i].x && snake[0].y + 1 == snake[i].y) {
                    if (check("l")) {
                        dir = "l";    
                    } else if (check("r")) {
                        dir = "r";    

                    }
                    return;
                }
                    
            }
            break;
        
        case "l":
            for (i = 0; i < snake.length; i++) {
                if (snake[0].x == snake[i].x - 1 && snake[0].y == snake[i].y) {
                    if (check("u")) {
                        dir = "u";    
                    } else if (check("d")) {
                        dir = "d";    

                    }
                    return;
                }
            }
            break;
            
        case "r":
            for (i = 0; i < snake.length; i++) {
                if (snake[0].x == snake[i].x + 1 && snake[0].y == snake[i].y) {
                    if (check("u")) {
                        dir = "u";    
                    } else if (check("d")) {
                        dir = "d";    

                    }
                    return;
                }
            }
            break;
            
    }
}

function autoF() {
    
    if (!deadR) {
        judgeMovement();
    }
    
    if (snake[0].x != fruit.x) {
        if (snake[0].x < fruit.x) {
            if (dir != "l" && moving != "l") {
                if (check("r") && !deadR) {
                    dir = "r";
                } else if (deadR) {
                    dir = "r"
                }
            }
        } else if (snake[0].x > fruit.x) {
            if (dir != "r" && moving != "r") {
                if (check("l") && !deadR) {
                    dir = "l";
                } else if (deadR) {
                    dir = "l"
                }
            }
        }
    }
    
    if (snake[0].y != fruit.y) {
        if (snake[0].y < fruit.y) {
            if (dir != "u" && moving != "u") {
                if (check("d") && !deadR) {
                    dir = "d";
                } else if (deadR) {
                    dir = "d"
                }
            }
        } else if (snake[0].y > fruit.y) {
            if (dir != "d" && moving != "d") {
                if (check("u") && !deadR) {
                    dir = "u";
                } else if (deadR) {
                    dir = "u"
                }
            }
        }
    }
    
    if (!dead && gameStart && state == "game") {
        STACKCOUNT = 0;
        aiMove()
    } else if (state == "menu") {
        
        cc+=dt;
        
        if (cc > 10) {
            STACKCOUNT = 0;
            aiMove()
            cc =0;
        }
        
        if (snake.length > 50) {
            popper = true;
        }
        
        if (popper && snake.length != 1) {
            snake.pop();
            
            if (snake.length <= 1) {
                popper = false;
            }
        }
        
    }
}
var STACKCOUNT = 0;

function aiMove() {
    STACKCOUNT++;
    
    if (STACKCOUNT < 5 && !key3) {
        if (check(dir)) {
            move(dir);
        } else {
            if (dir == "u") {
                if (check("l")) {
                    dir = "l"
                } else if (check("r")) {
                    dir  = "r";
                }
            } else if (dir == "d") {
                if (check("l")) {
                    dir = "l"
                } else if (check("r")) {
                    dir  = "r";
                }
            } else if (dir == "l") {
                if (check("d")) {
                    dir = "d"
                } else if (check("u")) {
                    dir  = "u";
                }
            } else if (dir == "r") {
                if (check("d")) {
                    dir = "d"
                } else if (check("u")) {
                    dir  = "u";
                }
            }
            aiMove();
        }
    } else {
        if (!deadR) {
            help = true;
        } else {
            move(dir);
        }
    }
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;

    switch (state) {
        case "menu":
            
            drawMenu();
            break;
            
        case "game":
            if (auto) {
                autoF();
            }
            
            draw();
            break;
    }
    
    requestAnimationFrame(update);
}

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.onmousemove = handleMouseMove;
var mouse = {x: 0, y: 0};

function handleMouseMove(event) {

	event = event || window.event; // IE-ism
    
	//MouseX = event.pageX;
	//MouseY = event.pageY;
    
    var rect = canvas.getBoundingClientRect()
    
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
    
    mouse.x = Math.abs((event.clientX - rect.left) * scaleX);
    mouse.y = Math.abs((event.clientY - rect.top) * scaleY);
    
    
    mouse.x = Math.round(mouse.x);
    mouse.y = Math.round(mouse.y);
}

document.addEventListener("keydown", event => {
    if (state == "menu" && !transis) {
        mReset();
        auto = false;
        key3 = false;
        dead = false;
        deadR = false;
        gameStart = false;
        dir = "u";
        score = 0;
        replaceFruit();
        snake = [{x: 10, y: 10, col: "#34eb9b"}];
        tState = "game";
        transis = true;
    } else if (state == "game" && !dead /*&& nextMove*/) {
        
        switch (event.keyCode) {
            case 37:
                if (dir != "r" && moving != "r") {
                    nextMove = false;
                    dir = "l"
                }
                break;
            
            case 39:
                if (dir != "l" && moving != "l") {
                    nextMove = false;
                    dir = "r"
                }
                break;
            
            case 38:
                if (dir != "d" && moving != "d") {
                    nextMove = false;
                    dir = "u"
                }
                break;
            
            case 40:
                if (dir != "u" && moving != "u") {
                    nextMove = false;
                    dir = "d"
                }
                break;
        }
        
    } else if (dead && canRefresh) {
        location.reload();
    }
    
    if (event.keyCode == 16) {
        key1 = true;
    }
    
    if (event.keyCode == 76 && key1) {
        auto = !auto;
    } else if (auto && help) {
        switch (event.keyCode) {
            case 37:
                dir = "l"
                break;
            
            case 39:
                dir = "r"
                break;
            
            case 38:
                dir = "u"
                break;
            
            case 40:
                dir = "d"
                break;
        }
        
        help = false;
        move(dir);
    }
    
    if (event.keyCode == 75 && key1) {
        deadR = !deadR;
    }
    
    if (event.keyCode == 74 && key1) {
        key3 = !key3;
    }
    
    
    if (event.keyCode == 27) {
        location.reload();
    }
    
});

document.addEventListener("keyup", event => {
    if (event.keyCode == 16) {
        key1 = false;
    }
});

document.addEventListener("keypress", event => {
    
});


document.addEventListener("click", event => {
    if (state == "menu" && !transis) {
        mReset();
        auto = false;
        key3 = false;
        dead = false;
        deadR = false;
        gameStart = false;
        dir = "u";
        score = 0;
        replaceFruit();
        snake = [{x: 10, y: 10, col: "#34eb9b"}];
        tState = "game";
        transis = true;
    } else if (state == "game" && dead && canRefresh) {
        location.reload();
    }
    
});

update();
