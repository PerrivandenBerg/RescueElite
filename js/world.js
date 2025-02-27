// Perri van den Berg (2025)

const SIZE = 32;

var BUTTON_PRESSED = -1;
var COLORS = { "0": "blue", "1": "red" };

class World {
    constructor() {
        this.curr_world = "";
        this.chopper = new Chopper();
        this.walls = [];
        this.doors = [];
        this.breaks = [];
        this.buttons = [];
        this.platforms = [];
        this.last_level_loaded = "";
        // this.chopper.reset();
        // this.chopper.set_position(100, 100);
        // this.walls = [];
        // this.keys = [];
        // this.hearts = [];
        // if (!this.load_level_from_url())
        //     this.load_from_file("w1");

        this.load_from_file("../levels/level.json");
    }

    reset_level() {
        this.load_from_file(this.last_level_loaded);
    }

    load_test_level() {
        BUTTON_PRESSED = -1;
        this.chopper.reset();
        this.chopper.set_position(50, 50);
        this.walls = [new Wall(100, 100), new Wall(150, 100)];
        this.doors = [new Door(50, 120, 0), new Door(50, 128, 0)];
        this.breaks = [new Break(100, 128)];
        this.platforms = [new Platform(200, 100), new Platform(280, 100)];
        this.buttons = [new Button(284, 92, 0)];
    }

    // Loads the world from JSON formatting in a given file.
    async load_from_file(filename) {
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to load world file: ${filename}`);
            }
            let text = await response.text()
            let data = JSON.parse(text);

            BUTTON_PRESSED = -1;
            this.chopper.reset();
            this.chopper.set_position(data.chopper.x, data.chopper.y);

            this.walls = data.walls.map(obj => new Wall(obj.x, obj.y));
            this.doors = data.doors.map(obj => new Door(obj.x, obj.y, obj.id));
            this.breaks = data.breaks.map(obj => new Break(obj.x, obj.y));
            this.platforms = data.platforms.map(obj => new Platform(obj.x, obj.y));
            this.buttons = data.buttons.map(obj => new Button(obj.x, obj.y, 0));

            this.last_level_loaded = filename;

        } catch (error) {
            console.error("Error loading level: ", error);
        }
    }


    update(deltaTime) {

        // Breaking and deleting blocks.
        this.breaks.forEach(obj => { obj.update(deltaTime); });
        for (let b = 0; b < this.breaks.length; b++) {
            if (this.breaks[b].delete)
                this.breaks.splice(b, 1);
        }

        // Update others.
        this.chopper.update(deltaTime);

        this.walls.forEach(obj => {
            if (this.chopper.check_collision(obj))
                this.chopper.handle_collision(obj);
        });
        this.doors.forEach(obj => {
            if (this.chopper.check_collision(obj) && BUTTON_PRESSED !== obj.id) {
                this.chopper.handle_collision(obj);
            }
        });
        this.breaks.forEach(obj => {
            if (this.chopper.check_collision(obj))
                this.chopper.handle_collision(obj);
        });
        this.platforms.forEach(obj => {
            if (this.chopper.check_collision(obj))
                this.chopper.handle_collision(obj);
        });
        this.buttons.forEach(obj => {
            if (this.chopper.check_collision(obj))
                this.chopper.handle_collision(obj);
        });

        // Collision of chopper bullets, TODO: Improve!
        this.chopper.bullets.forEach(obj2 => {
            obj2.update(deltaTime);
            this.walls.forEach(obj => {
                if (obj2.check_collision(obj))
                    obj2.handle_collision(obj);
            });
            this.doors.forEach(obj => {
                if (obj2.check_collision(obj) && !obj.open) {
                    obj2.handle_collision(obj);
                }
            });
            this.breaks.forEach(obj => {
                if (obj2.check_collision(obj))
                    obj2.handle_collision(obj);
            });
            this.platforms.forEach(obj => {
                if (obj2.check_collision(obj))
                    obj2.handle_collision(obj);
            });

        });



        if (this.chopper.hp <= 0 && this.chopper.status !== CRASH) {
            this.reset_level();
        }

    }

    draw(ctx) {

        ctx.fillStyle = 'black'; // Draw a background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.walls.forEach(obj => { obj.draw(ctx); });
        this.doors.forEach(obj => { obj.draw(ctx); });
        this.breaks.forEach(obj => { obj.draw(ctx); });
        this.platforms.forEach(obj => { obj.draw(ctx); });
        this.buttons.forEach(obj => { obj.draw(ctx); });

        this.chopper.draw(ctx);

        // TODO: Draw other objects

    }
}
