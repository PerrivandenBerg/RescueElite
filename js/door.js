class Door extends Collision {
    constructor(x, y, id) {
        super(x, y, 8, 8);

        this.id = 0;
    }

    draw(ctx) {
        if (BUTTON_PRESSED === this.id)
            tint_image(ctx, load_sprite("door_open.png"), COLORS[this.id], this.x, this.y);
        else
            tint_image(ctx, load_sprite("door_closed.png"), COLORS[this.id], this.x, this.y);
    }
}
