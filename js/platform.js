class Platform extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 48, 8, coll_manager, world_objs);
    }
    
    update() {

    }

    draw(ctx) {
        tint_image(ctx, load_sprite("platform.png"), 'white', this.x, this.y);
    }
}
