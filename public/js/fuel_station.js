// Perri van den Berg (2025)

// The player can refuel when standing on a platform with this on top of it.
// NOTE: Place this on top of a platform.
class FuelStation extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 48, 16, coll_manager, world_objs);
        this.z = 20;

    }

    update() {
        // Does nothing.
    }

    draw(ctx) {
        tint_image(ctx, load_sprite("fuel_station.png"), colorData['fuel_station'], this.x, this.y);

        // Fuel text above the station.
        ctx.font = "7px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = colorData['fuel_station'];
        ctx.fillText("FUEL STATION", this.x + this.width / 2, this.y - 1);
    }
}
