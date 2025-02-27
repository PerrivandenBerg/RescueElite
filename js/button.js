class Button extends Collision {
    constructor(x, y, id) {
        super(x, y, 32, 8);
        this.id = id;
    }

    draw(ctx) {
        if (BUTTON_PRESSED === this.id)
            tint_image(ctx, load_sprite("button_on.png"), COLORS[this.id], this.x, this.y);
        else
            tint_image(ctx, load_sprite("button_off.png"), COLORS[this.id], this.x, this.y);
    }
}
