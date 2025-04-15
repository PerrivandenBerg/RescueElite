// Perri van den Berg (2025)

// This is the screen's overlay with all the information.
class Overlay {
    constructor(world, player) {
        this.world = world;
        this.player = player;
        this.joystick = new Joystick(this.player);

    }

    // Used to reset the level.
    set_player(player) {
        this.player = player;
        this.joystick.set_player(player);
    }

    update() {
        if (mobileControlsEnabled)
            this.joystick.update();
    }

    draw(ctx) {
        ctx.save();

        ctx.scale(2.5, 2.5); // Apply zoom


        // Draw the hearts in the top-left corner.
        let sprite_heart = load_sprite("life.png");
        for (let i = 0; i < this.player.max_hp; i++) {
            let color = this.player.hp > i ? 'red' : 'darkred';
            tint_image(ctx, sprite_heart, color, 5 + i * 16, 5);
        }

        // Draw the rescued persons counter.
        ctx.font = "8px Arial";
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText("Rescued: " + this.player.persons_rescued + " / " + this.world.max_persons, 5, 28);

        // Draw the fuel counter.
        ctx.fillStyle = this.player.fuel > 10 ? 'white' : 'red';
        ctx.fillText("Fuel: " + Math.round(this.player.fuel), 5, 36);

        ctx.restore();

        if (mobileControlsEnabled)
            this.joystick.draw(ctx);
    }


    pause_game() {
        gameState = "paused";
    }

    restart_game() {
        this.world.reset_level();
    }
}