const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;
let dt;
var state = 0;
var mouseX;
var mouseY;
const splashScreen = new SplashScreen(ctx, c.width, c.height);
var game;
var buttons = {};
var parts = [];
var parts2 = [];
var partsAmmount = 300;
var play = new Button(ctx);
var quit = new Button(ctx);
var oneplayer = new Button(ctx);
var twoplayer = new Button(ctx);
var backButton = new Button(ctx);

class part {
    constructor(m) {
        this.x = this.getRand(0, c.width);
        this.y = this.getRand(0, c.height);
        this.vy = this.getRand(5, 20);
        this.type = String("xo").charAt(this.getRand(0, 2));
    
        if (m == 2) {
            if (this.type == "x") {
                this.x = this.getRand(c.width/2+20, c.width);
            } else {
                this.x = this.getRand(0,c.width/2-50);
            }
        }
    }
    
    getRand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
}

splashScreen.isEnded = false; //////////DEBUG
function startup() {
    var script = document.createElement("script")
    script.src= "Game.js";
    document.getElementsByTagName("body")[0].append(script);
    resizeWindow();
    buttonSetup();
    update();
    
    for (var i = 0; i < partsAmmount; i++) {
        parts.push(new part(1));
        parts2.push(new part(2));
    }
}

function draw() {
    switch(state) {
        case 0:
            menuDraw();
            break;

       case 1:
            selectionDraw();
           break;
            
       case 2:
            game.draw();
           break;
    }
}

function menuDraw() {
    //base
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);
    
    //x and o back
    for (let i = 0; i < parts.length; i++) {
        //draw
        if (parts[i].type == "x") {
            ctx.fillStyle = "red";
        } else if (parts[i].type == "o") {
            ctx.fillStyle = "#29adff";
        }
        ctx.font = "30px Raleway";
        ctx.fillText(parts[i].type, parts[i].x, parts[i].y);
        
        
        //move
        parts[i].y += (parts[i].vy/100) * dt;
        
        //move back up
        if (parts[i].y > c.height+10) {
            parts[i].y = 0;
            parts[i].x = parts[i].x = parts[i].getRand(0, c.width);
        }
    }
    
    //title
    ctx.font = "140px Raleway";
    ctx.textAlign = "center";
    
    //ctx.fillStyle = "lime";
    //ctx.fillText("X and O", c.width/2, c.height/2 - 100);    
    
    ctx.fillStyle = "red";
    ctx.fillText("X", c.width/2-209, c.height/2 - 20);
    
    ctx.fillStyle = "black";
    ctx.fillText("and", c.width/2-9, c.height/2 - 20);
    
    ctx.fillStyle = "#29adff";
    ctx.fillText("O", c.width/2+200, c.height/2 - 20);
    
    
    //buttons
    buttons.play.draw(mouseX, mouseY);
    buttons.quit.draw(mouseX, mouseY);
}

function selectionDraw() {
    //base
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,c.width, c.height);
    
    //x and o back
    for (let i = 0; i < parts2.length; i++) {
        //draw
        if (parts2[i].type == "x") {
            ctx.fillStyle = "red";
        } else if (parts2[i].type == "o") {
            ctx.fillStyle = "#29adff";
        }
        ctx.font = "30px Raleway";
        ctx.fillText(parts2[i].type, parts2[i].x, parts2[i].y);
        
        //move
        parts2[i].y += (parts2[i].vy/100) * dt;
        
        //move back up
        if (parts2[i].y > c.height+10) {
            parts2[i].y = 0;
            if (parts2[i].type == "x") {
                parts2[i].x = parts2[i].x = parts2[i].getRand(c.width/2, c.width);
            } else {
                parts2[i].x = parts2[i].x = parts2[i].getRand(0, c.width/2);
            }
        }
    }
    
    //color overlays
    ctx.fillStyle = "rgba(41, 173, 255,0.5)";
    ctx.fillRect(0,0,c.width/2, c.height);
    
    ctx.fillStyle = "rgba(255,0,0,0.5)";
    ctx.fillRect(c.width/2, 0, c.width/2, c.height);

    
    var g = ctx.createLinearGradient(0,0,c.width,0);
    g.addColorStop(0, "rgba(41, 173, 255,1)");
    g.addColorStop(0.25, "rgba(0,0,0,0)");
    g.addColorStop(0.5, "rgba(41, 173, 255,1)");
    
    g.addColorStop(0.5, "rgba(255,0,0,1)");
    g.addColorStop(0.75, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(255,0,0,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,c.width, c.height);
    
    //title
    ctx.fillStyle = "black";
    ctx.font = "140px Raleway";
    ctx.fillText("Select Gamemode", c.width/2, c.height/2-100);
    
    //description text
    ctx.fillStyle = "black";
    ctx.font = "30px Raleway";
    ctx.textAlign = "center";
    ctx.fillText("Play against the computer!", c.width/4, c.height/2+250);
    ctx.fillText("Play against a friend!", c.width*0.75, c.height/2+250);
    
    //buttons
    buttons.oneplayer.draw(mouseX, mouseY);
    buttons.twoplayer.draw(mouseX, mouseY);
    buttons.backButton.draw(mouseX, mouseY);
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    
    if (!splashScreen.isEnded) {
        splashScreen.draw(dt);
    } else {
        draw();
    }
    requestAnimationFrame(update);
}

function buttonSetup() {
    play.setBackground("#29adff");
    play.setHighlight("#80ceff");
    play.setOutline("#095d99");
    play.setOutlineWidth("4");
    play.setText("Play");
    play.setPos(c.width/2-250, c.height/2);
    play.setDimentions(500, 80);

    quit.setBackground("red");
    quit.setHighlight("#ff8080");
    quit.setOutline("#990909");
    quit.setOutlineWidth("4");
    quit.setText("Quit");
    quit.setPos(c.width/2-250, c.height/2+100);
    quit.setDimentions(500, 80);

    oneplayer.setBackground("#29adff");
    oneplayer.setHighlight("#80ceff");
    oneplayer.setOutline("#095d99");
    oneplayer.setOutlineWidth("4");
    oneplayer.setText("1 Player");
    oneplayer.setPos(c.width/4-200, c.height/2);
    oneplayer.setDimentions(400, 200);
    
    twoplayer.setBackground("red");
    twoplayer.setHighlight("#ff8080");
    twoplayer.setOutline("#990909");
    twoplayer.setOutlineWidth("4");
    twoplayer.setText("2 Player");
    twoplayer.setPos((c.width-(c.width/4)-200), c.height/2);
    twoplayer.setDimentions(400, 200);
    
    backButton.setBackground("rgba(255, 255, 255 , 0.5)");
    backButton.setHighlight("rgba(255,255,255,0.75)");
    backButton.setOutline("black");
    backButton.setOutlineWidth("4");
    backButton.setText("Back");
    backButton.setPos(c.width/2-200, c.height/2);
    backButton.setDimentions(400, 200);
    
    buttons.play = play;
    buttons.quit = quit;
    buttons.oneplayer = oneplayer;
    buttons.twoplayer = twoplayer;
    buttons.backButton = backButton;
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
    
    if (state == 1) {
        if (e.keyCode == "66") {
            game = new Game(ctx, c, 3);
            state = 2;
        } else if (e.keyCode == "78") {
            game = new Game(ctx, c, 4);
            state = 2;
        }
    } if (state == 2) {
        if (e.keyCode == "13") {
            game.canContinue = true;
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
            if (buttons.play.clicked(mouseX, mouseY)) {
                state = 1;
            } else if (buttons.quit.clicked(mouseX, mouseY)) {
                location.href = "../../index.html";
            }
            break;
            
        case 1:
            if (buttons.oneplayer.clicked(mouseX, mouseY)) {
                game = new Game(ctx, c, 1);
                state = 2;
            } else if (buttons.twoplayer.clicked(mouseX, mouseY)) {
                game = new Game(ctx, c, 2);
                state = 2;
            } else if (buttons.backButton.clicked(mouseX, mouseY)) {
                state = 0;
            } 
            break;
            
        case 2:
            //player moves
            
            if (game.player1turn && !game.gameOver) { //player1
                let spot = game.findSpotClicked(c.width/2, c.height/2);
                if (spot != undefined && game.board[spot.y][spot.x] == 0) {
                    game.board[spot.y][spot.x] = "o";
                    game.player1turn = false;
                    game.checkBoard();
                    game.turnCount++;
                }
                break;
                
            } else if (!game.player1turn && game.gameMode == 2 && !game.gameOver) { //player2
                let spot = game.findSpotClicked(c.width/2, c.height/2);
                if (spot != undefined && game.board[spot.y][spot.x] == 0) {
                    game.board[spot.y][spot.x] = "x";
                    game.player1turn = true;
                    game.checkBoard();
                }
                break;
            }
            
            if (game.gameOver) {
                if (game.restartButton.clicked(mouseX, mouseY)) {
                    game = new Game(ctx, c, game.gameMode);
                } else if (game.btmButton.clicked(mouseX, mouseY)) {
                    state = 1;
                }
            }
            
            break;
    }
}

startup();