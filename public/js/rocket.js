// Perri van den Berg (2025)

// This rocket moves with a given vector. It goes up and down to match the y-coord
// of the nearby player.
class Rocket extends Collision {
    constructor(x, y, x_vec, y_vec, cman, wobjs, player) {
        super(x, y, 4, 4, cman, wobjs);
        this.z = 40;

        this.x_vec = x_vec;
        this.y_vec = y_vec;
        this.player = player; // The player object.
        this.fly_time = 5;
        this.alive = 140;
    }

    explode() {
        new Explosion(this.x, this.y, 12, this.wobjs);
        this.delete();
    }

    update(deltaTime) {
        this.alive--;
        if (this.alive < 0) {
            this.delete();
            return;
        }

        // Moves the rocket towards the player.
        this.fly_time -= deltaTime;
        let new_x = this.x, new_y = this.y;
        this.y_vec += 0.02;

        if (this.fly_time > 0) {
            let py = this.player.y + this.player.height / 2;
            if (new_y > py)
                new_y -= 0.5;
            else if (new_y < py - 10)
                new_y += 0.5;
        }

        if (this.x_vec > 0.1 || this.x_vec < -0.1)
            new_x += this.x_vec;

        if (this.y_vec > 0.1 || this.y_vec < -0.1)
            new_y += this.y_vec;

        this.move(new_x, new_y);
        this.handle_collision();
    }

    handle_collision() {
        // Explodes on impact.
        let others = this.check_collisions();
        others.forEach(other => {
            if (other instanceof Wall || other instanceof Platform ||
                other instanceof Button || (other instanceof Door && other.id !== BUTTON_PRESSED) ||
                other instanceof Platform || other instanceof Break
            ) {
                this.explode();
            }
        });
    }

    draw(ctx) {
        let img = "rocket.png";
        if (this.x_vec < 0)
            img = "rocket_flip.png";
        tint_image(ctx, load_sprite(img), colorData['rocket'], this.x + 1, this.y);
    }
}