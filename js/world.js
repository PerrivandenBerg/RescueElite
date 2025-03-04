// Perri van den Berg (2025)

var BUTTON_PRESSED = -1; // The current button that is pressed.
var COLORS = { "0": "blue", "1": "red" }; // The different colors of doors/buttons.

// This class holds the information about a level and updates/draws any object in it.
class World {
    constructor() {

        // TODO: Take a file name as input and make a level select screen.

        this.cman = new CollisionManager(); // Manages the collision.
        this.wobjs = [];  // Contains all the world objects.

        this.chopper; // The player object, also stored in the list.

        this.curr_world = "";
        this.last_level_loaded = "";

        this.load_from_file("../levels/cavern1.json"); // Load level to play test.
    }

    // Resets the level. (eg. When the player dies)
    reset_level() {
        this.load_from_file(this.last_level_loaded);
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
    }

    update(deltaTime) {
        // TODO: Some sort of pause screen (simply don't update objects).

        // Updates all the objects in the level.

        for (var obj in this.wobjs) {
            this.wobjs[obj].update(deltaTime);
        }

        if (typeof this.chopper !== 'undefined' && this.chopper.hp <= 0 && this.chopper.status !== CRASH) {
            this.reset_level(); // Restarts the level if the player died.
        }
    }

    draw(ctx) {

        this.wobjs.sort((a, b) => a.z - b.z);

        ctx.fillStyle = 'black'; // Draws the background.
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draws all the objects in the level.
        this.wobjs.forEach(obj => { obj.draw(ctx); });
    }
}
