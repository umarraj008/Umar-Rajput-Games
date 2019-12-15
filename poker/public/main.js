const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
ctx.scale(1,1);
let lastTime = 0;

var players = [];
var rooms = [];


// DRAW
function draw() {
    //base
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);
    
}

//UPDATE
function update(time = 0) {
    dt = time - lastTime;
    lastTime = time;
    
        
    
    draw();
    requestAnimationFrame(update);
}


// INPUT
document.onmousemove = handleMouseMove;
var MouseX;
var MouseY;
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

document.addEventListener("keydown", event => {
    
    
});

document.addEventListener("keyup", event => {
   
      
});

document.addEventListener("click", event => {
    
});

update();