// Perri van den Berg (2025)

const SIZE = 32;

var BUTTON_PRESSED = -1;
var COLORS = { "0": "blue", "1": "red" };

class World {
    constructor() {

        this.cman = new CollisionManager(); // Collision Manager
        this.wobjs = [];  // World Objects

        this.chopper;

        this.curr_world = "";
        this.last_level_loaded = "";

        this.load_from_file("../levels/level2.json");
    }

    reset_level() {
        this.load_from_file(this.last_level_loaded);
    }

    load_test_level() {

        BUTTON_PRESSED = -1;

        this.cman.reset();
        this.wobjs = [];

        this.chopper = new Chopper(50, 50, this.cman, this.wobjs);

        new Wall(100, 100, this.cman, this.wobjs);
        new Wall(150, 100, this.cman, this.wobjs);
        new Door(50, 120, 0, this.cman, this.wobjs);
        new Door(50, 128, 0, this.cman, this.wobjs);
        new Break(100, 128, this.cman, this.wobjs);
        new Platform(200, 100, this.cman, this.wobjs);
        new Platform(280, 100, this.cman, this.wobjs);
        new Button(284, 92, 0, this.cman, this.wobjs);
    }

    // Loads the world from JSON formatting in a given file.
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


        } catch (error) {
            console.error("Error loading level: ", error);
        }
    }


    update(deltaTime) {

        // Breaking and deleting blocks.
        this.wobjs.forEach(obj => { obj.update(deltaTime); });

        if (typeof this.chopper !== 'undefined' && this.chopper.hp <= 0 && this.chopper.status !== CRASH) {
            this.reset_level();
        }

    }

    draw(ctx) {

        ctx.fillStyle = 'black'; // Draw a background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.wobjs.forEach(obj => { obj.draw(ctx); });

        // TODO: Draw other objects

    }
}
