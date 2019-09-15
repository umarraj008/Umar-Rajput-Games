const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;

var dt;

var title = true;
var buttons  = true;
var MouseX;
var MouseY;
var b1Highlight = false;
var b2Highlight = false;
var StartGame = false;
var GameMode1 = null; //-----------------MUST BE NULL WHEN PUBLISHING
var playerMoveSpeed = 7;
var compSpeed = 2;
var countdown = false;
var cVal = 3;
var Player1Start = null;
var ballSpeed;
var dificulty = 1;

var difficultySpeed = 0.5;


var testing1 = false;
var testing2 = false;
var BackgroundAlpha = 0;
var alphaSpeed = 0.015;
var bEasyHigh;
var bMedHigh;
var bHardHigh;
var bMenuHigh;

var flash1 = false;
var flash2 = false;
var flash3 = false;
var flashCount = 0;
var flashLength = 140;
var FlashUp = true;
var gameover = false;
var gameover2 = false;

var player1 = {
    x: 30,
    y: 540,
    score: 0,
    goUp: false,
    goDown: false,
};


var player2 = {
    x: 1920 - 20 - 30,
    y: 540,
    score: 0,
    goUp: false,
    goDown: false,
};


var ball = {
    x: c.width / 2,
    y: 540,
    vx: 0,
    vy: 0,
    a: 0,
    s: 0.4,
};

var ball2 = {
    x: 325.000001,
    y: 390,
    vx: 0.6,
    vy: 0.6,
    a: 0,
    s: 0.4,
};

//p1 59, 193, 255
//p2 255, 59, 59


function draw() {
    //base
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);
            
    if (!gameover2) {
    
        if (flash1) {
            ctx.fillStyle = "rgba(59, 193, 255, " + BackgroundAlpha + ")";
            ctx.fillRect(0, 0, c.width / 2, c.height);
        }

        if (flash2) {
            ctx.fillStyle = "rgba(255, 59, 59, " + BackgroundAlpha + ")";
            ctx.fillRect(c.width / 2, 0, c.width / 2, c.height);
        }


        if (!StartGame) {

            //dev note
            ctx.fillStyle = "white";
            ctx.font = "20px roboto";
            ctx.fillText("Ball May be Glitchy", 100, 30);
            ctx.fillText("Will Be Fixed Soon", 99, 55);
            
            //ball for show
            ctx.fillStyle = "#c1ff87";
            ctx.beginPath();
            ctx.ellipse(ball2.x, ball2.y, 15, 15, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
 
            //wall
            ctx.fillStyle = "#1c1c1c";
            ctx.fillRect(650.000002, 0, -10, 780)
            
            //title

            if (title) {
                ctx.fillStyle = "white";
                ctx.font = "100px Roboto";
                ctx.textAlign = "center";
                
                ctx.fillStyle = "#3bc0e1";
                ctx.fillText("Tennis", c.width / 2 - 75, c.height / 2 + 350);
                
                ctx.fillStyle = "#ff3b3b";
                ctx.fillText("For", c.width / 2 + 169, c.height / 2 + 350);

                ctx.fillStyle = "white";
                ctx.font = "1000px Roboto";
                ctx.fillText("2", c.width / 2, c.height / 2 + 240);
            }
            
            //button 1
            if (buttons) {
                if (b1Highlight) {
                    ctx.fillStyle = "#303030";

                } else {
                    ctx.fillStyle = "#1c1c1c";
                }

                ctx.fillRect(1270, 0, 1920, c.height / 2);

                //button easy
                ctx.fillStyle = "#1c1c1c";
                ctx.fillRect(0, c.height - 300, 216.666667, c.height);

                if (bEasyHigh) {
                    ctx.fillStyle = "White";
                    ctx.fillRect(0, c.height - 300, 216.666667, c.height);

                } 

                ctx.fillStyle = "#1c1c1c";
                ctx.fillRect(20, c.height - 280, 176.666667, 260);

                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.font = "40px Roboto"
                ctx.fillText("Easy", 100, 930);

                //button Med
                ctx.fillStyle = "#1c1c1c";
                ctx.fillRect(216.666667, c.height - 300, 216.666667, c.height);

                if (bMedHigh) {
                    ctx.fillStyle = "White";
                    ctx.fillRect(216.666667, c.height - 300, 216.666667, c.height);

                } 

                ctx.fillStyle = "#1c1c1c";
                ctx.fillRect(236.666667, c.height - 280, 176.666667, 260);

                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.font = "40px Roboto"
                ctx.fillText("Med", 316.666667, 930);

                //button Hard
                ctx.fillStyle = "#1c1c1c";
                ctx.fillRect(433.333334, c.height - 300, 216.666667, c.height);

                if (bHardHigh) {
                    ctx.fillStyle = "White";
                    ctx.fillRect(433.333334, c.height - 300, 216.666667, c.height);

                } 

                ctx.fillStyle = "#1c1c1c";
                ctx.fillRect(453.333334, c.height - 280, 176.666667, 260);

                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.font = "40px Roboto"
                ctx.fillText("Hard", 533.333334, 930);


                //button 2
                if (b2Highlight) {
                    ctx.fillStyle = "#303030";

                } else {
                    ctx.fillStyle = "#1c1c1c";
                }

                ctx.fillRect(1270, c.height / 2, 1920, c.height / 2);

                //button text
                ctx.fillStyle = "white";
                ctx.font = "70px Roboto";
                ctx.textAlign = "center";
                ctx.fillText("1 Player", 1600, c.height / 2 - 250);
                ctx.fillText("2 Player", 1600, c.height / 2 + 300);

            }
        }
        

        if (StartGame) {

            //Countdown
            if (countdown) {
                ctx.fillStyle = "#363636";
                ctx.font = "1000px Roboto";
                ctx.textAlign = "center";
                ctx.fillText(cVal, c.width / 2, c.height / 2 + 350);
            }

            //scores
            if (!countdown) {
                ctx.fillStyle = "#363636";
                ctx.font = "300px Roboto";
                ctx.textAlign = "center";

                //player 1
                ctx.fillText(player1.score, (c.width / 2) - 200, (c.height / 2) + 80);

                //player 2
                ctx.fillText(player2.score, (c.width / 2) + 200, (c.height / 2) + 80);
            }



            //middle Line
            if (!countdown) {
                ctx.fillStyle = "#363636"
                ctx.fillRect((c.width / 2) - 10, 0, 20, c.height);
            }

            //paddle 1
            ctx.fillStyle = "#3bc1ff"
            ctx.fillRect(player1.x, player1.y - 100, 20, 200);

            //paddle 2
            ctx.fillStyle = "#ff3b3b"
            ctx.fillRect(player2.x, player2.y - 100, 20, 200);


            //ball
            ctx.fillStyle = "#c1ff87";
            ctx.beginPath();
            ctx.ellipse(ball.x, ball.y, 15, 15, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();

        }
    }else if (gameover2) {
        
        //gameover title
        ctx.fillStyle = "red";
        ctx.font = "200px Roboto";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", c.width / 2 + 10, c.height / 2 - 300);
        
        //player wins text
        ctx.font = "100px Roboto";
        ctx.textAlign = "center";
        
        if (player1.score == 11) {
            ctx.fillStyle = "rgb(59, 193, 255)";
            ctx.fillText("Player 1 Wins", c.width / 2 + 10, c.height / 2 - 150);    
        }
        
        if (player2.score == 11) {
            ctx.fillStyle = "rgb(255, 59, 59)";
            ctx.fillText("Player 2 Wins", c.width / 2 + 10, c.height / 2 - 150);    
        }
        
        
        
        //button
        if (bMenuHigh) {
            ctx.fillStyle = "#303030";

        } else {
            ctx.fillStyle = "#1c1c1c";
        }

        ctx.fillRect(c.width / 2 - 300, c.height / 2, 600, 300);
        
        //button text
        ctx.fillStyle = "white";
        ctx.font = "70px Roboto";
        ctx.textAlign = "center";
        ctx.fillText("Menu", c.width / 2 - 5, c.height /2 + 180);
    }
    
    if (flash3) {
        ctx.fillStyle = "rgba(0, 0, 0, " + BackgroundAlpha + ")";
        ctx.fillRect(0, 0, c.width, c.height);
    }
    
}


function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;

    buttonHighlight();
    paddleMove();
    BallMovement();
    
    if (testing1) {
        player1.y = ball.y;
    }
    
    if (testing2) {
        player2.y = ball.y;
    }
    
    
    if (flash1 || flash2 || flash3) {
        flashCount++;
        
        if (FlashUp) {
            BackgroundAlpha += alphaSpeed;
        }
        
        if (BackgroundAlpha >= 1) {
            FlashUp = false;
            
            if (gameover) {
                gameover2 = true;
            }
        }
    
        if (!FlashUp) {
            BackgroundAlpha -= alphaSpeed;    
        }
    
    
    }
    
    if (flashCount > flashLength) {
        flash1 = false;
        flash2 = false;
        BackgroundAlpha = 0;
        flashCount = 0;
        FlashUp = true;
        flash3 = false;

    }
    
    if (player1.score == 11 || player2.score == 11) {
        if (!gameover2) {
            gameover = true;
            flash3 = true;
            flashLength = 600;
            alphaSpeed = 0.005;
        }
    }
    
    
    if (gameover) {
        player1.y = 540;
        player2.y = c.width / 2;
        ballSpeed = 0.5;

        ball.x = c.width / 2;
        ball.y = 540;
        ball.vx = 0; 
        ball.vy = 0;
    }
    
    if (!StartGame) {
        Ball2Movement();
    }
    
    draw();
    requestAnimationFrame(update);
}


function PlayerReset() {
    player1.y = 540;
    player2.y = c.width / 2;
    ballSpeed = difficultySpeed;
    
    ball.x = c.width / 2;
    ball.y = 540;
    ball.vx = 0; 
    ball.vy = 0;
    
    ThrowBallInRandomDirection();
}

function ThrowBallInRandomDirection() {
    setTimeout(function() {
        
        if (Player1Start) {
            ball.vx = -ballSpeed;
            ball.vy = -ballSpeed;
        } else if (!Player1Start) {
            ball.vx = ballSpeed;
            ball.vy = ballSpeed;
        }
        
        ball.r = -getRandomArbitrary(30, 150);
        ball.a =  ball.r * (Math.PI / 180);
    }, 3000);
    
    if (GameMode1) {
        player2.y = 540;
    }
}

function ThrowBallInRandomDirectionStart() {
    setTimeout(function() {
        
        if (Player1Start) {
            ball.vx = ballSpeed;
            ball.vy = ballSpeed;
        } else if (!Player1Start) {
            ball.vx = -ballSpeed;
            ball.vy = -ballSpeed;
        }
        
        ball.r = -getRandomArbitrary(30, 150);
        ball.a =  ball.r * (Math.PI / 180);
    }, 3000);
    
    countdown = true;
    
    
    if (countdown) {
        setTimeout(function() {cVal = 2} ,1000);
        setTimeout(function() {cVal = 1} ,2000);
        setTimeout(function() {countdown = false;} ,3000);
    }
}

function BallMovement() {
    ball.x += Math.cos(ball.a) * ball.vx * dt;
	ball.y += Math.sin(ball.a) * ball.vy * dt;
    
    if (ball.a < Math.PI / 6) {
        ball.a = Math.PI / 6;
    }else if(ball.a > Math.PI * 5 / 6) {
        ball.a = Math.PI * 5 / 6;
    }
    
    //left wall
    if (ball.x <= 0) {
        flash2 = true;
        player2.score++;
        Player1Start = false;
        PlayerReset();
    }
    
    //right wall
    if (ball.x >= c.width) {
        flash1 = true;
        player1.score++;
        Player1Start = true;
        PlayerReset();
    }
    
    //top wall
    if (ball.y <= 0) {
        ball.vy = -ball.vy;
    }
    
    //bottom wall
    if (ball.y >= c.height) {
        ball.vy = -ball.vy;
    }
    
    //player 1 Bounce
    if ((ball.y < player1.y + 100 && ball.y > player1.y - 100) && 
        (ball.x < player1.x + 20 && ball.x > player1.x)) {
        
        let angle = Math.atan2(-ball.vy, -ball.vx);
        
        angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * ball.s;
        ball.a = angle;
        
        ball.vy = -ball.vy;
        ball.vx = -ball.vx;
        
        ballSpeed += 0.02;
    }
    
    //player 2 Bounce
    if ((ball.y < player2.y + 100 && ball.y > player2.y - 100) && 
        (ball.x < player2.x && ball.x > player2.x - 20)) {
        
        let angle = Math.atan2(-ball.vy, ball.vx);
        
        angle -= (Math.random() * Math.PI / 2 - Math.PI / 4) * ball.s;
        ball.a = angle;
        
        ball.vy = -ball.vy;
        ball.vx = -ball.vx;
        ballSpeed += 0.015;
    }
}

function Ball2Movement() {
    
    ball2.x += Math.cos(ball.a) * ball2.vx * dt;
	ball2.y += Math.sin(ball.a) * ball2.vy * dt;
    
    if (ball2.a < Math.PI / 6) {
        ball2.a = Math.PI / 6;
    }else if(ball2.a > Math.PI * 5 / 6) {
        ball2.a = Math.PI * 5 / 6;
    }
    
    //left wall
    if (ball2.x <= 10) {
        ball2.vx = -ball2.vx;
        
    }
    
    //right wall
    if (ball2.x >= 650.000002 - 30) {
        ball2.vx = -ball2.vx;
        
    }
    
    //top wall
    if (ball2.y <= 10) {
        ball2.vy = -ball2.vy;
        
    }
    
    //bottom wall
    if (ball2.y >= 780 - 10) {
        ball2.vy = -ball2.vy;
       
    }
    
    if (ball2.x > 660 || ball2.x < -10 || ball2.y < -10 || ball2.y > 790) {
        ball2.x = 325.000001;
        ball2.y = 390;
    }
}



function paddleMove() {
    
    if (dificulty == 1) {
        compSpeed = 5
    }else if (dificulty == 2) {
        compSpeed = 7;
    }else if (dificulty == 3) {
        compSpeed = 9;
    }
    
    
    if (player1.goUp) {
        if (player1.y - 100 <= 0) {
            player1.goUp = false;
        } else {
            player1.y -= playerMoveSpeed;
        }
    }
    
    if (player1.goDown) {
        if (player1.y + 100 >= c.height) {
            player1.goDown = false;
        } else {
            player1.y += playerMoveSpeed;
        }
    }
    
    if (GameMode1 == true) {
        player2.goUp = false;
        player2.goDown = false;
        
        
        if (player2.y !== ball.y) {
            
            if (player2.y <= ball.y) {
                player2.y += compSpeed;

            } else if (player2.y >= ball.y) {
                player2.y -= compSpeed;
            }
        }
        
    } else if (GameMode1 == false) {
        if (player2.goUp) {
            if (player2.y - 100 <= 0) {
                player2.goUp = false;
            } else {
                player2.y -= playerMoveSpeed;
            }
        }

        if (player2.goDown) {
            if (player2.y + 100 >= c.height) {
                player2.goDown = false;
            } else {
                player2.y += playerMoveSpeed;
            }
        }
    }
    
}

function selectRandomPlayerToStart() {
    Player1Start = Math.random() >= 0.5;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function buttonHighlight() {
    
    //button 1
    if (MouseX >= 1270 && MouseX <= 1920 && MouseY >= 0 && MouseY <= c.height / 2) {
        b1Highlight = true
    } else {
        b1Highlight = false
    }
    
    if (dificulty == 1) {
        bEasyHigh = true;
        bMedHigh = false;
        bHardHigh = false;
        difficultySpeed = 0.5;
        ballSpeed = difficultySpeed;
        playerMoveSpeed = 7;
    }
    
    if (dificulty == 2) {
        bEasyHigh = false;
        bMedHigh = true;
        bHardHigh = false;
        difficultySpeed = 0.7;
        ballSpeed = difficultySpeed;
        playerMoveSpeed = 9;
    }
    
    if (dificulty == 3) {
        bEasyHigh = false;
        bMedHigh = false;
        bHardHigh = true;
        difficultySpeed = 0.9;
        ballSpeed = difficultySpeed;
        playerMoveSpeed = 12;
    }
    
    //button 2
    if (MouseX >= 1270 && MouseX <= 1920 && MouseY >= c.height / 2 && MouseY <= 1080) {
        b2Highlight = true
    } else {
        b2Highlight = false
    }
    
    //gameover menu
    if (MouseX >= 660 && MouseX <= 1255 &&
        MouseY >= 540 && MouseY <= 840) {
        
        bMenuHigh = true
    } else {
        bMenuHigh = false
    }
}



document.onmousemove = handleMouseMove;

function handleMouseMove(event) {

	event = event || window.event; // IE-ism
    
	//MouseX = event.pageX;
	//MouseY = event.pageY;
    
    var rect = canvas.getBoundingClientRect()
    
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
    
    MouseX = Math.abs((event.clientX - rect.left) * scaleX);
    MouseY = Math.abs((event.clientY - rect.top) * scaleY);
}

//INPUT
document.addEventListener("keydown", event => {
    //Player 1
    
    //Up
    if (event.keyCode == 87) {
        player1.goUp = true;
    }
    
    //Down
    if (event.keyCode == 83) {
        player1.goDown = true;
    }
    
    
    //Player 2
    
    //Up
    if (event.keyCode == 38) {
       player2.goUp = true;
    }
    
    //Down
    if (event.keyCode == 40) {
       player2.goDown = true;
    }
    
    if (GameMode1) {
        //Up
        if (event.keyCode == 38) {
           player1.goUp = true;
        }

        //Down
        if (event.keyCode == 40) {
           player1.goDown = true;
        }
    }
    
});

document.addEventListener("keyup", event => {
   
    //Player 1
    
    //Up
    if (event.keyCode == 87) {
        player1.goUp = false;
    }
    
    //Down
    if (event.keyCode == 83) {
        player1.goDown = false;
    }
    
    
    //Player 2
    
    //Up
    if (event.keyCode == 38) {
       player2.goUp = false;
    }
    
    //Down
    if (event.keyCode == 40) {
       player2.goDown = false;
    }
    
    
    if (GameMode1) {
        //Up
        if (event.keyCode == 38) {
           player1.goUp = false;
        }

        //Down
        if (event.keyCode == 40) {
           player1.goDown = false;
        }
    }
});

document.addEventListener("click", event => {
   //button 1
    
    if (!StartGame) {
        if (MouseX >= 1270 && MouseX <= 1920 && MouseY >= 0 && MouseY <= c.height / 2) {
            GameMode1 = true;
            title = false;
            buttons = false;
            StartGame = true;
            ThrowBallInRandomDirectionStart();
        }

        
        //easy
        if (MouseX >= 0 && MouseX <= 216.666667 && MouseY >= c.height - 300 && MouseY <= 1075) {
            dificulty = 1;
        }
        
        //med
        if (MouseX >= 216.666667 && MouseX <= 433.333334 && MouseY >= c.height - 300 && MouseY <= 1075) {
            dificulty = 2;
        }

        //Hard
        if (MouseX >= 433.333334 && MouseX <= 650.000001 && MouseY >= c.height - 300 && MouseY <= 1075) {
            dificulty = 3;
        }
        
        //button 2
        if (MouseX >= 1270 && MouseX <= 1920 && MouseY >= c.height / 2 && MouseY <= 1080) {
            GameMode1 = false;
            title = false;
            buttons = false;
            StartGame = true;
            ThrowBallInRandomDirectionStart();
        }
    }
    
    
    if (gameover2) {
        if (MouseX >= 660 && MouseX <= 1255 &&
        MouseY >= 540 && MouseY <= 840) {
        
            location.reload();
        }
    }
    
});


update();