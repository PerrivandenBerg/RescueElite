// Perri van den Berg (2025)

// Similar to the wall object, but it becomes unsolid when its corresponding
// button is pressed. (The colors of the objects with the same ID match)
class Door extends Collision {
    constructor(x, y, id, coll_manager, world_objs) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.z = 0;
        this.id = id;
    }

    update() {
        // Does nothing.
    }

    draw(ctx) {
        // Draws open or closed based on the global button state.
        if (BUTTON_PRESSED === this.id)
            tint_image(ctx, load_sprite("door_open.png"), COLORS[this.id], this.x, this.y);
        else
            tint_image(ctx, load_sprite("door_closed.png"), COLORS[this.id], this.x, this.y);
    }
}
