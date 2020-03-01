const c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var lastTime;
var dt;

var state = "menu";
var buttons = {
    player: {x: (c.width / 2) - 300, y: (c.height / 2) - 50, w: 200, h: 100, over: false, color: "white", highcolor: "rgba(255, 255,255,0.4)", text: {string: "Play", color: "white", size: "50px", xOff: 0, yOff: 20}},
    
    call: {x: 20, y: (c.height / 2) - 50, w: 200, h: 100, over: false, color: "white", highcolor: "rgba(255, 255,255,0.4)", text: {string: "Call", color: "white", size: "50px", xOff: 0, yOff: 20}},
    
};
var img = {
    tblImg: document.getElementById("tblImg"),
    pokertableImg: document.getElementById("pokertable"),
}

var players = [];
var me = {};

function drawMenu() {
    //background image
    ctx.drawImage(img.tblImg, 0, 0, c.width, c.height);
    
    //table
    ctx.drawImage(img.pokertableImg, c.width / 2 - 750, c.height / 2 - 375, 1500, 750);
    
    drawBorderButton(buttons.player);
     
}

function drawLobby() {
    //background image
    ctx.drawImage(img.tblImg, 0, 0, c.width, c.height);
    
    //table
    ctx.drawImage(img.pokertableImg, c.width / 2 - 750, c.height / 2 - 375, 1500, 750);
    
    //Table cards 
    if (me.dHand != null) {
        var tx = 0;
        for (i = 0; i < me.dHand.length; i++) {
            tx += 300


            if (i < me.showCards) {
                ctx.fillStyle = "red";
                ctx.fillRect(tx,200, 200,400);
                
                ctx.textAlign = "center";
                ctx.font = "30px arial";
                ctx.fillStyle = "white";
                ctx.fillText(me.dHand[i].Value + " " + me.dHand[i].Suit, tx + 100, 400);

            } else {
                ctx.fillStyle = "blue";
                ctx.fillRect(tx,200, 200,400);

            }
        }
    }
        
    //draw hand
    if (me.hand.h1 != null && me.hand.h2 != null) {
        ctx.fillStyle = "red";
        ctx.fillRect(c.width / 2 - 250,600, 200,400);

        ctx.textAlign = "center";
        ctx.font = "30px arial";
        ctx.fillStyle = "white";
        ctx.fillText(me.hand.h1.Value + " " + me.hand.h1.Suit, c.width / 2 - 250 + 100, 800);

        ctx.fillStyle = "red";
        ctx.fillRect(c.width / 2 + 50,600, 200,400);

        ctx.textAlign = "center";
        ctx.font = "30px arial";
        ctx.fillStyle = "white";
        ctx.fillText(me.hand.h2.Value + " " + me.hand.h2.Suit, c.width / 2 + 50 + 100, 800);


    }
        
    
    //call button
    drawBorderButton(buttons.call);
}

function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;

    switch(state) {
        case "menu":
            drawMenu();
            break;
            
        case "lobby":
            drawLobby();
            break;
            
    }
    
    requestAnimationFrame(update);
}

function start_game() {
    socket.emit("start-game");
}

function call() {
    socket.emit("called");
}

function fold() {
    socket.emit("fold");
}

function raise(amm) {
    socket.emit("raise", amm);
}


//BUTTON HANDELERS
function drawButton(b) {
    if (b.highlight) {
        ctx.fillStyle = b.highcolor;
    } else {
        ctx.fillStyle = b.color;
    }
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = b.text.color;
    ctx.textAlign = "center"
    ctx.font = "300 " + b.text.size + " roboto"
    ctx.fillText(b.text.string, b.x + (b.w / 2) + b.text.xOff, b.y + (b.h / 2) + b.text.yOff);
}
function drawBorderButton(b) {
    if (b.highlight) {
        ctx.fillStyle = b.highcolor;
        ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = b.text.color;
    ctx.textAlign = "center"
    ctx.font = "300 " + b.text.size + " roboto"
    ctx.fillText(b.text.string, b.x + (b.w / 2) + b.text.xOff, b.y + (b.h / 2) + b.text.yOff);
}
function buttonHighlight(b, mx, my) {
    if (mx > b.x &&
        mx < b.x + b.w &&
        my > b.y &&
        my < b.y + b.h) {
        b.highlight = true;
    } else {
        b.highlight = false;
    }
}
function buttonClick(b, mx, my) {
    if (b.x < mx &&
        b.x + b.w > mx &&
        b.y < my &&
        b.y + b.h > my) {
        return true
    } else {
        return false;
    }
}
/////////////////


var mouse = {x: 0, y: 0};
document.onmousemove = function(event) {

	event = event || window.event; // IE-ism
    
	//MouseX = event.pageX;
	//MouseY = event.pageY;
    
    var rect = canvas.getBoundingClientRect()
    
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
    
    mouse.x = Math.abs((event.clientX - rect.left) * scaleX);
    mouse.y = Math.abs((event.clientY - rect.top) * scaleY);
    
    switch(state) {
        case "menu":
            buttonHighlight(buttons.player, mouse.x, mouse.y);
            break;
        
        
        case "lobby":
            buttonHighlight(buttons.call, mouse.x, mouse.y);
            break;
    }
    
}

document.addEventListener("keydown", event => {
    
    
});

document.addEventListener("keyup", event => {
   
      
});

document.addEventListener("click", event => {
    
    switch(state) {
        case "menu":
            if (buttonClick(buttons.player, mouse.x, mouse.y)) {
                socket.emit("new-player");
            }
            break;
        
        case "lobby":
            if (buttonClick(buttons.call, mouse.x, mouse.y)) {
                call();
            }
            break;
    }
    
});

update();