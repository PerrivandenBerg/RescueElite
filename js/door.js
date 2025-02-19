class Door extends Collision {
    constructor(x, y, req) {
        super(x, y, 32, 32);
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
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
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
