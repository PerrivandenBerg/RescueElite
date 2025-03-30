
// Perri van den Berg (2025)

const MIN_PICKUP_DIST_HP = 20;

// Pick this up to gain +1 HP.
class Heart extends Collision {
    constructor(x, y, coll_manager, world_objs, player) {
        super(x, y, 16, 16, coll_manager, world_objs);
        this.z = 50;

        this.player = player; // The player object.
    }

    update(deltaTime) {

        // Checks if player is near, if so -> +1 HP.
        let dist_player = dist((this.player.x + this.player.width / 2), (this.player.y + this.player.height / 2),
            (this.x + this.width / 2), (this.y + this.height / 2));
        if (dist_player < MIN_PICKUP_DIST_HP) {
            this.player.hp += 1;
            this.delete();
            return;
        }
    }


    draw(ctx) {
        tint_image(ctx, load_sprite("life.png"), 'red', this.x, this.y);
    }
}
