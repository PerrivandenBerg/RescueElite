// Perri van den Berg (2025)

// Constants of the EnemyChopper class.
const MAX_FOLLOW_DISTANCE_ECHOP = 200;
const MIN_FOLLOW_DISTANCE_ECHOP = 140;

// This enemy mimics the player and shoots at the player.
class EnemyChopper extends Collision {
    constructor(x, y, coll_manager, world_objs, player) {
        super(x, y, 32, 18, coll_manager, world_objs); // 32 x 18
        this.z = 30;

        this.angle = 0;

        this.color = 'blue'; // Placeholder
        this.draw_color = this.color;

        this.x_vec = 0;
        this.y_vec = 0;

        this.delay = 0; // Used for crash animation.

        this.sprite_timer = 0.0;

        this.status = IDLE;

        this.max_hp = 3;
        this.hp = this.max_hp;

        // Shooting
        this.shoot_delay = 0;
        this.player = player; // Player object.
    }

    // Moves to a given location.
    follow(tx, ty) {
        let new_x = this.x, new_y = this.y;
        new_x += tx;
        new_y += ty;

        if (tx > 0) {
            this.angle++;
        }
        else if (tx < 0) {
            this.angle--;
        }
        this.move(new_x, new_y);
    }

    // Crashes and plays an animation.
    crash(x, y) {
        //this.status = CRASH;
        if (this.status !== CRASH) {
            this.status = CRASH;
            this.delay = 30;
            this.hp--;
            this.x_vec = ((this.x + this.width / 2) - x) / 2;
            this.y_vec = ((this.y + this.height / 2) - y) / 2;
        }
    }

    update(deltaTime) {

        // Distance between this and player.
        let dist_player = dist((this.player.x + this.player.width / 2), (this.player.y + this.player.height / 2),
            (this.x + this.width / 2), (this.y + this.height / 2));

        if (dist_player < MAX_FOLLOW_DISTANCE_ECHOP && this.status === IDLE)
            this.status = FOLLOW; // In range -> follow.

        if ((dist_player < MIN_FOLLOW_DISTANCE_ECHOP) && this.status === FOLLOW)
            this.status = IDLE; // Too close -> idle.

        // Animation.
        this.sprite_timer += deltaTime * 10.0;
        if (this.sprite_timer >= 2)
            this.sprite_timer = 0;

        // Crash animation.
        if (this.status === CRASH) {
            this.delay--;
            if (Math.floor(this.delay / 5) % 2 === 0)
                this.draw_color = 'white';
            else
                this.draw_color = this.color;

            if (this.delay === 0) {
                if (this.hp <= 0)
                    this.delete();
                this.status = IDLE;
                this.draw_color = this.color;
            }
        }

        if (this.status === FOLLOW) { // Follows the player.
            let x_vec2 = this.player.x + this.player.width / 2 - (this.x + this.width / 2);
            let y_vec2 = this.player.y + this.player.height / 2 - (this.y + this.height / 2);
            let max = Math.max(Math.abs(x_vec2), Math.abs(y_vec2));
            if (max >= MIN_FOLLOW_DISTANCE_ECHOP) { // Normalize + Follow
                this.follow(x_vec2 / max * 1.2, y_vec2 / max * 1.2);
            }
        } else if (this.status === IDLE && dist_player < MAX_FOLLOW_DISTANCE_ECHOP) { // If in range, move up and down.
            if (this.y > this.player.y + 10)
                this.follow(0, -1);
            else if (this.y < this.player.y - 10)
                this.follow(0, 1);
        }

        // Movement of the chopper.
        let new_x = this.x, new_y = this.y;

        let dir = this.angle < 0 ? -1 : 1;
        this.angle = Math.abs(this.angle);

        // Bullet shooting if the player is close.
        if (this.shoot_delay > 0)
            this.shoot_delay -= deltaTime * 5.0;

        if (this.shoot_delay <= 0 && dist_player < MAX_FOLLOW_DISTANCE_ECHOP) {
            this.shoot_delay = 5;
            if (this.angle > 5 && this.angle <= 7) { // Shoot straight forwards.
                new Bullet(new_x + this.width / 2 + (this.width - 25) * dir, new_y + this.height / 2 + 2, 4 * dir, 0, ENEMY, this.cman, this.wobjs);
                new Bullet(new_x + this.width / 2 + (this.width - 25) * dir, new_y + this.height / 2 - 2, 4 * dir, 0, ENEMY, this.cman, this.wobjs);
            }
            else if (this.angle > 7) { // Shoot down forwards.
                new Bullet(new_x + this.width / 2 + (this.width - 20) * dir, new_y + this.height / 2 + 4, 3 * dir, 1, ENEMY, this.cman, this.wobjs);
                new Bullet(new_x + this.width / 2 + (this.width - 20) * dir, new_y + this.height / 2 + 0, 3 * dir, 1, ENEMY, this.cman, this.wobjs);
            }
            else { // Shoot down.
                new Bullet(new_x + this.width / 2, new_y + this.height - 6, 0, 3, ENEMY, this.cman, this.wobjs);
            }
        }


        // Angle of the chopper.
        if (this.angle >= 7 && this.status !== FOLLOW) {
            this.angle--;
        }

        if (this.angle >= 18) {
            this.angle = 16;
        }

        // Vector movement when getting hit.
        if (this.x_vec > 0.1 || this.x_vec < -0.1) {
            new_x += this.x_vec;
            this.x_vec *= 0.8;
        }

        if (this.y_vec > 0.1 || this.y_vec < -0.1) {
            new_y += this.y_vec;
            this.y_vec *= 0.9;
        }

        this.angle = this.angle * dir;
        this.move(new_x, new_y);
        this.handle_collision();
    }


    handle_collision() {

        // Takes damage when getting hit by something.
        let others = this.check_collisions();
        others.forEach(other => {
            if (other instanceof Wall) {
                this.crash(other.x + other.width / 2, other.y + other.height / 2);
            }
            if (other instanceof Door) {
                if (BUTTON_PRESSED !== other.id)
                    this.crash(other.x + other.width / 2, other.y + other.height / 2);
            }
            if (other instanceof Break) {
                this.crash(other.x + other.width / 2, other.y + other.height / 2);
            }
            if (other instanceof Bullet) {
                if (other.shooter === PLAYER) {
                    this.crash(other.x, other.y);
                    other.explode()
                }
            }
            if (other instanceof Chopper) {
                this.crash(other.x, other.y);
                other.crash(this.x, this.y);
            }
        });
    }

    draw(ctx) {
        // Draws the chopper.
        let sprite_animation = "_1"; // Which frame of the animation to use.
        if (this.sprite_timer >= 1)
            sprite_animation = "_2";

        let type;
        if (Math.abs(this.angle) <= 5)
            type = "front";
        else if (Math.abs(this.angle) <= 7)
            type = "side_idle";
        else if (Math.abs(this.angle) < 14)
            type = "side_med";
        else
            type = "side_fast";

        let flip = "";
        if (this.angle < 0 && type !== "front")
            flip = "_flip";

        let sprite_chopper = load_sprite("chopper_" + type + sprite_animation + flip + ".png");
        tint_image(ctx, sprite_chopper, this.draw_color, this.x, this.y);
    }
}
