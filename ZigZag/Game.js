class Game {
    constructor() {
        this.map = [0,0,0,0,0];
        this.tileSize = 70;
        this.mapOffset = 200;
        this.speed = .5;
        this.mapSetup();
        this.ball = new Ball(c.width/2+this.map[0]+-this.tileSize, c.height/2+this.map[0]+this.mapOffset-this.tileSize/2);
        this.start = false;
        this.timer = 0;
        this.counter = 0;
        this.dead = false;
        this.tileHeight = 400;
    }

    mapSetup() {
        for(let i = 0; i < 100; i++) {
            let val = (Math.random() * 10 > 5) ? 1 : 0;
            this.map.push(val);
        }
    }

    drawMap() {
        let xO = 0, yO = 0;

        if (c.height/2 - this.tileSize + this.mapOffset > c.height) {
            //this.map.splice(0, 1);
            let val = (Math.random() * 10 > 5) ? 1 : 0;
            this.map.push(val);
            //this.mapOffset-=this.tileSize/2;
        }

        this.drawRect(-this.tileSize,-this.tileSize/2 + this.mapOffset);
        for (let i = 0; i < this.map.length; i++) {
            if (this.map[i] == 0) {
                xO-=this.tileSize;
                yO-=this.tileSize/2;
            } else {
                yO-=this.tileSize/2;
                xO+=this.tileSize;
            }         

            if (xO + c.width/2 + this.tileSize < 0 || xO + c.width/2 - this.tileSize > c.width ||
                yO + c.height/2 + this.tileSize/2 + this.mapOffset < 0 || yO + c.height/2 - this.tileSize/2 + this.mapOffset > c.height-0) {
                continue;
            } else {
                this.drawRect(xO,yO + this.mapOffset);
            }
        }
    }

    update() {
        ctx.clearRect(0,0,c.width,c.height);
        if (this.start && !this.dead) {
            this.mapOffset += this.speed;
            this.ball.move(this.speed);
            this.counter += dt;
            
            if (this.counter >= 1000) {
                this.counter = 0;
                this.timer++;
                this.speed+=0.01;
            }
        }
        
        this.drawMap();
        this.ball.draw();

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "200px Arial";
        ctx.fillText(this.timer, c.width/2, 200);
    }

    drawRect(x,y) {
        // //left
        // ctx.strokeStyle = "#00afc9";
        // ctx.beginPath();
        // ctx.moveTo(c.width/2+x+-this.tileSize, 0+c.height/2+y);
        // ctx.lineTo(c.width/2+x+0,this.tileSize/2+c.height/2+y);
        // ctx.lineTo(c.width/2+x+0,this.tileSize/2+c.height/2+y+this.tileHeight);
        // ctx.lineTo(c.width/2+x+-this.tileSize, 0+c.height/2+y+this.tileHeight);
        // ctx.stroke();
        
        // //right
        // ctx.strokeStyle = "#008396";
        // ctx.beginPath();        
        // ctx.moveTo(c.width/2+x+0,this.tileSize/2+c.height/2+y);
        // ctx.lineTo(c.width/2+x+this.tileSize,0+c.height/2+y);
        // ctx.lineTo(c.width/2+x+this.tileSize,0+c.height/2+y+this.tileHeight);
        // ctx.lineTo(c.width/2+x+0,this.tileSize/2+c.height/2+y+this.tileHeight);
        // ctx.stroke();
        
        //top
        ctx.fillStyle = "#03dbfc";
        ctx.beginPath();
        ctx.moveTo(c.width/2+x+-this.tileSize, 0+c.height/2+y);
        ctx.lineTo(c.width/2+x+0,-this.tileSize/2+c.height/2+y);
        ctx.lineTo(c.width/2+x+this.tileSize,0+c.height/2+y);
        ctx.lineTo(c.width/2+x+0,this.tileSize/2+c.height/2+y);
        ctx.fill();
    }
}