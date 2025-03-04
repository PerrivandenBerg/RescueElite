// Perri van den Berg (2025)

// If this button is pressed by the player, the global button pressed state is
// updated and some doors open. (Doors and Buttons have matching colors)
class Button extends Collision {
    constructor(x, y, id, coll_manager, world_objs) {
        super(x, y, 32, 8, coll_manager, world_objs);
        this.id = id;
    }

    update() {
        // Does nothing.
    }

    draw(ctx) {
        // Draws button pressed/unpressed based on global button state.
        if (BUTTON_PRESSED === this.id)
            tint_image(ctx, load_sprite("button_on.png"), COLORS[this.id], this.x, this.y);
        else
            tint_image(ctx, load_sprite("button_off.png"), COLORS[this.id], this.x, this.y);
    }
}
