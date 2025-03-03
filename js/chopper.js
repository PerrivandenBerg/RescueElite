// Perri van den Berg (2025)

// Statuses of Chopper
const FLY = 0;
const LAND = 1;
const OFF = 2;
const CRASH = 3;

class Chopper extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 32, 18, coll_manager, world_objs); // 32 x 18

        this.angle = 0;
        this.fuel = 100;

        this.color = '#B8C76F'; // Placeholder
        this.draw_color = this.color;

        this.x_vec = 0;
        this.y_vec = 0;

        this.delay = 0; // Used for crash animation.

        this.sprite_timer = 0.0;

        this.max_hp = 3;
        this.hp = this.max_hp;

        this.persons_rescued = 0;

        // Shooting
        this.shoot_delay = 0;

        this.status = FLY;
        this.controls = { left: false, right: false, up: false, down: false, fire: false };

        window.addEventListener("keydown", (e) => this.handle_key(e, true));
        window.addEventListener("keyup", (e) => this.handle_key(e, false));
    }

    handle_key(event, isPressed) {
        switch (event.key) {
            case "ArrowLeft": this.controls.left = isPressed; break;
            case "ArrowRight": this.controls.right = isPressed; break;
            case "ArrowUp": this.controls.up = isPressed; break;
            case "ArrowDown": this.controls.down = isPressed; break;
            case "x": this.controls.fire = isPressed; break; // TODO: Shooting
            case "z": this.controls.fire = isPressed; break; // TODO: Pickup People/Throw down ladder
        }
    }

    update(deltaTime) {
        let new_x = this.x, new_y = this.y;

        this.sprite_timer += deltaTime * 10.0;
        if (this.sprite_timer >= 2)
            this.sprite_timer = 0;

        if (this.status === OFF) return;

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
        }



        if (this.status !== CRASH) {
            if (!this.controls.up && !this.controls.down && !this.controls.left
                && !this.controls.right && this.status !== LAND) {
                new_y += deltaTime * globalGravity;
            } else {
                if (this.controls.up && this.fuel !== 0) {
                    new_y--;
                    new_y += deltaTime * globalGravity;
                    if (this.status === LAND) {
                        this.status = FLY;
                        this.y_vec = -0.5;
                    }
                }
                if (this.controls.down && this.status !== LAND) {
                    new_y++;
                    new_y += deltaTime * globalGravity;
                }
                if (this.controls.left && this.status !== LAND) {
                    new_x--;
                    this.angle--;
                }
                if (this.controls.right && this.status !== LAND) {
                    new_x++;
                    this.angle++;
                }
            }
        }

        let dir = this.angle < 0 ? -1 : 1;
        this.angle = Math.abs(this.angle);


        // Bullet stuff
        if (this.shoot_delay > 0)
            this.shoot_delay -= deltaTime * 5.0;

        if (this.controls.fire && this.shoot_delay <= 0 && this.status === FLY) {
            this.shoot_delay = 5;
            if (this.angle > 5 && this.angle <= 7) { // Shoot straight forwards
                new Bullet(new_x + this.width / 2 + (this.width - 25) * dir, new_y + this.height / 2 + 2, 4 * dir, 0, PLAYER, this.cman, this.wobjs);
                new Bullet(new_x + this.width / 2 + (this.width - 25) * dir, new_y + this.height / 2 - 2, 4 * dir, 0, PLAYER, this.cman, this.wobjs);
            }
            else if (this.angle > 7) { // Shoot down forwards
                new Bullet(new_x + this.width / 2 + (this.width - 20) * dir, new_y + this.height / 2 + 4, 3 * dir, 1, PLAYER, this.cman, this.wobjs);
                new Bullet(new_x + this.width / 2 + (this.width - 20) * dir, new_y + this.height / 2 + 0, 3 * dir, 1, PLAYER, this.cman, this.wobjs);
            }
            else { // Shoot down
                new Bullet(new_x + this.width / 2, new_y + this.height - 6, 0, 3, PLAYER, this.cman, this.wobjs);
            }
        }


        // Angle/Movement stuff
        if (this.angle >= 7 && !(this.controls.left ^ this.controls.right)) {
            this.angle--;
        }

        if (this.angle >= 18) {
            this.angle = 16;
        }

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

        let others = this.check_collisions();

        others.forEach(other => {
            if (other instanceof Wall) {
                this.crash(other.x + other.width / 2, other.y + other.height / 2);
            }
            if (other instanceof Door) {
                if (BUTTON_PRESSED !== other.id)
                    this.crash(other.x + other.width / 2, other.y + other.height / 2);
            }
            if (other instanceof Break || other instanceof Tank) {
                this.crash(other.x + other.width / 2, other.y + other.height / 2);
            }
            if (other instanceof Platform) {
                // Check if fully on platform
                if (this.y + this.height / 2 < other.y + 2 &&
                    this.x >= other.x - 20 && this.x + this.width <= other.x + other.width + 20
                ) {
                    this.status = LAND;
                    if (!(this.controls.up && this.fuel !== 0)) {
                        this.y = other.y - this.height + 2;
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

        });

    }

    crash(x, y) {
        //this.status = CRASH;
        if (this.status !== CRASH) {
            console.log("Chopper crashed!", x, y);
            this.status = CRASH;
            this.delay = 30;
            this.hp--;
            // If hp === 0: Restart --> Done in world.
        }
        this.x_vec = ((this.x + this.width / 2) - x) / 3;
        this.y_vec = ((this.y + this.height / 2) - y) / 3;
    }

    pick_up_person() {
        console.log("You picked up a person!")
        this.persons_rescued++;
    }

    // TODO
    // open_fuel() {
    // }

    // TODO
    // add_fuel() {
    //     this.fuel = Math.min(100, this.fuel + 20);
    // }

    draw(ctx) {

        // Draw Chopper
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

        // Draw Hearts
        let sprite_heart = load_sprite("life.png");
        for (let i = 0; i < this.max_hp; i++) {
            if (this.hp <= i)
                tint_image(ctx, sprite_heart, 'gray', this.x - this.max_hp * 8 + i * 16 + this.width / 2, this.y - 20);
            else
                tint_image(ctx, sprite_heart, 'red', this.x - this.max_hp * 8 + i * 16 + this.width / 2, this.y - 20);

        }

        ctx.font = "8px Arial";
        ctx.fillStyle = 'white';
        ctx.fillText("Rescued: " + this.persons_rescued, this.x + this.width / 2 - 20, this.y - 30);
        // DEBUG: Collision box.
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}