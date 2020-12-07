class SplashScreen {
    constructor(context, width, height) {
        this.counter = 0;
        this.ctx = context;
        this.w = width;
        this.h = height;
        this.blackAlpha = 100;
        this.isEnded = false;
        this.myName = "Umar Rajput"
        this.text = "Umar Rajput";
        this.showChar = 0;
        this.textCounter = 0;
        this.textCounter2 = 0;
        this.textCounter3 = 0;
        this.animType = 2;
        this.circle = {x: this.w/2, y: this.h/2};
        this.splashImg; 
        
        if (this.animType == 1 && !document.getElementById("splashImg")) {
            let img = document.createElement("img");
            img.src = "../../MenuImages/colorSplash.jpg";
            img.height = 0;
            img.id = "splashImg";
            document.getElementsByTagName("body")[0].appendChild(img);
        }
        
        this.splashImg = document.getElementById("splashImg");
    }
    
    draw(dt) {       
        //base
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.w, this.h);
        
        //text color back
        if (this.animType == 1) {
            this.ctx.drawImage(this.splashImg, this.w/2-300, this.h/2-110, 600, 160);
        }
        
        //text
        this.ctx.font = "70px Raleway";
        if (this.animType == 0) {
            this.ctx.fillStyle = "black";
        } else if (this.animType == 1) {
            if (this.textCounter3 > 100) {
                this.textCounter3 = 0;
                this.col = this.randomColor();
            }
        } else if (this.animType == 2) {
            this.ctx.fillStyle = "black";
        }
        
        this.ctx.fillStyle = this.col;
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.w/2, this.h/2);
        
        //black fade in
        this.ctx.fillStyle = "rgba(0,0,0,"+this.blackAlpha/100+")";
        this.ctx.fillRect(0, 0,this.w, this.h);
        
        //logic
        this.counter += dt;
        this.textCounter += dt;
        this.textCounter2 += dt;
        this.textCounter3 += dt;
        
        //black end screen
        if (this.counter >= 6000) {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0,0,this.w, this.h);
        }
        
        if (this.animType == 0) {
            //text changer
            if (this.textCounter > 50 && this.showChar < 12) {
                this.textCounter = 0;
                this.text = "";
                for(let i = 0; i < 11; i++) {
                    this.text += this.randomChar();    
                }
                this.text =  this.text.substr(0,4) + " " + this.text.substr(5,6);
                this.text = this.myName.substr(0, this.showChar) + this.text.substr(this.showChar, this.text.length-this.showChar);
            }

            //show text
            if (this.textCounter2 > 200 && this.showChar < 11) {
                this.textCounter2 = 0;
                this.showChar++;
            }
        }
        
        if (this.blackAlpha > 0) {
            this.blackAlpha -= 0.05 * dt;
        }
        
        if (this.counter > 4000) {
            this.isEnded = true;
        }
        
        return this.isEnded;
    }
    
    randomChar() {
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return letters.charAt(Math.floor(Math.random() * letters.length));
    }
      
    randomColor() {
        let sick_neon_colors = ["#CB3301", "#FF0066", "#FF6666", "#FEFF99", "#FFFF67", "#CCFF66", "#99FE00", "#EC8EED", "#FF99CB", "#FE349A", "#CC99FE", "#6599FF", "#03CDFF", "#FFFFFF"];
        return sick_neon_colors[Math.floor(Math.random()*sick_neon_colors.length)];
    }
}

