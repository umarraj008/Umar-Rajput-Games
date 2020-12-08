class Game {
    constructor() {
        this.ty = c.height;
        this.pipes = [];
        this.transitionOver = false;
        this.speed = 0.2;
        this.score = 0;
        this.pipeMaxGap = 700;
        this.pipeMaxHight = 900;
        this.ai = true;
        this.birdInd = 0;
        this.bird = {
            x: c.width/2-200,
            y: c.height/2,
        };
        
        for (let i = 0; i < 10; i++) {
            if (i == 0) {
                this.pipes.push({x: c.width, y: c.height/2, canScore: true});
            } else {
                this.pipes.push({x: this.pipes[i-1].x + this.rand(300, this.pipeMaxGap), y: c.height/2 - (this.rand(-300, 300)), h: this.rand(200, this.pipeMaxHight), canScore: true});
            }
        }
    }
    
    draw() {
        //sky
        let gg = ctx.createLinearGradient(0,0,0,c.height);
        gg.addColorStop(0, "#73d6fa");
        gg.addColorStop(1, "#096485");
        ctx.fillStyle = gg;
        ctx.fillRect(0,0,c.width,c.height);
        
        
        //pipes
        for (let i = 0; i < this.pipes.length; i++) {
            //draw
            ctx.fillStyle = "red";
            //ctx.fillRect(this.pipes[i].x, this.pipes[i].y - this.pipes[i].h/2, 100, this.pipes[i].h);
            
            ctx.fillStyle = "orange";
            ctx.fillRect(this.pipes[i].x, this.pipes[i].y - this.pipes[i].h/2, 100, -this.pipes[i].y);
            ctx.fillRect(this.pipes[i].x, this.pipes[i].y + this.pipes[i].h/2, 100, c.height - this.pipes[i].y + this.pipes[i].h/2);
            
            //move
            this.pipes[i].x -= Math.floor(this.speed * dt);
            
            //scoring
            if (this.pipes[i].x <= this.bird.x && this.pipes[i].canScore) {
                this.score++;
                this.pipes[i].canScore = false;
                this.birdInd = i+1;
                if (i+1 > this.pipes.length-1) {
                    this.birdInd = 0;
                }
            } 
            
            //reset pos
            if (this.pipes[i].x <= 0) {
                this.pipes[i] = {x: this.findLast() + this.rand(300, this.pipeMaxGap), y: c.height/2 - (this.rand(-300, 300)), h: this.rand(200, this.pipeMaxHight), canScore: true};
                
                if (this.speed < 0.4) {
                    this.speed += 0.00001;    
                }
                
                if (this.pipeMaxGap > 400) {
                    this.pipeMaxGap -= 2;
                }
                
                if (this.pipeMaxHight > 300) {
                    this.pipeMaxHight -= 5;
                }
            }
        }
        
        //bird
        ctx.drawImage(birdImg, this.bird.x-30, this.bird.y-30, 60, 60);
        
        ctx.fillStyle = "black";
        ctx.font = "70px Raleway";
        ctx.fillText(this.score, c.width/2, 50);
        
        //transition out
        if (!this.transitionOver) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, c.width, this.ty);
        
            this.ty -= 2 * dt;

            if (this.ty <= 0) {
                this.transitionOver = true;
                this.ty = c.height;
            }        
        }
        
        //ai
        if (this.ai) {
            this.bird.y = this.pipes[this.birdInd].y;
        }
    }
    
    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    
    findLast() {
        let furthest = this.pipes[0].x;
        for(let i = 1; i < this.pipes.length; i++) {
            if (this.pipes[i].x > furthest) {
                furthest = this.pipes[i].x;
            }
        }
        
        return furthest;
    }

}