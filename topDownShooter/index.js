const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

let lastTime = 0;
var mouseX, mouseY, dt;
var splashScreen = new SplashScreen(ctx, c.width, c.height);
var game;

function startup() {
    resizeWindow();
    splashScreen.isEnded = false;
    game = new Game();
    update();
}

function update(time = 0) {
    requestAnimationFrame(update);
    
    dt = time - lastTime;
    lastTime = time;
    
    if (!splashScreen.isEnded) {
        splashScreen.draw(dt);
    } else {
        game.logic();
        game.draw();
    }
    
    //ctx.drawImage(cache, 0, 0);
    //request animation frame first
    //create canvas element for double buffer, dont add to dom
    //draw double buffer first
    //draw using integers and non floating point values
    //logic first then draw
    
}

document.onmousemove = handleMouseMove; 
function handleMouseMove(event) {
	event = event || window.event; // IE-ism
    var rect = canvas.getBoundingClientRect()
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
    mouseX = Math.abs((event.clientX - rect.left) * scaleX);
    mouseY = Math.abs((event.clientY - rect.top) * scaleY);
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
    
    if (e.keyCode == 37 || e.keyCode == 65) {
        game.player.left = true;
    } else if (e.keyCode == 39 || e.keyCode == 68) {
        game.player.right = true;
    } else if (e.keyCode == 38 || e.keyCode == 87) {
        game.player.up = true;
    } else if (e.keyCode == 40 || e.keyCode == 83) {
        game.player.down = true;
    }
}

window.onkeyup = function(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
        game.player.left = false;
    } else if (e.keyCode == 39 || e.keyCode == 68) {
        game.player.right = false;
    } else if (e.keyCode == 38 || e.keyCode == 87) {
        game.player.up = false;
    } else if (e.keyCode == 40 || e.keyCode == 83) {
        game.player.down = false;
    }
}

window.onmousedown = function() { game.playerShoot = true; }
window.onmouseup = function() { game.playerShoot = false; }

startup();
