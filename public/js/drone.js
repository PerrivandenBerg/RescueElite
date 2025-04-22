// Perri van den Berg (2025)

// States of the Drone class.
const IDLE = 0;
const FOLLOW = 1;
const RETURN = 2;

// Constants of the Drone class
const MIN_ACTIVATION_DISTANCE_DRONE = 60;
const MAX_FOLLOW_RANGE_DRONE = 150;

// This enemy hovers in the air, and when a player comes near, it follows the 
// player. If they collide, the drone explodes dealing damage. If the drone is
// too far away from its original start point, it returns.
// The drone explodes on impact and foolishly follows the player.
class Drone extends Collision {
    constructor(x, y, coll_manager, world_objs, player) {
        super(x, y, 8, 8, coll_manager, world_objs);
        this.z = 30;

        this.player = player; // The player object.
        this.start_x = this.x + this.width / 2;
        this.start_y = this.y + this.height / 2;
        this.status = IDLE;
        this.flip = true;
        this.dir = -1;

        this.r = 0; // Range/Radar animation.
    }

    // Moves towards a location.
    follow(tx, ty) {
        let new_x = this.x, new_y = this.y;
        new_x += tx;
        new_y += ty;

        if (tx > 0) // Flips to match movement direction.
            this.flip = false;
        else
            this.flip = true;
        this.move(new_x, new_y);
    }

    explode() {
        this.delete();
        recordKills();
    }

    update() {
        // Moves towards the player if it gets close, moves back if the drone is
        // too far away from its original location.
        let dist_return_player = dist((this.player.x + this.player.width / 2), (this.player.y + this.player.height / 2),
            this.start_x, this.start_y);
        let dist_player = dist((this.player.x + this.player.width / 2), (this.player.y + this.player.height / 2),
            (this.x + this.width / 2), (this.y + this.height / 2));

        if (dist_player < MIN_ACTIVATION_DISTANCE_DRONE && this.status === IDLE)
            this.status = FOLLOW;

        if ((dist_return_player > MAX_FOLLOW_RANGE_DRONE) && this.status === FOLLOW)
            this.status = RETURN;

        if (this.status === FOLLOW) {
            let x_vec = this.player.x + this.player.width / 2 - (this.x + this.width / 2);
            let y_vec = this.player.y + this.player.height / 2 - (this.y + this.height / 2);
            let max = Math.max(Math.abs(x_vec), Math.abs(y_vec));
            if (max > 0) { // Normalize + Follow
                this.follow(x_vec / max * 0.8, y_vec / max * 0.8);
            }
        }

        if (this.status === RETURN) {
            let x_vec = this.start_x - this.x;
            let y_vec = this.start_y - this.y;
            let max = Math.max(Math.abs(x_vec), Math.abs(y_vec));
            if (max > 1) { // Normalize + Follow
                this.follow(x_vec / max * 2, y_vec / max * 2);
            } else {
                this.status = IDLE;
            }
        }

        this.r += 0.5;
        if (this.r > MIN_ACTIVATION_DISTANCE_DRONE)
            this.r = 0;


        this.handle_collision();
    }

    handle_collision() {
        // Explodes on impact and deals damage if it hits a player.
        let others = this.check_collisions();
        others.forEach(other => {
            if (other instanceof Wall || other instanceof Platform ||
                other instanceof Button || (other instanceof Door && other.id !== BUTTON_PRESSED) ||
                other instanceof Platform || other instanceof Break
            ) {
                this.explode();
            }

            if (other instanceof Chopper) {
                this.explode();
                this.player.crash(this.x, this.y);
            }
        });
    }

    draw(ctx) {



        // Draws the drone.
        let img = "drone.png";
        if (this.flip)
            img = "drone_flip.png";
        if (this.status === FOLLOW) {
            tint_image(ctx, load_sprite(img), colorData['enemy_angry'], this.x + 1, this.y + 1);
        }
        else {
            // Draw detection animation.
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.r, 0, 2 * Math.PI);
            ctx.fillStyle = colorData['enemy'];
            ctx.globalAlpha = 0.3 - 0.3*this.r / MIN_ACTIVATION_DISTANCE_DRONE;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
            tint_image(ctx, load_sprite(img), colorData['enemy'], this.x + 1, this.y + 1);
        }
    }
}
