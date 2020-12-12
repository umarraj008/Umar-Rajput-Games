class Game {
    constructor() {
        this.ty = c.height;
        this.pipes = [];
        this.transitionOver = false;
        this.speed = 0.2;
        this.score = 0;
        this.pipeMaxGap = 700;
        this.pipeMaxHight = 900;
        this.birdInd = 0;
        this.jumpSpeed = 0.75;
        this.lastInd = 0;
        this.aiDist = 200;
        this.ai = false;
        this.drawPipeGap = false;
        this.showBirdBound = false;
        this.started = false;
        this.gameOver = false;
        this.playAgain = false;
        this.endY = 0;
        this.quit = false;
        this.bird = {
            x: c.width/2-200,
            y: c.height/2,
            vy: 0,
        };
        
        this.playAgainButton = new Button(ctx);
        this.menuButton = new Button(ctx);
        
        this.playAgainButton.setPos(20, c.height/2-75);
        this.playAgainButton.setDimentions(300, 150);  
        let buttonGradient = ctx.createLinearGradient(0, this.playAgainButton.y, 0, this.playAgainButton.y + 150);
        let buttonGradient2 = ctx.createLinearGradient(0, this.playAgainButton.y + 150, 0, this.playAgainButton.y);
        buttonGradient.addColorStop(0, "#34ebd2");
        buttonGradient.addColorStop(1, "#198a7a");
        buttonGradient2.addColorStop(0, "#34ebd2");
        buttonGradient2.addColorStop(1, "#198a7a");
        this.playAgainButton.setBackground(buttonGradient);
        this.playAgainButton.setHighlight(buttonGradient2);
        this.playAgainButton.setOutline("#095d99");
        this.playAgainButton.setOutlineWidth("4");
        this.playAgainButton.setText("Play Again");
        
        this.menuButton.setPos(20, c.height/2+95);
        this.menuButton.setDimentions(300, 150);
        buttonGradient = ctx.createLinearGradient(0, this.menuButton.y, 0, this.menuButton.y + 150);
        buttonGradient2 = ctx.createLinearGradient(0, this.menuButton.y + 150, 0, this.menuButton.y);
        buttonGradient.addColorStop(0, "#34ebd2");
        buttonGradient.addColorStop(1, "#198a7a");
        buttonGradient2.addColorStop(0, "#34ebd2");
        buttonGradient2.addColorStop(1, "#198a7a");
        this.menuButton.setBackground(buttonGradient);
        this.menuButton.setHighlight(buttonGradient2);
        this.menuButton.setOutline("#095d99");
        this.menuButton.setOutlineWidth("4");
        this.menuButton.setText("Menu");
        
        //pipe setup
        for (let i = 0; i < 10; i++) {
            if (i == 0) {
                this.pipes.push({x: c.width-600, y: c.height/2, canScore: true});
            } else {
                this.pipes.push({x: this.pipes[i-1].x + this.rand(300, this.pipeMaxGap), y: c.height/2 - (this.rand(-300, 300)), h: this.rand(200, this.pipeMaxHight), canScore: true});
            }
        }
        this.pipes.shift();
    }
    
    draw() {
        //sky
        let gg = ctx.createLinearGradient(0,0,0,c.height);
        gg.addColorStop(0, "#73d6fa");
        gg.addColorStop(1, "#096485");
        ctx.fillStyle = gg;
        ctx.fillRect(0,0,c.width,c.height);
        
        //mountains 
        if (!this.gameOver && this.started) {
            if (counter > 20) {
                counter = 0;
                mountain.push({x: c.width, y: c.width/2 + ((noise(t, 2) * 40))-400});
                t += 0.009;
            }
            counter += dt;
        }
        
        ctx.beginPath();
        ctx.moveTo(0,c.height);
        for (let i = 0; i < mountain.length-1; i++) {
            ctx.lineTo(mountain[i].x, mountain[i].y);
            if (!this.gameOver && this.started) {
                mountain[i].x -= (this.speed*0.5) * dt;

                if (mountain[i].x <= 0) {
                    mountain.shift();
                }
            }
        }
        ctx.lineTo(c.width, c.height);

        let g = ctx.createLinearGradient(0,c.height/2-100,0,c.height);
        g.addColorStop(0, "lime");
        g.addColorStop(1, "rgb(0,50,0)");

        ctx.fillStyle = g;
        ctx.fill();

        ctx.fillStyle = g;
        if (mountain.length > 0) {
            ctx.fillRect(mountain[0].x,mountain[0].y, -mountain[0].x, mountain[0].y);
        } else {
            ctx.fillRect(0,c.height/2, c.width, c.height/2);
        }
        
        //pipes
        for (let i = 0; i < this.pipes.length; i++) {
            //draw
            if (this.drawPipeGap) {
                ctx.fillStyle = "rgba(255,0,0,0.3)";
                ctx.fillRect(this.pipes[i].x, this.pipes[i].y - this.pipes[i].h/2, 100, this.pipes[i].h);
            }
            
            //top pipe
            ctx.drawImage(circleNoImg, this.pipes[i].x, this.pipes[i].y - this.pipes[i].h/2-9, 100, 18);
            ctx.drawImage(pipeImg, this.pipes[i].x, this.pipes[i].y - this.pipes[i].h/2, 100, -this.pipes[i].y);
            
            //bottom pipe
            ctx.drawImage(pipeImg, this.pipes[i].x, this.pipes[i].y + this.pipes[i].h/2, 100, c.height - this.pipes[i].y + this.pipes[i].h/2);
            ctx.drawImage(circleShadeImg, this.pipes[i].x, this.pipes[i].y + this.pipes[i].h/2-9, 100, 18);
            
            //move
            if (!this.gameOver && this.started) {
                this.pipes[i].x -= Math.floor(this.speed * dt);
            }
            
            this.lastInd = this.birdInd-1;
            if (this.lastInd < 0) {
                this.lastInd = this.pipes.length-1;
            }
            
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
            if (this.pipes[i].x + 100 <= 0) {
                this.pipes[i] = {x: this.findLast() + this.rand(300, this.pipeMaxGap), y: c.height/2 - (this.rand(-300, 300)), h: this.rand(200, this.pipeMaxHight), canScore: true};
                if (this.speed < 0.4) {
                    this.speed += 0.0001;    
                }
                
                if (this.pipeMaxGap > 400) {
                    this.pipeMaxGap -= 3;
                }
                
                if (this.pipeMaxHight > 300) {
                    this.pipeMaxHight -= 7;
                }
            }
        }
        
        //bird
        ctx.drawImage(birdImg, this.bird.x-30, this.bird.y-30, 60, 60);
        if (this.showBirdBound) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = "1";
            ctx.strokeRect(this.bird.x-30, this.bird.y-30, 60, 60);            
        }
        
        //move bird
        if (this.started) {
            this.birdMove();
        }
        
        //score text
        if (!this.gameOver) {
            ctx.fillStyle = "black";
            ctx.font = "100px Roboto";
            ctx.fillText(this.score, c.width/2, 100);            
        }
        
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
        
        //ui started text
        if (!this.started) {
            ctx.fillStyle = "black";
            ctx.font = "50px Roboto";
            ctx.fillText("Press Space or Click to Start!", c.width/2, c.height/2-100);
        }
        
        //game over text
        if (this.gameOver) {
            ctx.fillStyle = "black";
            ctx.font = "70px Roboto";
            ctx.fillText("Game Over", c.width/2, c.height/2);
            ctx.font = "50px Roboto";
            ctx.fillText("Score: " + this.score, c.width/2, c.height/2+50);
            
            //button
            this.playAgainButton.draw(mouseX, mouseY);
            this.menuButton.draw(mouseX, mouseY);
            
            if (this.playAgain) {
                ctx.fillStyle = "black";
                ctx.fillRect(0,0,c.width,this.endY);
                this.endY += 2 * dt;
                
                if (this.endY >= c.height) {
                    game = new Game();
                }
            }
            
            if (this.quit) {
                ctx.fillStyle = "black";
                ctx.fillRect(0,0,c.width,this.endY);
                this.endY += 2 * dt;
                
                if (this.endY >= c.height) {
                    transis = true;
                    transY = c.height;
                    state = 0;
                }
            }
        }        
        
        //ai
        if (this.ai) {
            this.aiDist = 200 ;//+ (200 * this.speed);
            if (this.bird.y > this.pipes[this.birdInd].y + this.pipes[this.birdInd].h/2-55 && 
                this.pipes[this.birdInd].x < this.bird.x + this.aiDist || this.bird.y > c.height-100 || 
                (this.pipes[this.lastInd].x > this.bird.x - 120 && this.bird.y > this.pipes[this.lastInd].y + this.pipes[this.lastInd].h/2-55)) {
                
                this.jump();
            }
        }
    }
    
    birdMove() {
        //gravity
        if (this.bird.y < c.height) {
            this.bird.vy += 0.03 * dt;
            this.bird.y += this.bird.vy;
        }
        
        //collision
        let bx = this.bird.x;
        let by = this.bird.y;
        
        for (let i = 0; i < this.pipes.length; i++) {
            let p = this.pipes[i];
            if (bx+30 > p.x && bx < p.x + 100) {            
                if (by <= p.y - p.h/2 || by+30 >= p.y + p.h/2) {
                    this.gameOver = true;
                }
            }
        }
        
        if (by + 30 >= c.height) {
            this.gameOver = true;
        }
    }
    
    jump() {
        if (!this.gameOver && this.started && this.bird.y > 50) {
            this.bird.vy = 0;
            this.bird.vy -= this.jumpSpeed * dt;
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