// Perri van den Berg (2025)

// Shooter types:
const PLAYER = 0;
const ENEMY = 1;

class Bullet extends Collision {
    constructor(x, y, x_vec, y_vec, shooter) {
        super(x, y, 2, 2); // 32 x 18
        this.x_vec = x_vec;
        this.y_vec = y_vec;
        this.shooter = PLAYER;
        this.delete = false;  // Used to delete this object.
    }

    update(deltaTime) {
        if (this.x_vec > 0.1 || this.x_vec < -0.1)
            this.x += this.x_vec;

        if (this.y_vec > 0.1 || this.y_vec < -0.1) 
            this.y += this.y_vec;
    }

    handle_collision(other) {
        if (other instanceof Wall) {
            this.delete = true;
        }
        if (other instanceof Door) {
            this.delete = true;
        }
        if (other instanceof Break) {
            this.delete = true;
            other.break();
        }
    }


    draw(ctx) {

        // TODO: Colors

        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}