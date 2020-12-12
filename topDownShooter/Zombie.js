class Zombie {
    constructor() {
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.w = 64;
        this.h = 64;
        this.health = 100;
        this.healthBarCounter = 0;
        this.showHealthBar = false;
        
        this.imageWidth = 128;
        this.animState = 0;
        this.animations = {
            walk: [
                {x: 0,       y: 0},
                {x: 128 * 1, y: 0},
                {x: 128 * 2, y: 0},
                {x: 128 * 3, y: 0},
                {x: 128 * 4, y: 0},
                {x: 128 * 5, y: 0},
                {x: 128 * 6, y: 0},
                {x: 128 * 7, y: 0},
                {x: 128 * 8, y: 0},
                
                {x: 0,       y: 128},
                {x: 128 * 1, y: 128},
                {x: 128 * 2, y: 128},
                {x: 128 * 3, y: 128},
                {x: 128 * 4, y: 128},
                {x: 128 * 5, y: 128},
                {x: 128 * 6, y: 128},
                {x: 128 * 7, y: 128},
                {x: 128 * 8, y: 128},
                
                {x: 0,       y: 128 * 2},
                {x: 128 * 1, y: 128 * 2},
                {x: 128 * 2, y: 128 * 2},
                {x: 128 * 3, y: 128 * 2},
                {x: 128 * 4, y: 128 * 2},
                {x: 128 * 5, y: 128 * 2},
                {x: 128 * 6, y: 128 * 2},
                {x: 128 * 7, y: 128 * 2},
                {x: 128 * 8, y: 128 * 2},
                
                {x: 0,       y: 128 * 3},
                {x: 128 * 1, y: 128 * 3},
                {x: 128 * 2, y: 128 * 3},
            ],
            
            attack: [],
        }
        this.frameCounter = 1;
        this.counter = 0;
        this.animationSpeed = 100;
        this.angle = 0;
    }
    
    draw(ox, oy) {
        //body
        //ctx.fillStyle = "red";
        //ctx.fillRect(this.x-this.w/2 + ox, this.y-this.h/2 + oy, this.w, this.h);
        //1152/9 = 128
        //1024/8 = 128
        
        //move
        if (this.x <= c.width/2 - ox) {
            this.x += 0.1;
        }
        
        if (this.x >= c.width/2 - ox) {
            this.x -= 0.1;
        }

        if (this.y <= c.height/2 - oy) {
            this.y += 0.1;
        }
        
        if (this.y >= c.height/2 - oy) {
            this.y -= 0.1;
        }
        
        //angle 
        this.angle = Math.atan2((this.y + oy)-c.height/2,(this.x + ox)-c.width/2);
        this.angle = this.angle + (270 * Math.PI/180);
        
        //draw image
        if (this.animState == 0) {
            ctx.save();
            ctx.translate(this.x + ox, this.y + oy);
            ctx.rotate(this.angle);
            ctx.drawImage(game.images.zombie, 
                          this.animations.walk[this.frameCounter].x, this.animations.walk[this.frameCounter].y, 128, 128, 
                          -this.imageWidth/2, -this.imageWidth/2, this.imageWidth, this.imageWidth)
            ctx.restore();
        }
        
        //animation counter
        this.counter += dt;
        if (this.counter >= this.animationSpeed) {
            this.counter = 0;
            
            this.frameCounter++;
            
            if (this.frameCounter >= this.animations.walk.length-1) {
                this.frameCounter = 0;
            }

        }
        //healthbar
        if (this.showHealthBar) {
            this.healthBarCounter += dt;
            
            if (this.healthBarCounter > 5000) {
                this.showHealthBar = false;
            }
        } else {
            this.healthBarCounter = 0;
        }
        
        if (this.showHealthBar) {
            //white
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+ox-this.w/2, this.y+oy-this.h/2-20, this.w, 10);
            
            //midle
            ctx.fillStyle = (this.health >= 50) ? "lime" : (this.health < 30) ? "red" : "orange";
            ctx.fillRect(this.x+ox-this.w/2+2, this.y+oy-this.h/2-20+2, (this.w-4)*(this.health/100), 10-4);
        }
    }
}