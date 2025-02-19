class Heart extends Collision {
    constructor(x, y) {
        super(x, y, 32, 32);
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
    }
    
    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
