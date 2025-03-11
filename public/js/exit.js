// Perri van den Berg (2025)

// Exits the level and completes it.
class Exit extends Collision {
    constructor(x, y, coll_manager, world_objs) {
        super(x, y, 32, 32, coll_manager, world_objs);
        this.z = 0;

    }

    update() {
        // Does nothing.
    }

    draw() {
        // Does nothing.
    }
}
