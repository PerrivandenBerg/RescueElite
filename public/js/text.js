// Perri van den Berg (2025)

// A solid object. The player takes damage when colliding with this.
class Text extends Collision {
    constructor(x, y, text, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.z = 100;
        if (mobileControlsEnabled) {
            text = text.replace("MOVEMENT_CONTROLLS", "Use the joystick|to fly around.");
            text = text.replace("SHOOT_BUTTON", "the SHOOT button");
        } else {
            text = text.replace("MOVEMENT_CONTROLLS", "Use the arrow keys|to fly around.");
            text = text.replace("SHOOT_BUTTON", "x");
        }
        this.text = text;
    }

    update() {
        // Does nothing.
    }

    draw(ctx) {
        const txt_list = this.text.split("|");
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        const lineHeight = 10;
        let startY = this.y;

        for (let i = 0; i < txt_list.length; i++) {
            ctx.fillText(txt_list[i], this.x + 4, startY + i * lineHeight);
        }
    }
}
