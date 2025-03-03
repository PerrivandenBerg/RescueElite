class Break extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.breaking = false;
    }

    update() {
    }

    explode() {
        // TODO: Explosion
        this.delete();
    }

    draw(ctx) {
        tint_image(ctx, load_sprite("breakable.png"), 'purple', this.x, this.y);
    }
}
