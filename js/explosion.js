class Explosion {
    constructor(x, y, max_radius, world_objs) {
        this.x = x;
        this.y = y;
        this.max_r = max_radius; // Radius
        this.r = 0;

        this.wobjs = world_objs; // World Objects
        this.wobjs.push(this);
    }


    update(deltaTime) {

        this.r += deltaTime * this.max_r * 8;

        // Delete explosion.
        if (this.r >= this.max_r) {
            let index = this.wobjs.indexOf(this);
            if (index !== -1) this.wobjs.splice(index, 1);
        }

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // White transparent
        ctx.fill();
    }
}
