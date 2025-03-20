// Perri van den Berg (2025)

// The player can land on this and take a break.
class Platform extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 48, 8, coll_manager, world_objs);
        this.z = 10;

    }

    update() {
        // Does nothing.
    }

    draw(ctx) {
        tint_image(ctx, load_sprite("platform.png"), colorData['platform'], this.x, this.y);
    }
}
