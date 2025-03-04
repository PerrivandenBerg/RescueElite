// Perri van den Berg (2025)

// The player can refuel when standing on a platform with this on top of it.
// NOTE: Place this on top of a platform.
class FuelStation extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 48, 20, coll_manager, world_objs);
    }

    update() {
        // Does nothing.
    }

    draw(ctx) {
        tint_image(ctx, load_sprite("fuel_station.png"), 'lime', this.x, this.y + 2);

        // Fuel text above the station.
        ctx.font = "7px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = 'lime';
        ctx.fillText("FUEL STATION", this.x + this.width / 2, this.y - 2);
    }
}
