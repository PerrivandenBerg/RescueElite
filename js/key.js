class Key extends Collision {
    constructor(x, y, req) {
        super(x, y, 32, 32);
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.req = req;
        this.color = 'white';
        if (req == 0) // red
            this.color = 'red';
        if (req == 1) // blue
            this.color = 'blue';
        if (req == 2) // green
            this.color = 'green';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y + 16, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
console.log("key loaded")