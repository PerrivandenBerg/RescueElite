// Perri van den Berg (2025)

var BUTTON_PRESSED = -1; // The current button that is pressed.
var COLORS = { "0": "blue", "1": "red", "2": "green", "3": "yellow" }; // The different colors of doors/buttons.

// This class holds the information about a level and updates/draws any object in it.
class World {
    constructor() {

        this.cman = new CollisionManager(); // Manages the collision.
        this.wobjs = [];  // Contains all the world objects.

        this.chopper; // The player object, also stored in the list.

        // The corners of the world.
        this.level_x1 = canvas.width * 10; // Just a high number
        this.level_y1 = canvas.height * 10;
        this.level_x2 = 0;
        this.level_y2 = 0;

        this.curr_world = "";
        this.last_level_loaded = "";

        this.load_from_file("levels/chopper_training.json"); // Load level to play test.
    }

    // Resets the level. (eg. When the player dies)
    reset_level() {
        this.load_from_file(this.last_level_loaded);
    }

    // Clears all the variables and makes an empty level.
    clear() {
        this.cman.reset();
        this.wobjs = [];
    }

    // Loads the world from JSON formatting in a given file.
    // NOTE: The JSON must contain all the different elements of a level.
    async load_from_file(filename) {
        this.last_level_loaded = filename;
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to load world file: ${filename}`);
            }
            let text = await response.text()
            let data = JSON.parse(text);

            this.cman.reset();
            this.wobjs = [];

            BUTTON_PRESSED = -1;
            this.chopper = new Chopper(data.chopper.x, data.chopper.y, this.cman, this.wobjs);

            data.walls.forEach(obj => new Wall(obj.x, obj.y, this.cman, this.wobjs));
            data.doors.forEach(obj => new Door(obj.x, obj.y, obj.id, this.cman, this.wobjs));
            data.breaks.forEach(obj => new Break(obj.x, obj.y, this.cman, this.wobjs));
            data.platforms.forEach(obj => new Platform(obj.x, obj.y, this.cman, this.wobjs));
            data.buttons.forEach(obj => new Button(obj.x, obj.y, obj.id, this.cman, this.wobjs));
            data.tanks.forEach(obj => new Tank(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
            data.drones.forEach(obj => new Drone(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
            data.enemy_choppers.forEach(obj => new EnemyChopper(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
            data.persons.forEach(obj => new Person(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
            data.fuel_stations.forEach(obj => new FuelStation(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
            data.exits.forEach(obj => new Exit(obj.x, obj.y, this.cman, this.wobjs));


        } catch (error) {
            console.error("Error loading level: ", error);
        }


        for (var obj in this.wobjs) {
            if (this.wobjs[obj]) {
                this.level_x1 = Math.min(this.level_x1, this.wobjs[obj].x);
                this.level_y1 = Math.min(this.level_y1, this.wobjs[obj].y);
                this.level_x2 = Math.max(this.level_x2, this.wobjs[obj].x + this.wobjs[obj].width);
                this.level_y2 = Math.max(this.level_y2, this.wobjs[obj].y + this.wobjs[obj].height);
            }
        }
    }

    update(deltaTime) {

        // Updates all the objects in the level.
        for (var obj in this.wobjs) {
            this.wobjs[obj].update(deltaTime);
        }

        if (typeof this.chopper !== 'undefined' && ((this.chopper.hp <= 0 && this.chopper.status !== CRASH) || this.chopper.hp < 0)) {
            this.reset_level(); // Restarts the level if the player died.
        }

        // Wrap horizontal movement.
        if (this.chopper.x < 0) {
            this.chopper.move(this.chopper.x + this.level_width, this.chopper.y);
            set_camera(this.chopper.x, this.chopper.y);
        } else if (this.chopper.x >= this.level_width) {
            this.chopper.move(this.chopper.x - this.level_width, this.chopper.y);
            set_camera(this.chopper.x, this.chopper.y);
        }

    }

    draw(ctx) {
        this.wobjs.sort((a, b) => a.z - b.z);

        this.wobjs.forEach(obj => obj.draw(ctx));
    }


}
