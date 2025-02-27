// Perri van den Berg (2025)

const globalGravity = 0.98; // Define missing globalGravity variable

// Statuses of Chopper
const FLY = 0;
const LAND = 1;
const OFF = 2;
const CRASH = 3;
const GO = 4;

// Collision Types
const SAFE = 0;
const LAZER = 1;
const ROCKET = 2;
const BULLET = 3;
const WALL = 4;
const FUEL_EMPTY = 5;
const FLOOR = 6;
const PERSON = 7;
const FUEL_CLOSED = 8;
const REFUEL = 9;

class Chopper extends Collision {
    constructor() {
        super(0, 0, 32, 18); // 32 x 18
        this.x = 50;
        this.y = 50;

        this.angle = 0;
        this.speed = 0;
        this.fuel = 100;

        this.color = '#B8C76F'; // Placeholder
        this.draw_color = this.color;

        this.x_vec = 0;
        this.y_vec = 0;

        this.delay = 0; // Used for crash animation.

        this.sprite_timer = 0.0;

        this.max_hp = 3;
        this.hp = this.max_hp;

        // Shooting
        this.bullets = [];
        this.shoot_delay = 0;

        this.status = FLY;
        this.col = SAFE;
        this.controls = { left: false, right: false, up: false, down: false, fire: false };

        window.addEventListener("keydown", (e) => this.handle_key(e, true));
        window.addEventListener("keyup", (e) => this.handle_key(e, false));
    }

    set_position(x, y) {
        this.x = x;
        this.y = y;
    }

    reset() {
        this.hp = this.max_hp;
        this.draw_color = this.color;
        this.x_vec = 0;
        this.y_vec = 0;
        this.status = FLY;
        this.shoot_delay = 0;
        this.bullets = [];
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



        // Controlls

        // if (this.status === GO) {
        //     this.fuel = Math.max(0, this.fuel - 0.1);
        //     if (this.fuel === 0) this.status = FLY;
        // }

        if (this.status !== CRASH) {
            if (!this.controls.up && !this.controls.down && !this.controls.left
                && !this.controls.right && this.status !== LAND) {
                this.hover(deltaTime);
            } else {
                if (this.controls.up && this.fuel !== 0) {
                    this.y--;
                    this.hover(deltaTime);
                    if (this.status === LAND) {
                        this.status = FLY;
                        this.y_vec = -0.5;
                    }
                }
                if (this.controls.down && this.status !== LAND) {
                    this.y++;
                    this.hover(deltaTime);
                }
                if (this.controls.left && this.status !== LAND) {
                    this.x--;
                    this.angle--;
                }
                if (this.controls.right && this.status !== LAND) {
                    this.x++;
                    this.angle++;
                }
            }
        }

        let dir = this.angle < 0 ? -1 : 1;
        this.angle = Math.abs(this.angle);


        // Bullet stuff
        if (this.shoot_delay > 0)
            this.shoot_delay -= deltaTime * 5.0;

        for (let b = 0; b < this.bullets.length; b++) {
            if (this.bullets[b].delete)
                this.bullets.splice(b, 1);
        }

        if (this.controls.fire && this.shoot_delay <= 0 && this.status === FLY) {
            this.shoot_delay = 5;
            if (this.angle > 5 && this.angle <= 7) { // Shoot straight forwards
                let bull1 = new Bullet(this.x + this.width / 2 + (this.width - 25) * dir, this.y + this.height / 2 + 2, 4 * dir, 0, PLAYER);
                let bull2 = new Bullet(this.x + this.width / 2 + (this.width - 25) * dir, this.y + this.height / 2 - 2, 4 * dir, 0, PLAYER);
                this.bullets.push(bull1);
                this.bullets.push(bull2);
            }
            else if (this.angle > 7) { // Shoot down forwards
                let bull1 = new Bullet(this.x + this.width / 2 + (this.width - 20) * dir, this.y + this.height / 2 + 4, 3 * dir, 1, PLAYER);
                let bull2 = new Bullet(this.x + this.width / 2 + (this.width - 20) * dir, this.y + this.height / 2 + 0, 3 * dir, 1, PLAYER);
                this.bullets.push(bull1);
                this.bullets.push(bull2);
            }
            else { // Shoot down
                let bull = new Bullet(this.x + this.width / 2, this.y + this.height - 6, 0, 3, PLAYER);
                this.bullets.push(bull);
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
            this.x += this.x_vec;
            this.x_vec *= 0.8;
        }

        if (this.y_vec > 0.1 || this.y_vec < -0.1) {
            this.y += this.y_vec;
            this.y_vec *= 0.9;
        }

        this.angle = this.angle * dir;
    }


    handle_collision(other) {
        if (other instanceof Wall) {
            this.crash(other.x + other.width / 2, other.y + other.height / 2);
        }
        if (other instanceof Door) {
            this.crash(other.x + other.width / 2, other.y + other.height / 2);
        }
        if (other instanceof Break) {
            this.crash(other.x + other.width / 2, other.y + other.height / 2);
        }
        if (other instanceof Platform) {
            // Check if fully on platform
            if (this.y + this.height / 2 < other.y + 2 &&
                this.x >= other.x - 20 && this.x + this.width <= other.x + other.width + 20
            ) {
                this.status = LAND;
                if (!(this.controls.up && this.fuel !== 0))
                    this.y = other.y - this.height + 2;
            } else {
                this.crash((this.x + this.width / 2), other.y + other.height / 2);
            }
        }
        if (other instanceof Button) {
            if (other.id !== BUTTON_PRESSED) {
                BUTTON_PRESSED = other.id;
            }
        }
    }

    // check_collisions() {
    //     if (this.col !== SAFE) {
    //         switch (this.col) {
    //             case LAZER:
    //             case ROCKET:
    //             case BULLET:
    //             case WALL:
    //             case FUEL_EMPTY:
    //                 this.crash();
    //                 break;
    //             case FLOOR:
    //                 if (!this.check_land()) this.crash();
    //                 else this.land();
    //                 break;
    //             case PERSON:
    //                 this.pick_up_person();
    //                 break;
    //             case FUEL_CLOSED:
    //                 this.open_fuel();
    //                 break;
    //             case REFUEL:
    //                 this.add_fuel();
    //                 break;
    //         }
    //     }
    // }

    hover(deltaTime) {
        this.y += deltaTime * gobalGravity;
    }

    crash(x, y) {
        //this.status = CRASH;
        if (this.status !== CRASH) {
            console.log("Chopper crashed!", x, y);
            this.status = CRASH;
            this.delay = 30;
            this.hp--;
            this.x_vec = ((this.x + this.width / 2) - x) / 2;
            this.y_vec = ((this.y + this.height / 2) - y) / 2;
            // If hp === 0: Restart --> Done in world.

        }
    }

    // TODO
    // pick_up_person() {
    // }

    // TODO
    // open_fuel() {
    // }

    // TODO
    // add_fuel() {
    //     this.fuel = Math.min(100, this.fuel + 20);
    // }

    draw(ctx) {

        // Draw Bullets
        this.bullets.forEach(obj => { obj.draw(ctx); });


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

        // DEBUG: Collision box.
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}