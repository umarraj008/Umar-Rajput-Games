var button1 = document.getElementById("button_play1");
var button2 = document.getElementById("button_play2");
var button3 = document.getElementById("button_play3");
var container = document.getElementById("menu_container");
var game = document.getElementById("game");
var title = document.getElementById("menu_title");


var timer = 0;
let countdownTimer = 0;
var clickable = false;
var clicks = 0;
var addGameElements = true;
var buttonEnabled = true;
var buttonEnabled2 = true;
var up = true;
var clicksPerMin = [];

function Reload() {
    var b = document.getElementById("playAgain");
    b.style.borderColor = "transparent";
    b.style.color = "transparent";
    b.style.transision = "0s";
    
    game.removeChild(b);
    game.removeChild(document.getElementById("score"));
    
    
    menu(false, 0);
    window.setTimeout(() => {
        location.reload();
    }, 500);
    
}

function StartGame(time) {
    timer = time;
    
    let h1 = document.createElement("h1");
    h1.setAttribute("id", "countdown");
    h1.innerHTML = "3";
    game.appendChild(h1);
    var countdownText = document.getElementById("countdown");
    countdownText.style.fontFamily = "roboto";
    countdownText.style.fontSize = "200px";
    countdownText.style.textAlign = "center";
    countdownText.style.transform = "translateY(150%)";
    
    //play again button
    let button = document.createElement("button");
    button.setAttribute("id", "playAgain");
    button.setAttribute("class", "button");
    button.innerHTML = "Play Again";
    game.appendChild(button);
    var playAgain = document.getElementById("playAgain");
    playAgain.style.transform = "translate(165%, 1000%)";

    var loop = window.setInterval(() => {
        
        
        countdownTimer+=5;
        
        if (countdownTimer >= 1000 && countdownTimer < 2000) {
            countdownText.innerHTML = "2"
            
        } else if (countdownTimer >= 2000 && countdownTimer < 3000) {
            countdownText.innerHTML = "1"
            
        }else if (countdownTimer > 3000) {            
            if(document.getElementById("countdown") != null) {
                game.removeChild(countdownText);
            }
            
            timer-=5;
            clickable = true;
            
            if (addGameElements) {
                //timer
                let h1 = document.createElement("h1");
                h1.setAttribute("id", "timerText");
                h1.innerHTML = timer / 1000 + "s";
                game.appendChild(h1);
                var timerText = document.getElementById("timerText");
                timerText.style.fontFamily = "roboto";
                timerText.style.fontSize = "80px";
                timerText.style.transform = "translate(40%,50%)";
                
                //score
                let h12 = document.createElement("h1");
                h12.setAttribute("id", "score");
                h12.innerHTML = "0";
                game.appendChild(h12);
                var score = document.getElementById("score");
                score.style.fontFamily = "roboto";
                score.style.textAlign = "center";
                score.style.fontSize = "600px";
                score.style.transform = "translateY(-5%)";
                
                addGameElements = false;
            }
            let tmTxt = document.getElementById("timerText");
            tmTxt.innerHTML = timer / 1000 + "s";
            
            
            let scoreTxt = document.getElementById("score");
            scoreTxt.innerHTML = clicks;
            
            //GAME OVER
            if (timer <= 0) {
                tmTxt.style.transform = "translate(-0%,150%)";
                tmTxt.style.textAlign = "center";
                
                window.clearInterval(loop);
                game.removeChild(tmTxt);
                playAgain.style.transform = "translate(165%, 800%)";
                clickable = false;
                
                //play again
                playAgain.addEventListener("click", e => {
                    if (buttonEnabled2) {
                        buttonEnabled2 = false;
                        Reload();
                    }

                });
            }
        }
    }, 1);
}


function menu(on, t) {
    button1.style.transition = "0.4s ease-in";
    button2.style.transition = "0.4s ease-in 0.05s";
    button3.style.transition = "0.4s ease-in 0.1s";
    
    if (on) {
        button1.style.transform = "translateY(500px)";
        button2.style.transform = "translateY(500px)";
        button3.style.transform = "translateY(500px)";
        
        title.style.transform = "translateY(-310px)";
        window.setTimeout(() => {
            title.style.fontSize = "150px";
        }, 0.4);
        
        window.setTimeout(() => {
            StartGame(t);
        }, 500);
    } else {
        button1.style.transform = "translateY(-0px)";
        button2.style.transform = "translateY(-0px)";
        button3.style.transform = "translateY(-0px)";
        
        title.style.transform = "translateY(-0px)";
        window.setTimeout(() => {
            title.style.fontSize = "100px";
        }, 0.4); 
    }
}


//10 seconds button
button1.addEventListener("click", e => {
    if (buttonEnabled) {
        buttonEnabled = false;
        menu(true, 10000)
    }
});

//20 seconds button
button2.addEventListener("click", e => {
    if (buttonEnabled) {
        buttonEnabled = false;
        menu(true, 20000)
    }
    
});

//30 seconds button
button3.addEventListener("click", e => {
    if (buttonEnabled) {
        buttonEnabled = false;
        menu(true, 30000)
    }
    
});

var Mouse = {x: 0, y: 0};
document.onmousemove = function(e) {

	event = event || window.event;
	MouseX = event.pageX;
	MouseY = event.pageY;    
    
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
    
}

document.addEventListener("keydown", e => {
    if (e.keyCode == 32) {
        if (clickable && up) {
            //clicks++;
        }
    }
    
});

document.addEventListener("keyup", e => {
      if (e.keyCode == 32) {
         //up = false; 
      } else {
          //up = true;
      }
});

document.addEventListener("click", event => {
    if (clickable) {
        clicks++;
    }
});
