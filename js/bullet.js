// Perri van den Berg (2025)

// Shooter types:
const PLAYER = 0;
const ENEMY = 1;

class Bullet extends Collision {
    constructor(x, y, x_vec, y_vec, shooter, cman, wobjs) {
        super(x, y, 2, 2, cman, wobjs); // 32 x 18
        this.x_vec = x_vec;
        this.y_vec = y_vec;
        this.shooter = shooter;
    }

    update() {
        if (this.x_vec > 0.1 || this.x_vec < -0.1)
            this.x += this.x_vec;

        if (this.y_vec > 0.1 || this.y_vec < -0.1) 
            this.y += this.y_vec;

        this.handle_collision();
    }

    handle_collision() {

        let others = this.check_collisions();

        others.forEach(other => {
            if (other instanceof Wall) {
                this.delete();
            }
            if (other instanceof Door) {
                this.delete();
            }
            if (other instanceof Break) {
                this.delete();
                other.break();
            }
            if (other instanceof Platform) {
                this.delete();
            }
            if (other instanceof Button) {
                this.delete();
            }

        });


    }


    draw(ctx) {

        // TODO: Colors

        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}