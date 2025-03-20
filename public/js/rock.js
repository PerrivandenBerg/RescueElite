// Perri van den Berg (2025)

// A solid object with rough edges. The player takes damage when colliding with this.
class Rock extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.z = 0;

        

    }

    update() {
        // Does nothing.
    }

    draw(ctx) {
        ctx.fillStyle = colorData['wall'];
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
