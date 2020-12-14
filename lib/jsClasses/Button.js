class Button {
    constructor() {
        this.x;
        this.y;
        this.w;
        this.h;
        
        this.text = "";
        this.textColor = "rgb(0,0,0)";
        this.font = "30px Roboto";
        this.background = "rgb(255,255,255)";
        this.highlightColor = "rgb(150,150,150)";
        this.stroke = "rgb(0,0,0)";
        this.outlineWidth = "1";
    }
    
    draw() {
        //fill color
        if (this.over()) {
            ctx.fillStyle = this.highlightColor;
        } else {
            ctx.fillStyle = this.background;
        }
        
        //draw rect
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        //stroke
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.outlineWidth;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        
        //text
        ctx.fillStyle = this.textColor;
        ctx.textAlign = "center";
        ctx.font = this.font;
        ctx.fillText(this.text, this.x + this.w/2, this.y + this.h/2+10);
        
    }
    
    over() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            return true;
        }
        return false;
    }
    
    clicked() {
        if (mouseX == null || mouseX == undefined) {
            console.warn("Clicked dx argument not specified.")
        } else if (mouseY == null || mouseY == undefined) {
            console.warn("Clicked dy argument not specified.")
        }
        
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
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