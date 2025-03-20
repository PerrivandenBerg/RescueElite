
// Perri van den Berg (2025)

// The 'HELP' pop-up near a person.
class PersonHelp extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.z = 40;

        this.alive = 30;
        this.x_off = (Math.random() - 0.5) * 0.1;
    }

    update() {
        // Walk animation.
        this.alive--;
        if (this.alive < 0) {
            this.delete();
            return;
        }
        this.move(this.x + this.x_off, this.y - 0.1);
    }


    draw(ctx) {
        // Help text.
        ctx.save();
        ctx.font = "6px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = colorData['person'];
        ctx.globalAlpha = Math.min(1, this.alive / 10);
        ctx.fillText("HELP!", this.x, this.y);
        ctx.restore();
    }
}
