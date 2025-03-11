// Perri van den Berg (2025)

// This object is similar to the Wall object, but breaks when hit by a bullet.
class Break extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.z = 0;
        this.breaking = false;
    }

    update() {
        // Does nothing.
    }

    explode() {
        this.delete();
    }

    draw(ctx) {
        tint_image(ctx, load_sprite("breakable.png"), 'purple', this.x, this.y);
    }
}
