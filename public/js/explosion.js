// Perri van den Berg (2025)

// This shows a brief explosion animation. Used by the bullet and rocket classes.
class Explosion {
    constructor(x, y, max_radius, world_objs) {
        this.z = 200;

        this.x = x;
        this.y = y;
        this.max_r = max_radius; // Radius.
        this.r = 0;
        this.wobjs = world_objs;
        this.wobjs.push(this);
    }

    update(deltaTime) {
        // Increases the radius.
        this.r += deltaTime * this.max_r * 8;

        // Delete explosion and remove from list.
        if (this.r >= this.max_r) {
            let index = this.wobjs.indexOf(this);
            if (index !== -1) this.wobjs.splice(index, 1);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = colorData['explosion'];
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.restore();
    }
}
