const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(20,20);
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
var fruit = {x: rand(0,19), y: rand(0,19), c: randCol()};
var fruit2 = {x: rand(0,19), y: rand(0,19), c: randCol()};
var fruit3 = {x: rand(0,19), y: rand(0,19), c: randCol()};
var bigFruit = {x: 50, y: rand(0,19), c: randCol()};
var score = 0;
var snake_color = "#34eb9b"
var snake = [{x: 20, y: 20, col: snake_color}];
var interval = 100;
var ic = 0;
var di = 0;
var dc = 0;
var dir = "u";
var dead = false;
var deadR = true;
var nextMove = true;
var moving = "u";
var canRefresh = false;
var timeout = 0;
var ec= 0;
var enabled = false;
var menucounter = 0;
var auto_snake_enabled = true;
var key1 = false;
var auto_target = null;

function background() {
    //background
    ctx.fillStyle = "#212D40";
    ctx.fillRect(0,0,c.width, c.height);
    
    ctx.fillStyle = "#364156"
    for (i = 0; i < 39; i+=2) {
        for(p = 0; p < 39; p+=2) {
            ctx.fillRect(i, p, 1, 1);
            ctx.fillRect(i + 1, p + 1, 1, 1);
        }
    }
}
function move(dir) {
        
    //move in dir
    if (dir == "u") {
        snake.unshift({x: snake[0].x, y: snake[0].y - 1, col: snake_color});
        snake.pop();
        moving = "u"
    }else if (dir == "d") {
        snake.unshift({x: snake[0].x, y: snake[0].y + 1, col: snake_color});
        snake.pop();
        moving = "d"
    }else if (dir == "l") {
        snake.unshift({x: snake[0].x - 1, y: snake[0].y, col: snake_color});
        snake.pop();
        moving = "l"
    }else if (dir == "r") {
        snake.unshift({x: snake[0].x + 1, y: snake[0].y, col: snake_color});
        snake.pop();
        moving = "r"
    }
    
    //edge
    if (snake[0].x >= 40) {
        snake[0].x = 0;
    }
    
    if (snake[0].x <= -1) {
        snake[0].x = 39;
    }
    
    if (snake[0].y >= 40) {
        snake[0].y = 0;
    }
    
    if (snake[0].y <= -1) {
        snake[0].y = 39;
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
        snake_color = fruit.c;
        replaceFruit(fruit);
        score++;
        snake.push({x: snake[0].x, y: snake[0].y, col: snake_color})
        if (interval > 38) {
            interval--;
        }
        
        if (bigFruit.x == 50) {

            var ri = rand(1, 5);

            if (ri >= 5) {
                replaceFruit(bigFruit);
            }
        }
        
        if (auto_snake_enabled) {
            selectAutoTarget();
        }
        
    } else if (snake[0].x == fruit2.x && snake[0].y == fruit2.y) {
        snake_color = fruit2.c;
        replaceFruit(fruit2);
        score++;
        snake.push({x: snake[0].x, y: snake[0].y, col: snake_color})
        snake.push({x: snake[1].x, y: snake[1].y, col: snake_color})
        if (interval > 38) {
            interval--;
        }
    
        if (bigFruit.x == 50) {

            var ri = rand(1, 5);

            if (ri >= 5) {
                replaceFruit(bigFruit);
            }
        }
        
        if (auto_snake_enabled) {
            selectAutoTarget();
        }
        
    } else if (snake[0].x == fruit3.x && snake[0].y == fruit3.y) {
        snake_color = fruit3.c;
        replaceFruit(fruit3);
        score++;
        snake.push({x: snake[0].x, y: snake[0].y, col: snake_color})
        snake.push({x: snake[1].x, y: snake[1].y, col: snake_color})
        snake.push({x: snake[2].x, y: snake[2].y, col: snake_color})
        if (interval > 38) {
            interval--;
        }
        
        
        if (bigFruit.x == 50) {

            var ri = rand(1, 5);

            if (ri >= 5) {
                replaceFruit(bigFruit);
            }
        }
        
        if (auto_snake_enabled) {
            selectAutoTarget();
        }
        
    }else if ((snake[0].x == bigFruit.x || snake[0].x == bigFruit.x + 1) && (snake[0].y == bigFruit.y || snake[0].y == bigFruit.y + 1)) {
        snake_color = bigFruit.c;
        bigFruit.x = 50;
        score+= 20;
        snake.push({x: snake[0].x, y: snake[0].y, col: snake_color});
	    snake.push({x: snake[1].x, y: snake[1].y, col: snake_color});
	    snake.push({x: snake[2].x, y: snake[2].y, col: snake_color});
	    snake.push({x: snake[3].x, y: snake[3].y, col: snake_color});
	    snake.push({x: snake[4].x, y: snake[4].y, col: snake_color});
        if (interval > 38) {
            interval--;
        }
        
        
        if (bigFruit.x == 50) {

            var ri = rand(1, 5);

            if (ri >= 5) {
                replaceFruit(bigFruit);
            }
        }
        
        if (auto_snake_enabled) {
            selectAutoTarget();
        }
        
    }
    
//    if (!nextMove) {
//        nextMove = true;
//    }
}

function selectAutoTarget() {
//    var diff1a = Math.abs(snake[0].x - fruit.x);
//    var diff1b = Math.abs(snake[0].y - fruit.y);
//    
//    var diff2a = Math.abs(snake[0].x - fruit2.x);
//    var diff2b = Math.abs(snake[0].y - fruit2.y);
//    
//    var diff3a = Math.abs(snake[0].x - fruit3.x);
//    var diff3b = Math.abs(snake[0].y - fruit3.y);
//    
//    var diff4a = Math.abs(snake[0].x - bigFruit.x);
//    var diff4b = Math.abs(snake[0].y - bigFruit.y);
//    
//    var avg1 = (diff1a + diff1b) / 2;
//    var avg2 = (diff2a + diff2b) / 2;
//    var avg3 = (diff3a + diff3b) / 2;
//    var avg4 = 0;
//    if (bigFruit.x != 50) {
//        avg4 = (diff4a + diff4b) / 2;
//    } else {
//        avg4 = 10000000;
//    }
//    
//    auto_target = Math.min(avg1, avg2, avg3, avg4);
//    
    
    var p1 = Math.sqrt(Math.pow(fruit.x - snake[0].x, 2) + 
                       Math.pow(fruit.y - snake[0].y, 2));
    
    var p2 = Math.sqrt(Math.pow(fruit2.x - snake[0].x, 2) + 
                       Math.pow(fruit2.y - snake[0].y, 2));
    
    var p3 = Math.sqrt(Math.pow(fruit3.x - snake[0].x, 2) + 
                       Math.pow(fruit3.y - snake[0].y, 2));
    var p4 = 1000000;
    
    if (bigFruit.x != 50) {
        p4 = Math.sqrt(Math.pow(bigFruit.x - snake[0].x, 2) + 
                       Math.pow(bigFruit.y - snake[0].y, 2));
    }
    
    var optimal = Math.min(p1, p2, p3, p4);
    
    if (optimal == p1) {
        auto_target = fruit;
    } else if (optimal == p2) {
        auto_target = fruit2;
    } else if (optimal == p3) {
        auto_target = fruit3;
    } else if (optimal == p4) {
        auto_target = bigFruit;
    }
    
//    if (auto_target == avg1) {
//        auto_target = fruit;
//    } else if (auto_target == avg2) {
//        auto_target = fruit2;
//    } else if (auto_target == avg3) {
//        auto_target = fruit3;
//    } else if (auto_target == avg4) {
//        auto_target = bigFruit;
//    }
}

function checker() {
    if (moving == "l") {
        if (check("u")) {
            dir = "u";
            move(dir);
        } else if (check("d")) {
            dir = "d"
            move(dir);
        }
    } else if (moving == "r") {
        if (check("u")) {
            dir = "u";
            move(dir);
        } else if (check("d")) {
            dir = "d"
            move(dir);
        }
    } else if (moving == "u") {
        if (check("l")) {
            dir = "l";
            move(dir);
        } else if (check("r")) {
            dir = "r"
            move(dir);
        }
    } else if (moving == "d") {
        if (check("l")) {
            dir = "l";
            move(dir);
        } else if (check("r")) {
            dir = "r"
            move(dir);
        }
    }
    
    if (!check("l") && !check("r") && !check("u") && !check("d")) {
        console.log("SNAKE: I Can't Move");
        if (!deadR) {
            dead = true;
        } else {move(dir)}
        //snake[0].x += 2;
    }
    
    if (moving == "l" && !check("u") && !check("d")) {
        if (check("l")) {
            dir = "l";
            move(dir);
        } else {
            console.log("SNAKE: I Can't Move");
            if (!deadR) {
                dead = true;
            } else {move(dir)}
        }
    }
    
    if (moving == "r" && !check("u") && !check("d")) {
        if (check("r")) {
            dir = "r";
            move(dir);
        } else {
            console.log("SNAKE: I Can't Move");
            if (!deadR) {
                dead = true;
            } else {move(dir)}
        }
    }
    
    if (moving == "u" && !check("l") && !check("r")) {
        if (check("u")) {
            dir = "u";
            move(dir);
        } else {
            console.log("SNAKE: I Can't Move");
            if (!deadR) {
                dead = true;
            } else {move(dir)}
        }
    }
    
    if (moving == "d" && !check("l") && !check("r")) {
        if (check("d")) {
            dir = "d";
            move(dir);
        } else {
            console.log("SNAKE: I Can't Move");
            if (!deadR) {
                dead = true;
            } else {move(dir)}
        }
    }
    
}

function check(d) {
    var cDist = 1;
    
    if (d == "l") {
        var t = true;
        
        for (i = 1; i < snake.length; i++) {
            if (snake[0].x - cDist  == snake[i].x && snake[0].y == snake[i].y) {
                t = false;
            }
        }
    
        return t;
    } else if (d == "r") {
        var t = true;
        
        for (i = 1; i < snake.length; i++) {
            if (snake[0].x + cDist  == snake[i].x && snake[0].y == snake[i].y) {
                t = false;
            }
        }
    
        return t;
    } else if (d == "u") {
        var t = true;
        
        for (i = 1; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y - cDist == snake[i].y) {
                t = false;
            }
        }
    
        return t;
    } else if (d == "d") {
        var t = true;
        
        for (i = 1; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y + cDist == snake[i].y) {
                t = false;
            }
        }
    
        return t;
    }
}

function autoSnake() {
    
    if (auto_target == null) {
        selectAutoTarget();
    }

    if (state == "menu") {
        if (snake[0].x != auto_target.x) {
            if (snake[0].x < auto_target.x) {
                dir = "r"
            } else {
                dir = "l"
            }
        }

        if (snake[0].y != auto_target.y) {
            if (snake[0].y < auto_target.y) {
                dir = "d"
            } else {
                dir = "u"
            }
        }
    }
    
    
    if (state == "game") {
        if (snake[0].x != auto_target.x) {
            if (snake[0].x < auto_target.x) {
                if (check("r")) {
                    dir = "r"
                    move(dir);
                } else {checker()}
            } else {
                if (check("l")) {
                    dir = "l"
                    move(dir);
                } else {checker()}
            }
        }else if (snake[0].y != auto_target.y) {
            if (snake[0].y < auto_target.y) {
                if (check("d")) {
                    dir = "d"
                    move(dir);
                } else {checker()}
            } else {
                if (check("u")) {
                    dir = "u"
                    move(dir);
                } else {checker()}
            }
        }
        
    }
    
    
    if (state == "menu") {

        menucounter += dt;

        if (menucounter > 40) {
            menucounter = 0;
            move(dir);
            
            if (snake.length > 100) {
                snake = [snake[0]];
            }
        }
    }
    
}

function replaceFruit(f) {
    
    f.x = rand(0, 39);
    f.y = rand(0, 39);
    f.c = randCol();
    for ( i = 0; i < snake.length; i++) {
        if (f.x != snake[i].x && f.y != snake[i].y) {
           return; 
        } else {replaceFruit(f); console.log("fruit replaced")}
    }
}
var ang = 140
function draw() {
    background();
    
    if (gameStart) {
        
        //fruit
        //ctx.fillStyle = "#D66853";
        ctx.drawImage(cherry, fruit.x, fruit.y, 1, 1);
        ctx.drawImage(cherry, fruit2.x, fruit2.y, 1, 1);
        ctx.drawImage(cherry, fruit3.x, fruit3.y, 1, 1);
        ctx.drawImage(cherry, bigFruit.x, bigFruit.y, 2, 2);
        //snake
        
        
        if (auto_snake_enabled) {
            if (!dead) {
                autoSnake();
            }
        } else {
            ic+=dt;
            if (ic > interval) {
                ic = 0;
                move(dir);
            }
        }
        
        //draw snake
        for (i = 0; i < snake.length; i++) {
            ctx.fillStyle = snake[i].col;
            ctx.fillRect(snake[i].x, snake[i].y, 1, 1);
        }
        
        if (auto_snake_enabled) {
            ctx.beginPath();
            ctx.lineWidth = "0.2";
            ctx.strokeStyle = "red";
            ctx.moveTo(snake[0].x + 0.5, snake[0].y + 0.5);
            ctx.lineTo(auto_target.x + 0.5, auto_target.y + 0.5);
            ctx.stroke();
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
                ctx.font = "2px roboto";
                ctx.fillText("Press Any To Restart", 10.5, 30);
    
            }

            //score
            ctx.fillStyle = "white";
            ctx.font = "5px roboto";
            ctx.fillText("Score: " + score, 11, 22.5);
            ctx.fillStyle = "darkred";
            ctx.fillText("GAME OVER", 6.5, 18);
        
        } else {
            //score
            if (deadR) {
                ctx.fillStyle = "blue";
            } else {
                ctx.fillStyle = "white";
            }
            ctx.font = "2px roboto";
            ctx.fillText("Score: " + score, 0.2, 1.6);
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
        
        //ctx.fillStyle = "#D66853";
        ctx.drawImage(cherry, fruit.x, fruit.y, 1, 1);
        ctx.drawImage(cherry, fruit2.x, fruit2.y, 1, 1);
        ctx.drawImage(cherry, fruit3.x, fruit3.y, 1, 1);
        ctx.drawImage(cherry, bigFruit.x, bigFruit.y, 2, 2);
        
        
        ctx.fillStyle = "#34eb9b";
        ctx.fillRect(20, 20, 1, 1);
        
        ctx.fillStyle = "white";
        ctx.font = "30px roboto";
        ctx.fillText(time, 12, 29);
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
    if (auto_snake_enabled) {
        autoSnake();
    }
    
    timeout+= dt;
    //fruit
    //ctx.fillStyle = "#D66853";
    ctx.drawImage(cherry, fruit.x, fruit.y, 1, 1);
    ctx.drawImage(cherry, fruit2.x, fruit2.y, 1, 1);
    ctx.drawImage(cherry, fruit3.x, fruit3.y, 1, 1);
    ctx.drawImage(cherry, bigFruit.x, bigFruit.y, 2, 2);

    //draw snake
    for (i = 0; i < snake.length; i++) {
        ctx.fillStyle = snake[i].col;
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
            ctx.drawImage(titleIMG, 5.5, 10, 29, 8);
        if (enabled) {
            ctx.fillStyle = "black";
            //ctx.fillText("Press Any To Start", 2.05, 12.1)
            ctx.fillStyle = "white";
            ctx.font = "2px roboto";
            ctx.fillText("Press Any To Start", 12, 20)
        }
    } else {
        if (enabled) {
            ctx.fillStyle = "black";
            //ctx.fillText("Press Any To Start", 2.05, 18.1)
            ctx.fillStyle = "white";
            ctx.font = "2px roboto";
            ctx.fillText("Press Any To Start", 12, 38)
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
    m = {x: 19.5, y: 19.5, w: 1, h: 1};
}

function transistionOUT() {
    if (transis) {
        count2+=dt;
        if (count2 > 20) {
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
        //ctx.fillRect(9, 9, 1, 1);
        //ctx.fillRect(10, 9, 1, 1);
        //ctx.fillRect(10, 10, 1, 1);
        //ctx.fillRect(9, 10, 1, 1);

        ctx.fillRect(m.x, m.y, m.w, m.h);
    }
}

function transistionIN() {
    if (transis2) {

        count2+=dt;
        if (count2 > 30) {
            m.x++;
            m.y++;
            m.w-=2;
            m.h-=2;
            count2 = 0;
            
            if (m.x >= 20) {
                transis = false;
                transis2 = false;
            }
        }

        ctx.fillStyle = "black";
        //ctx.fillRect(9, 9, 1, 1);
        //ctx.fillRect(10, 9, 1, 1);
        //ctx.fillRect(10, 10, 1, 1);
        //ctx.fillRect(9, 10, 1, 1);

        ctx.fillRect(m.x, m.y, m.w, m.h);
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

function randCol() {
    var c, c1, c2, c3;
    
    c1 = rand(50, 255);
    c2 = rand(50, 255);
    c3 = rand(50, 255);
    
    c = "rgb(" + c1 + "," + c2 + "," + c3 + ")";
    
    return c;
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
        auto_snake_enabled = false;
        dead = false;
        deadR = false;
        gameStart = false;
        dir = "u";
        score = 0;
        replaceFruit(fruit);
        replaceFruit(fruit2);
        replaceFruit(fruit3);
        snake_color = "#34eb9b"
        snake = [{x: 20, y: 20, col: snake_color}];
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

    if (event.keyCode == 27) {
        location.reload();
    }
    
    if (event.keyCode == 16) {
        key1 = true;
    }
    
    if (key1 && event.keyCode == 76) {
        //deadR = !deadR;
        auto_snake_enabled = !auto_snake_enabled;
    }
    if (key1 && event.keyCode == 75) {
        deadR = !deadR;
        snake_color = "blue";
        //auto_snake_enabled = !auto_snake_enabled;
    }
    
});

document.addEventListener("keyup", event => {
    if (event.keyCode = 16) {
        key1 = false;
    }
});

document.addEventListener("keypress", event => {
    
});

document.addEventListener("click", event => {
    if (state == "menu" && !transis) {
        mReset();
        auto_snake_enabled = false;
        dead = false;
        deadR = false;
        gameStart = false;
        snake_color = "#34eb9b"
        dir = "u";
        score = 0;
        tState = "game";
        transis = true;
        replaceFruit(fruit);
        replaceFruit(fruit2);
        replaceFruit(fruit3);
        snake = [{x: 20, y: 20, col: snake_color}];
    } else if (state == "game" && dead && canRefresh) {
        location.reload();
    }
    
});

update();