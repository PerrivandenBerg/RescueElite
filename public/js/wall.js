// Perri van den Berg (2025)

// A solid object. The player takes damage when colliding with this.
class Wall extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.z = 0;
    }

    update() {
        // Does nothing.
    }

    draw(ctx) {
        ctx.fillStyle = colorData['wall'];
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    }
}
