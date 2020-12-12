const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;
let dt;
var state = 0;
var mouseX;
var mouseY;
var birdImg;
const splashScreen = new SplashScreen(ctx, c.width, c.height);
var buttons = [];
var mountain = [];
let t = 0; 
var ty = 0;
var transY = c.height;
var transis = false;
let counter = 0; 
var game = new Game();
splashScreen.isEnded = false; //////////DEBUG

function startup() {
    birdImg = document.getElementById("birdImg");
    pipeImg = document.getElementById("pipeImg");
    circleNoImg = document.getElementById("circleNoImg");
    circleShadeImg = document.getElementById("circleShadeImg");
    resizeWindow();
    buttonSetup();
    update();
}

function draw() {
    switch(state) {
        case 0:
            menuDraw();
            break;

       case 1:
            transition(2);
           break;
            
       case 2:
            game.draw();
           break;
    }
}

function transition(ns) {
    ctx.fillStyle = "black";
    ctx.fillRect(0,ty, c.width, -c.height);
    
    ty += 2 * dt;
    
    if (ty >= c.height) {
        ty = 0;
        state = ns;
    }
}

function menuDraw() {
    //base
    //ctx.fillStyle = "white";
    //ctx.fillRect(0, 0, c.width, c.height);
    
    //sky
    let gg = ctx.createLinearGradient(0,0,0,c.height);
    gg.addColorStop(0, "#73d6fa");
    gg.addColorStop(1, "#096485");
    ctx.fillStyle = gg;
    ctx.fillRect(0,0,c.width,c.height);
    
    //title
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "140px Roboto";
    ctx.fillText("Flappy Bird", c.width/2, 150);
    
    
    //mountains 
    if (counter > 20) {
        counter = 0;
        mountain.push({x: c.width, y: c.width/2 + ((noise(t, 2) * 40))-400});
        t += 0.009;
    }
    counter += dt;
    
    ctx.beginPath();
    ctx.moveTo(0,c.height);
    for (let i = 0; i < mountain.length-1; i++) {
        ctx.lineTo(mountain[i].x, mountain[i].y);
        
        mountain[i].x -= 0.1 * dt;
        
        if (mountain[i].x <= 0) {
            mountain.shift();
        }
    }
    ctx.lineTo(c.width, c.height);
    
    let g = ctx.createLinearGradient(0,c.height/2-100,0,c.height);
    g.addColorStop(0, "lime");
    g.addColorStop(1, "rgb(0,50,0)");
    
    ctx.fillStyle = g;
    ctx.fill();
    
    ctx.fillStyle = g;
    if (mountain.length > 0) {
        ctx.fillRect(mountain[0].x,mountain[0].y, -mountain[0].x, mountain[0].y);
    } else {
        ctx.fillRect(0,c.height/2, c.width, c.height/2);
    }
    
    //bird
    ctx.drawImage(birdImg, c.width*0.5-300, c.height/2-300, 600,600)
    
    //dev text
    //ctx.fillStyle = "red";
    //ctx.font = "50px Roboto";
    //ctx.fillText("GAME IS IN DEVELOPMENT", c.width/2, c.height-100);
    
    //buttons
    buttons.playButton.draw(mouseX, mouseY);
    buttons.quitButton.draw(mouseX, mouseY);
    
    if (transis) {
        ctx.fillStyle ="black";
        ctx.fillRect(0,0,c.width,transY);
        
        transY -= 2 * dt;
        if (transY <= 0) {
            transis = false;
        }
    }
}

function selectionDraw() {
    //base
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,c.width, c.height);
    
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    
    if (!splashScreen.isEnded) {
        splashScreen.draw(dt);
    } else if (birdImg.complete && birdImg.naturalHeight !== 0){
        draw();
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,c.width,c.height);
        ctx.fillStyle = "white";
        ctx.fillText("Loading...", c.width/2, c.height/2);
    }
    requestAnimationFrame(update);
}

function buttonSetup() {
    let playButton = new Button(ctx);
    let quitButton = new Button(ctx);
    
    //play button
    playButton.setPos(20, c.height/2-75);
    playButton.setDimentions(300, 150);
    
    let buttonGradient = ctx.createLinearGradient(0, playButton.y, 0, playButton.y + 150);
    let buttonGradient2 = ctx.createLinearGradient(0, playButton.y + 150, 0, playButton.y);
    buttonGradient.addColorStop(0, "#34ebd2");
    buttonGradient.addColorStop(1, "#198a7a");
    buttonGradient2.addColorStop(0, "#34ebd2");
    buttonGradient2.addColorStop(1, "#198a7a");
    playButton.setBackground(buttonGradient);
    playButton.setHighlight(buttonGradient2);
    playButton.setOutline("#095d99");
    playButton.setOutlineWidth("4");
    playButton.setText("Play");
    
    //quit button
    quitButton.setPos(20, c.height/2+95);
    quitButton.setDimentions(300, 150);
    
    buttonGradient = ctx.createLinearGradient(0, quitButton.y, 0, quitButton.y + 150);
    buttonGradient2 = ctx.createLinearGradient(0, quitButton.y + 150, 0, quitButton.y);
    buttonGradient.addColorStop(0, "#34ebd2");
    buttonGradient.addColorStop(1, "#198a7a");
    buttonGradient2.addColorStop(0, "#34ebd2");
    buttonGradient2.addColorStop(1, "#198a7a");
    quitButton.setBackground(buttonGradient);
    quitButton.setHighlight(buttonGradient2);
    quitButton.setOutline("#095d99");
    quitButton.setOutlineWidth("4");
    quitButton.setText("Quit");
    
    //add buttons
    buttons.playButton = playButton;
    buttons.quitButton = quitButton;
}

function noise(x, v2) {
    return (Math.sin(v2 * x) + Math.sin(Math.PI * x));
}

window.onresize = resizeWindow; 
function resizeWindow() {
    var off = 0;
    c.style.left = 0;
    off = (window.innerWidth - c.clientWidth) / 2;
    c.style.left = off + "px";
}

window.onkeydown = function(e) {
    if (!splashScreen.isEnded && (event.keyCode == "27" || e.keyCode == "32" || e.keyCode == "13")) {
        splashScreen.isEnded = true;
    }
    
    if (state == 2) {
        if (e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 79) {
            if (!game.started) {
                game.started = true;
                if (e.keyCode == 79) {
                    game.ai = true;
                }
            }
            
            game.jump();
        }
    }
} 

window.onmousemove = function(event) {
    event = event || window.event; // IE-ism
    
    var rect = canvas.getBoundingClientRect()
    
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
    
    mouseX = Math.abs((event.clientX - rect.left) * scaleX);
    mouseY = Math.abs((event.clientY - rect.top) * scaleY);
}

window.onclick = function(e) {
    switch (state) {
        case 0:
            if (buttons.playButton.clicked(mouseX, mouseY)) {
                game = new Game();
                state = 1;
                break;
            } else if (buttons.quitButton.clicked(mouseX, mouseY)) {
                location.href = "../../index.html";
                break;
            }
            break;
            
        case 2:
            if (!game.started) {
                game.started = true;
            }
            
            if (!game.gameOver) {
                game.jump();
            }
            
            if (game.gameOver) {
                if (game.playAgainButton.clicked(mouseX, mouseY)) {
                    game.playAgain = true;
                } else if (game.menuButton.clicked(mouseX, mouseY)) {
                    game.quit = true;
                }
            }
            
            break;
    }
}

startup();