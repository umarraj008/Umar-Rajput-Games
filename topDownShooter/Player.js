class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.left = false;
        this.righ = false;
        this.up = false;
        this.down = false;
        this.angle = 0;
        this.fireCounter = 0;
        this.showFireLine = false;
        
        //player properties
        this.speed = 5;
        this.health = 100;
        this.sight = 0;
        
        //gun properties
        this.damage = 10;
        this.range = 800;
        this.rate = 100;
    }
    
    draw() {
        //body
        ctx.fillStyle = "lime";
        ctx.fillRect(c.width/2-25,c.height/2-25, 50, 50);
        
    }
    
    move() {
        if (this.left) {
            this.x+= this.speed;
            game.worldOffX += this.speed;
        }

        if (this.right) {
            this.x-= this.speed;
            game.worldOffX -= this.speed;
        }

        if (this.up) {
            this.y+= this.speed;
            game.worldOffY += this.speed;
        }

        if (this.down) {
            this.y-= this.speed;
            game.worldOffY -= this.speed;
        }
        
        this.angle = Math.atan2((c.height/2)-mouseY,(c.width/2)-mouseX);
    }
}