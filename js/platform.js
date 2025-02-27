class Platform extends Collision {
    constructor(x, y) {
        super(x, y, 48, 8);
    }

    draw(ctx) {
        tint_image(ctx, load_sprite("platform.png"), 'white', this.x, this.y);
    }
}
