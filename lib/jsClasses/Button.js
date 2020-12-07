class Button {
    constructor(ctx, x, y, w, h) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.text = "";
        this.textColor = "rgb(0,0,0)";
        this.font = "30px Raleway";
        this.background = "rgb(255,255,255)";
        this.highlightColor = "rgb(150,150,150)";
        this.stroke = "rgb(0,0,0)";
        this.outlineWidth = "1";
    }
    
    draw(dx, dy) {
        //fill color
        if (this.over(dx, dy)) {
            this.ctx.fillStyle = this.highlightColor;
        } else {
            this.ctx.fillStyle = this.background;
        }
        
        //draw rect
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        
        //stroke
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = this.outlineWidth;
        this.ctx.strokeRect(this.x, this.y, this.w, this.h);
        
        //text
        this.ctx.fillStyle = this.textColor;
        this.ctx.textAlign = "center";
        this.ctx.font = this.font;
        this.ctx.fillText(this.text, this.x + this.w/2, this.y + this.h/2+10);
        
    }
    
    over(dx, dy) {
        if (dx > this.x && dx < this.x + this.w && dy > this.y && dy < this.y + this.h) {
            return true;
        }
        return false;
    }
    
    clicked(dx, dy) {
        if (mouseX == null || mouseX == undefined) {
            console.warn("Clicked dx argument not specified.")
        } else if (mouseY == null || mouseY == undefined) {
            console.warn("Clicked dy argument not specified.")
        }
        
        if (dx > this.x && dx < this.x + this.w && dy > this.y && dy < this.y + this.h) {
            return true;
        }
        return false;
    }
    
    //Getters
    getX() { return this.x; }
    getY() { return this.y; }
    getW() { return this.w; }
    getH() { return this.h; }
    
    //Setters
    setX(val) { this.x = val; }
    setY(val) { this.y = val; }
    setW(val) { this.w = val; }
    setH(val) { this.h = val; }
    setBackground(val) { this.background = val; }
    setHighlight(val) { this.highlightColor = val; }
    setOutline(val) { this.stroke = val; }
    setText(val) { this.text = val; }
    setOutlineWidth(val) { this.outlineWidth = val; }
    setPos(val1, val2) { this.x = val1; this.y = val2; }
    setDimentions(val1, val2) { this.w = val1; this.h = val2; }
}