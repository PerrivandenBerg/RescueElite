class Door extends Collision {
    constructor(x, y, id, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.id = id;
    }

    update() {

    }

    draw(ctx) {
        if (BUTTON_PRESSED === this.id)
            tint_image(ctx, load_sprite("door_open.png"), COLORS[this.id], this.x, this.y);
        else
            tint_image(ctx, load_sprite("door_closed.png"), COLORS[this.id], this.x, this.y);
    }
}
