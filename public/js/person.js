
// Perri van den Berg (2025)

const MIN_PICKUP_DIST = 20;

// The player needs to rescue all the persons in the map. These persons walk around
// in some random pattern. They avoid pits and walls.
class Person extends Collision {
    constructor(x, y, coll_manager, world_objs, player) {
        super(x, y, 8, 10, coll_manager, world_objs);
        this.z = 40;

        this.player = player; // The player object.
        this.flip = false;
        this.dir = -0.4;
        this.walk_delay = 0; // Person walks in a direction for x frames.
        this.sprite_timer = 0.0;
    }

    update(deltaTime) {
        // Walk animation.
        this.sprite_timer += deltaTime * 5.0;
        if (this.sprite_timer >= 2)
            this.sprite_timer = 0;

        if (this.walk_delay > 0)
            this.walk_delay -= deltaTime;

        if (this.walk_delay <= 0) {
            this.dir *= -1;
            this.walk_delay = Math.random() * 4 + 2;
        }

        // Flip based on movement direction.
        if (this.dir > 0)
            this.flip = false;
        else
            this.flip = true;

        // Checks if player is near, if so -> Gets picked up.
        let dist_player = dist((this.player.x + this.player.width / 2), (this.player.y + this.player.height / 2),
            (this.x + this.width / 2), (this.y + this.height / 2));
        if (dist_player < MIN_PICKUP_DIST) {
            this.player.pick_up_person();
            this.delete();
            return;
        }

        // Movement.
        let new_x = this.x, new_y = this.y;
        new_x += this.dir * 1.2;

        this.move(new_x, new_y);
        this.handle_collision();
    }


    handle_collision() {
        // Flips movement if pit.
        let list = this.cman.get_colliding_objects(this.x + this.width / 2 + (this.width / 2 + 5) * this.dir, this.y + this.height, 4, 4);
        if (list.length == 0) {
            this.dir *= -1;
            this.walk_delay = Math.random() * 4 + 2;
        }

        // Flips movement if wall.
        let others = this.check_collisions();
        others.forEach(other => {
            if (other instanceof Wall || other instanceof Platform ||
                other instanceof Button || (other instanceof Door && other.id !== BUTTON_PRESSED) ||
                other instanceof Platform || other instanceof Break
            ) {
                if (other.y >= this.y) {
                    this.dir *= -1;
                    this.walk_delay = Math.random() * 4 + 2;
                }
            }
        });
    }


    draw(ctx) {
        let sprite_animation = "_1"; // Which frame of the animation to use.
        if (this.sprite_timer >= 1)
            sprite_animation = "_2";

        let img = "person" + sprite_animation + ".png";
        if (this.flip)
            img = "person" + sprite_animation + "_flip.png";

        tint_image(ctx, load_sprite(img), 'white', this.x + 1, this.y + 1);
    }
}
