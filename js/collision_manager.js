class CollisionManager {
    constructor() {
        this.width = 2;
        this.height = 1;
        this.cells = new Map(); // List of objects in the grid.
        this.objects = new Set(); // Stores all objects.
    }

    reset() {
        this.cells.clear();
        this.objects.clear();
    }

    // _getKey(x, y) {
    //     return `${Math.floor(x / this.width)},${Math.floor(y / this.height)}`;
    // }

    _get_keys_for_object(obj) {
        let keys = new Set();
        let x_start = Math.floor(obj.x / this.width);
        let y_start = Math.floor(obj.y / this.height);
        let x_end = Math.floor((obj.x + obj.width) / this.width);
        let y_end = Math.floor((obj.y + obj.height) / this.height);

        for (let x = x_start; x <= x_end; x++)
            for (let y = y_start; y <= y_end; y++)
                keys.add(`${x},${y}`);
        return keys;
    }

    add_object(obj) {
        this.objects.add(obj);
        let keys = this._get_keys_for_object(obj);
        for (let key of keys) {
            if (!this.cells.has(key)) {
                this.cells.set(key, []);
            }
            this.cells.get(key).push(obj);
        }
    }

    update_object(obj, old_x, old_y) {
        this.remove_object(obj, old_x, old_y);
        this.add_object(obj);
    }

    remove_object(obj, old_x, old_y) {
        let keys = this._get_keys_for_object({ x: old_x, y: old_y, width: obj.width, height: obj.height });
        for (let key of keys) {
            if (this.cells.has(key)) {
                let list = this.cells.get(key);
                let index = list.indexOf(obj);
                if (index !== -1) list.splice(index, 1);
                if (list.length === 0) this.cells.delete(key);
            }
        }
        this.objects.delete(obj);
    }

    get_colliding_objects(x, y, width, height) {
        let result = new Set();
        let keys = this._get_keys_for_object({ x, y, width, height });

        for (let key of keys) {
            if (this.cells.has(key)) {
                for (let obj of this.cells.get(key)) {
                    if (
                        x < obj.x + obj.width &&
                        x + width > obj.x &&
                        y < obj.y + obj.height &&
                        y + height > obj.y
                    ) {
                        result.add(obj);
                    }
                }
            }
        }
        return Array.from(result);
    }
}
