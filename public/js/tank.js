
// Perri van den Berg (2025)

// Constants of the Drone class
const MIN_ACTIVATION_DISTANCE_TANK = 120;
const COOLDOWN_BULLET = 2;

// Enemy tank class, moves around on the ground and shoots rockets if the player
// comes nearby. Can be destroyed by the player.
class Tank extends Collision {
    constructor(x, y, coll_manager, world_objs, player) {
        super(x, y, 24, 16, coll_manager, world_objs);
        this.z = 30;

        this.cooldown = 0;
        this.player = player;  // The player object.
        this.flip = false;
        this.dir = -1;  // Movement direction.
    }

    explode() {
        this.delete();
    }

    shoot_bullet() {
        let shoot_dir = -1;
        if (!this.flip)
            shoot_dir = 1;
        new Rocket(this.x + this.width / 2, this.y - 4, shoot_dir * 1.6, -1, this.cman, this.wobjs, this.player);
        this.cooldown = COOLDOWN_BULLET;
    }

    update(deltaTime) {
        // Bullet cooldown.
        if (this.cooldown > 0)
            this.cooldown -= deltaTime;

        // Flip based on where the player is.
        if (this.player.x > this.x)
            this.flip = false;
        else
            this.flip = true;

        // Shoots a rocket if the player comes too close.
        let dist_player = dist((this.player.x + this.player.width / 2), (this.player.y + this.player.height / 2),
            (this.x + this.width / 2), (this.y + this.height / 2));

        if (dist_player < MIN_ACTIVATION_DISTANCE_TANK && this.cooldown <= 0)
            this.shoot_bullet();

        // Movement.
        let new_x = this.x, new_y = this.y;
        new_x += this.dir * 1.2;

        this.move(new_x, new_y);
        this.handle_collision();
    }

    handle_collision() {
        // Flips movement if pit.
        let rotate = false;

        let list = this.cman.get_colliding_objects(this.x + this.width / 2 + (this.width / 2 - 2) * this.dir, this.y + this.height + 2, 4, 4);
        if (list.length == 0)
            rotate = true;

        // Flips movement if wall.
        let others = this.check_collisions();
        others.forEach(other => {
            if (other instanceof Wall || other instanceof Platform ||
                other instanceof Button || (other instanceof Door && other.id !== BUTTON_PRESSED) ||
                other instanceof Platform || other instanceof Break
            )
                if (other.y >= this.y)
                    rotate = true;
        });
        if (rotate)
            this.dir *= -1;
    }

    draw(ctx) {
        let img = "tank.png";
        if (this.flip)
            img = "tank_flip.png";
        tint_image(ctx, load_sprite(img), colorData['enemy'], this.x + 1, this.y + 1);
    }
}
