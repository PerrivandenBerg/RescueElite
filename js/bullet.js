// Perri van den Berg (2025)

// Shooter types:
const PLAYER = 0;
const ENEMY = 1;

// Shoots a bullet which can damage other objects.
class Bullet extends Collision {
    constructor(x, y, x_vec, y_vec, shooter, cman, wobjs) {
        super(x, y, 2, 2, cman, wobjs);
        this.x_vec = x_vec;
        this.y_vec = y_vec;
        this.shooter = shooter;
    }

    explode() {
        new Explosion(this.x, this.y, 8, this.wobjs);
        this.delete();
    }

    update() {
        // Check if outside of screen.
        if (this.x < camera.x - canvas.width / (2 * camera.zoom) 
            || this.y < camera.y - canvas.height / (2 * camera.zoom) 
            || this.x + this.width > camera.x + canvas.width / (2 * camera.zoom)
            || this.y + this.height > camera.y + canvas.height / (2 * camera.zoom))
            this.delete();

        // Move the bullet in a direction.
        let new_x = this.x, new_y = this.y;
        if (this.x_vec > 0.1 || this.x_vec < -0.1)
            new_x += this.x_vec;

        if (this.y_vec > 0.1 || this.y_vec < -0.1)
            new_y += this.y_vec;

        this.move(new_x, new_y);
        this.handle_collision();
    }

    handle_collision() {
        // Explodes on impact dealing damage to enemies/players.
        let others = this.check_collisions();
        others.forEach(other => {
            if (other instanceof Wall || other instanceof Platform ||
                other instanceof Button || (other instanceof Door && other.id !== BUTTON_PRESSED) ||
                other instanceof Platform
            ) {
                this.explode();
            }
            if (other instanceof Break || other instanceof Drone || other instanceof Tank
            ) {
                if (this.shooter === PLAYER) {
                    this.explode();
                    other.explode();
                }
            }
        });
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}