class Ball {
    constructor(x, y) {
        this.size = 25;
        this.x = x;
        this.y = y;
        this.moveLeft = false;
    }

    draw() {
        ctx.fillStyle = "black";
        //ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);

        //BOTTOM
        // ctx.beginPath();
        // ctx.moveTo(this.x - this.size, this.y);
        // ctx.lineTo(this.x, this.y - this.size/2);
        // ctx.lineTo(this.x + this.size, this.y);
        // ctx.lineTo(this.x, this.y + this.size/2);
        // ctx.fill();

        //LEFT
        ctx.fillStyle = "rgb(30,30,30)";
        ctx.beginPath();
        ctx.moveTo(this.x - this.size, this.y);
        ctx.lineTo(this.x - this.size, this.y - this.size);
        ctx.lineTo(this.x, this.y - this.size/2);
        ctx.lineTo(this.x, this.y + this.size/2);
        ctx.fill();

        //TOP
        ctx.fillStyle = "rgb(50,50,50)";
        ctx.beginPath();
        ctx.moveTo(this.x - this.size, this.y - this.size);
        ctx.lineTo(this.x, this.y - this.size*1.5);
        ctx.lineTo(this.x + this.size, this.y - this.size);
        ctx.lineTo(this.x, this.y - this.size/2);
        ctx.fill();

        //RIGHT
        ctx.fillStyle = "rgb(20,20,20)";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y-this.size/2);
        ctx.lineTo(this.x + this.size, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size/2);
        ctx.fill();
    }

    move(speed) {
        if (this.moveLeft) {
            this.x -= speed*2;
        } else {
            this.x += speed*2;
        }
    }

    turn() {
        this.moveLeft = !this.moveLeft;
    }
}