class Wall extends Collision {
    constructor(x, y) {
        super(x, y, 8, 8);
    }
    
    draw(ctx) {
        ctx.fillStyle = 'purple';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
