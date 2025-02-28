class Wall extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
    }

    update() {

    }
    
    draw(ctx) {
        ctx.fillStyle = 'purple';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
