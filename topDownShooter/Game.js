class Game {
    constructor() {
        this.player = new Player();
        this.playerShoot = false;
        this.zombies = [];
        this.images = {
            dirt: this.getImage("./dirt.jpg"),    
            player: this.getImage("./player.png"),
            zombie: this.getImage("./zombie.png"),
        };
        this.worldOffX = 0;
        this.worldOffY = 0;
        
        //DEBUG
        this.x2;
        this.y2;
        this.showShootingRange = false;
        this.temp = [];
        
        this.zombieAmmount = 100;
        for (let i = 0; i < this.zombieAmmount; i++) {
            this.zombies.push(new Zombie());
        }
        
        c.style.cursor = "none";
    }
    
    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,c.width,c.height);
        
        //ground/////////////////////////////
        let rows = c.height / 600;
        let colls = c.width / 600;
        
        if (this.worldOffX >= 600) {
            this.worldOffX = 0;
        }
        
        if (this.worldOffX <= -600) {
            this.worldOffX = 0;
        }
        
        if (this.worldOffY >= 600) {
            this.worldOffY = 0;
        }
        
        if (this.worldOffY <= -600) {
            this.worldOffY = 0;
        }
        
        //draw ground
        for (let y = -1; y < rows+1; y++) {
            for (let x = -1; x < colls+1; x++) {
                ctx.drawImage(this.images.dirt, (600 * x) + this.worldOffX, (600 * y) + this.worldOffY, 600, 600);
        
            }
        }
        ////////////////////////
        
        this.drawZombies();
        
        //player
        ctx.save();
        ctx.translate(c.width/2,c.height/2);
        ctx.rotate(this.player.angle);
        ctx.drawImage(this.images.player, -(55/2)-10, -(30/2), 55, 30)
        ctx.restore();
        
        this.drawUI();
        
        if (this.showShootingRange) {
            //gun range
            //let d1 = c.width/2 - mouseX;
            //let d2 = c.height/2 - mouseY;
            //let val = Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2));
            ctx.beginPath();
            ctx.ellipse(c.width/2, c.height/2, this.player.range, this.player.range, 0, 0, 360, false);
            //ctx.ellipse(c.width/2, c.height/2, val, val, 0, 0, 360, false);
            ctx.closePath();
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }
    
    logic() {
        this.player.move();
        
        if (this.playerShoot) { //if player is shooting
            this.player.fireCounter += dt; 
            this.player.showFireLine = false;
            
            if (this.player.fireCounter >= this.player.rate) { //if gun can shoot - fire rate
                this.player.fireCounter = 0;
                this.player.showFireLine = true;
                
                this.x2 = (c.width/2) + (-this.player.range) * Math.cos(this.player.angle);
                this.y2 = (c.height/2) + (-this.player.range) * Math.sin(this.player.angle);
                
                for(let i = 0; i < this.zombies.length; i++) { //loop through zombiers and see if ray hits them
                    let z = this.zombies[i];

                    if (this.lineRect((c.width/2 - this.player.x) , (c.height/2 - this.player.y), this.x2 - this.player.x, this.y2 - this.player.y, z.x-z.w/2, z.y-z.h/2, z.w, z.h)) {
                        this.zombies[i].health -= this.player.damage; //damage zombie on colision
                        this.zombies[i].healthBarCounter = 0; 
                        this.zombies[i].showHealthBar = true;
                    }
                }
            }
        }
    }
    
    drawUI() {
        //shot line
        if (this.playerShoot && this.player.showFireLine) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(c.width/2, c.height/2);
            ctx.lineTo(this.x2, this.y2);
            ctx.closePath();
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        
        //damage impact
        for (let i = 0; i < this.temp.length; i++) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.temp[i].x-5, this.temp[i].y-5, 10, 10);
        }
        
        this.temp = [];
        
        //sight overlay
        let g = ctx.createRadialGradient(c.width/2,c.height/2, this.player.range/16, c.width/2, c.height/2, this.player.range/1.5);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,"+(this.player.sight/100)+")");
        ctx.fillStyle = g;
        ctx.fillRect(0,0,c.width,c.height);
        
        //coordinates
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "left";
        ctx.fillText("X: " + this.player.x + " Y: " + this.player.y, 10, 340);
        
        //player healthbar//////////////////////////
        //white
        ctx.fillStyle = "white";
        ctx.fillRect(c.width/2-300, c.height-60, 600, 40);
        //midle
        ctx.fillStyle = (this.player.health >= 50) ? "lime" : (this.player.health < 30) ? "red" : "orange";
        ctx.fillRect(c.width/2-300+4, c.height-60+4, 
                     (600-8)*(this.player.health/100), 40-8);
        /////////////////////////////////////////////
        
        //line
//        ctx.strokeStyle = "red";
//        ctx.beginPath();
//        ctx.moveTo(c.width/2, c.height/2);
//        ctx.lineTo(mouseX, mouseY);
//        ctx.closePath();
//        ctx.stroke();
        
        //minimap//////////////////
        ctx.fillStyle = "grey";
        ctx.fillRect(0,0,300,300);
        
        //zombies
        for (let i = 0; i < this.zombies.length; i++) {
            let xx = ((this.zombies[i].x+this.player.x)/((c.width/300)))-2;
            let yy = ((this.zombies[i].y+this.player.y)/((c.height/300)))-2;
            
            if (xx + 4 >= 0 && xx <= 300 && yy + 4 >= 0 && yy <= 300) {
                ctx.fillStyle = "darkred";
                ctx.fillRect(xx, yy, 4, 4);
            }
        }
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeRect(2,2,298,298);
        
        //player
        ctx.fillStyle = "lime";
        ctx.fillRect(145,145,10,10);
        
        ///////////////////////////
        
        //crosshairs
        ctx.fillStyle = "red";
        ctx.fillRect(mouseX-1, mouseY-10, 2, 20);
        ctx.fillRect(mouseX-10, mouseY-1, 20, 2);
        
        //dev text
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(c.width/2-200,0,400,50);
        ctx.fillStyle = "red";
        ctx.font = "30px Roboto";
        ctx.textAlign = "center";
        ctx.fillText("Game is in development", c.width/2, 30);
    }
    
    drawZombies() {
        for (let i = 0; i < this.zombies.length; i++) {
            let zx = this.zombies[i].x + this.player.x-50;
            let zy = this.zombies[i].y + this.player.y-50;
            
            //if zombie is in screen then draw
            if (zx+100 > 0 && zx <= c.width && zx+100 > 0 && zy <= c.height) {
                this.zombies[i].draw(this.player.x, this.player.y);
            }
            
            //killed
            if (this.zombies[i].health <= 0) {
                this.zombies.splice(i, 1);
                this.zombies.push(new Zombie());
            }
        }
    }
    
    lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
        let left = this.lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
        let right = this.lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
        let top = this.lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
        let bottom = this.lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
  
        if (left || right || top || bottom) {
            return true;
        }
        return false;
    }

    lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            // optionally, draw a circle where the lines meet
            let intersectionX = x1 + (uA * (x2-x1)) + this.player.x;
            let intersectionY = y1 + (uA * (y2-y1)) + this.player.y;
            
            this.temp.push({x: intersectionX, y: intersectionY});
            return true;
        }
        
        return false;
    }
    
    getImage(path) {
        let i = document.createElement("img");
        i.src = path;
        
        return i;
    }
}