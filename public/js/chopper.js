// Perri van den Berg (2025)

// Statuses of Chopper.
const FLY = 0;
const LAND = 1;
const OFF = 2;
const CRASH = 3;

// This is the player chopper class used to play the game.
class Chopper extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x + 3, y + 2, 26, 14, coll_manager, world_objs); // 32 x 18
        this.z = 100;

        this.max_hp = 3;
        this.hp = this.max_hp;
        this.angle = 0;
        this.fuel = 100;
        this.persons_rescued = 0;
        this.delay = 0; // Used for crash animation.
        this.sprite_timer = 0.0;
        this.shoot_delay = 0;

        this.color = colorData['player']; // Placeholder
        this.draw_color = this.color;

        this.x_vec = 0;
        this.y_vec = 0;

        this.status = FLY;

        // Stores the 
        this.controls = { up: false, down: false, up_down: 0, left: false, right: false, left_right: 0, fire: false };

        window.addEventListener("keydown", (e) => this.handle_key(e, true));
        window.addEventListener("keyup", (e) => this.handle_key(e, false));
    }

    // Handles the keyboard input for moving and shooting.
    handle_key(event, isPressed) {
        switch (event.key) {
            case "ArrowLeft": this.controls.left = isPressed; break;
            case "ArrowRight": this.controls.right = isPressed; break;
            case "ArrowUp": this.controls.up = isPressed; break;
            case "ArrowDown": this.controls.down = isPressed; break;
            case "x": this.controls.fire = isPressed; break;
            case "z": this.controls.fire = isPressed; break;
        }

        // Calculates the direction the player goes.
        this.controls.up_down = (this.controls.up ? -1 : 0) + (this.controls.down ? 1 : 0);
        this.controls.left_right = (this.controls.left ? -1 : 0) + (this.controls.right ? 1 : 0);
    }

    shoot() {
        let dir = this.angle < 0 ? -1 : 1;
        this.angle = Math.abs(this.angle); // Absolute value to reduce if-statements.

        if (this.shoot_delay <= 0 && this.status === FLY) {
            this.shoot_delay = 3;
            if (this.angle > 5 && this.angle <= 7) { // Shoot straight forwards.
                new Bullet(this.x + this.width / 2 + (this.width - 25) * dir, this.y + this.height / 2 + 2, 4 * dir, 0, PLAYER, this.cman, this.wobjs);
                new Bullet(this.x + this.width / 2 + (this.width - 25) * dir, this.y + this.height / 2 - 2, 4 * dir, 0, PLAYER, this.cman, this.wobjs);
            }
            else if (this.angle > 7) { // Shoot down forwards.
                new Bullet(this.x + this.width / 2 + (this.width - 20) * dir, this.y + this.height / 2 + 4, 3 * dir, 1, PLAYER, this.cman, this.wobjs);
                new Bullet(this.x + this.width / 2 + (this.width - 20) * dir, this.y + this.height / 2 + 0, 3 * dir, 1, PLAYER, this.cman, this.wobjs);
            }
            else { // Shoot down.
                new Bullet(this.x + this.width / 2, this.y + this.height - 6, 0, 3, PLAYER, this.cman, this.wobjs);
            }
        }

        this.angle = this.angle * dir; // Flips the angle back.
    }

    update(deltaTime) {
        let new_x = this.x, new_y = this.y;

        // Chopper animation.
        this.sprite_timer += deltaTime * 10.0;
        if (this.sprite_timer >= 2)
            this.sprite_timer = 0;

        if (this.status === OFF) return;

        // Crashing animation.
        if (this.status === CRASH) {
            this.delay--;
            if (Math.floor(this.delay / 5) % 2 === 0)
                this.draw_color = 'white';
            else
                this.draw_color = this.color;

            if (this.delay === 0) {
                this.status = FLY;
                this.draw_color = this.color;
            }
        } else {
            this.delay = 0;
        }

        // Movement + Angles of the chopper based on keyboard input.
        if (this.status !== CRASH) {
            if (this.controls.up_down === 0 && this.controls.left_right === 0
                && this.status !== LAND) {
                new_y += deltaTime * globalGravity;
            } else {
                if (this.controls.up_down < 0 && this.fuel !== 0) {
                    new_y += this.controls.up_down;
                    new_y += deltaTime * globalGravity;
                    if (this.status === LAND) {
                        this.status = FLY;
                        this.y_vec = -0.5;
                    }
                }
                if (this.controls.up_down > 0 && this.status !== LAND) {
                    new_y += this.controls.up_down;
                    new_y += deltaTime * globalGravity;
                }
                if (this.controls.left_right < 0 && this.status !== LAND) {
                    new_x += this.controls.left_right;
                    this.angle--;
                }
                if (this.controls.left_right > 0 && this.status !== LAND) {
                    new_x += this.controls.left_right;
                    this.angle++;
                }
            }
        }

        if (this.status === FLY) // Remove fuel when flying.
            this.fuel -= deltaTime;

        if (this.fuel < 0 && this.hp > 0) { // The chopper 'dies' when no fuel.
            this.hp = 0;
            this.crash(this.x + this.width / 2, this.y + this.height / 2);
        }

        if (this.controls.fire)
            this.shoot();

        let dir = this.angle < 0 ? -1 : 1;
        this.angle = Math.abs(this.angle); // Absolute value to reduce if-statements.

        // Shooting bullets based on angle of chopper.
        if (this.shoot_delay > 0)
            this.shoot_delay -= deltaTime * 5.0;


        // Resets the angles of the chopper if there is no movement.
        if (this.angle >= 7 && this.controls.left_right === 0)
            this.angle--;

        if (this.angle >= 18)
            this.angle = 16;

        // Vectors for pushing the chopper.
        if (this.x_vec > 0.1 || this.x_vec < -0.1) {
            new_x += this.x_vec;
            this.x_vec *= 0.8;
        }

        if (this.y_vec > 0.1 || this.y_vec < -0.1) {
            new_y += this.y_vec;
            this.y_vec *= 0.9;
        }

        this.angle = this.angle * dir; // Flips the angle back.
        this.move(new_x, new_y);
        this.handle_collision(deltaTime);
    }

    handle_collision(deltaTime) {

        // Check if outside of level.
        if (this.x + this.width > world.level_x2 && !world.camera.loop_x)
            this.crash((this.x + this.width / 2) + 20, (this.y + this.height / 2));
        if (this.x < world.level_x1 && !world.camera.loop_x)
            this.crash((this.x + this.width / 2) - 20, (this.y + this.height / 2));
        if (this.y + this.height > world.level_y2)
            this.crash((this.x + this.width / 2), (this.y + this.height / 2) + 20);
        if (this.y < world.level_y1)
            this.crash((this.x + this.width / 2), (this.y + this.height / 2) - 20);


        // Different collision senarios.
        let others = this.check_collisions();
        others.forEach(other => {
            if (other instanceof Wall || other instanceof Break || other instanceof Tank) {
                this.crash(other.x + other.width / 2, other.y + other.height / 2);
            }
            if (other instanceof Door) {
                if (BUTTON_PRESSED !== other.id)
                    this.crash(other.x + other.width / 2, other.y + other.height / 2);
            }
            if (other instanceof Platform) {
                // Check if fully on platform
                if (this.y + this.height / 2 < other.y + 2 &&
                    this.x >= other.x - 20 && this.x + this.width <= other.x + other.width + 20
                ) {
                    this.status = LAND;
                    if (!(this.controls.up_down < 0 && this.fuel !== 0)) {
                        this.y = other.y - this.height;
                        this.move(this.x, this.y);
                    }
                } else {
                    this.crash((this.x + this.width / 2), other.y + other.height / 2);
                }
            }
            if (other instanceof Button) {
                if (other.id !== BUTTON_PRESSED) {
                    BUTTON_PRESSED = other.id;
                }
            }
            if (other instanceof Bullet) {
                if (other.shooter === ENEMY) {
                    this.crash(other.x, other.y);
                    other.explode()
                }
            }
            if (other instanceof Rocket) {
                this.crash(other.x, other.y);
                other.explode()
            }
            if (other instanceof FuelStation && this.status === LAND) {
                this.fuel = Math.min(this.fuel + 10 * deltaTime, 100);
            }
            if (other instanceof Exit) {
                global_complete_level(this.persons_rescued); // TODO: Keep track of more stats!
            }
        });
    }

    // Crashes the chopper and takes HP.
    crash(x, y) {

        if (this.status !== CRASH) {
            this.status = CRASH;
            this.delay = 30;
            this.hp--;
            // If hp === 0: Restart --> Done in world.

            this.x_vec = ((this.x + this.width / 2) - x) / 3;
            this.y_vec = ((this.y + this.height / 2) - y) / 3;
        } else {
            this.x_vec = ((this.x + this.width / 2) - x) / 6;
            this.y_vec = ((this.y + this.height / 2) - y) / 6;
        }
    }

    // Picks up a person.
    pick_up_person() {
        this.persons_rescued++;
    }

    draw(ctx) {
        // Draws the chopper in the right direction and speed.
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
        tint_image(ctx, sprite_chopper, this.draw_color, this.x - 3, this.y - 2);

    }
}