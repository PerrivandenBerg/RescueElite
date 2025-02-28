class Break extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.delay = 0;
        this.breaking = false;
    }

    update(deltaTime) {
        if (this.delay > 0)
            this.delay -= deltaTime * 10.0;
        if (this.delay <= 0 && this.breaking)
            this.delete();
    }

    break() {
        if (!this.breaking) {
            this.breaking = true;
            this.delay = 2;
        }
    }

    draw(ctx) {
        if (this.breaking === true)
            tint_image(ctx, load_sprite("breakable.png"), 'white', this.x, this.y);
        else
            tint_image(ctx, load_sprite("breakable.png"), 'purple', this.x, this.y);
    }
}
