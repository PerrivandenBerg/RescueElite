// Perri van den Berg (2025)

// Handles the collision of objects in the level.
class Collision {
    constructor(x, y, width, height, cman, wobjs) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.cman = cman; // Collision Manager
        this.wobjs = wobjs; // World Objects

        this.cman.add_object(this);
        this.wobjs.push(this);
    }

    // Moves the collision box to a new location.
    move(new_x, new_y) {
        let old_x = this.x, old_y = this.y;
        this.x = new_x;
        this.y = new_y;
        this.cman.update_object(this, old_x, old_y);
    }

    // Returns a list of all objects it is colliding with.
    check_collisions() {
        return this.cman.get_colliding_objects(this.x, this.y, this.width, this.height);
    }

    // Deletes the object and it's collision box.
    delete() {
        this.cman.remove_object(this, this.x, this.y);
        let index = this.wobjs.indexOf(this);
        if (index !== -1) this.wobjs.splice(index, 1);
    }
}
