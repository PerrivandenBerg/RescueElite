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

    move(new_x, new_y) {
        let old_x = this.x, old_y = this.y;
        this.x = new_x;
        this.y = new_y;
        this.cman.update_object(this, old_x, old_y);
    }

    check_collisions() {
        return this.cman.get_colliding_objects(this.x, this.y, this.width, this.height);
    }

    delete() {
        this.cman.remove_object(this, this.x, this.y);
        let index = this.wobjs.indexOf(this);
        if (index !== -1) this.wobjs.splice(index, 1);
    }
}
