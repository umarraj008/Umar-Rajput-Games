class Menu {
    constructor() {

    }

    draw() {
        ctx.clearRect(0,0,c.width,c.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,c.width,c.height);

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "200px Arial";
        ctx.fillText("Zig Zag", c.width/2, 200);
    }
}