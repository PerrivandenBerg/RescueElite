// Perri van den Berg (2025)

var BUTTON_PRESSED = -1; // The current button that is pressed.
var COLORS = { "0": colorData['button0'], "1": colorData['button1'], "2": colorData['button2'], "3": colorData['button3'] }; // The different colors of doors/buttons.

const CAMERA_SPEED = 0.1;

// This class holds the information about a level and updates/draws any object in it.
class World {
    constructor(level = "") {

        this.cman = new CollisionManager(); // Manages the collision.
        this.wobjs = [];  // Contains all the world objects.

        this.chopper; // The player object, also stored in the list.

        // The corners of the world.
        this.level_x1 = canvas.width * 10; // Just a high number
        this.level_y1 = canvas.height * 10;
        this.level_x2 = 0;
        this.level_y2 = 0;

        this.max_persons = 0;

        this.data_copy; // Used to restart a(n imported) level.

        this.level_loop_x = false;

        this.curr_world = "";

        if (level === "")
            this.load_from_file("levels/chopper_training.json"); // Load level to play test.
        else
            this.load_from_file(level); // Load level to play test.


        // Camera values.
        this.camera = {
            x: 0,  // Camera position (updated dynamically)
            y: 0,
            cx: 0, // Corner of the camera.
            cy: 0,
            zoom: 2.5,  // Set value
            loop_x: false  // Set value
        };

        // Screen overlay.
        this.overlay = new Overlay(this, this.chopper);


        // Zoom in and out using the mouse wheel.
        canvas.addEventListener("wheel", (event) => {
            this.camera.zoom *= event.deltaY > 0 ? 0.9 : 1.1; // Scroll to zoom
            this.camera.zoom = Math.max(0.5, Math.min(3, this.camera.zoom)); // Clamp zoom level
            this.clamp_camera()
        });

    }


    // Set the camera's x and y coords.
    set_camera(x, y) {
        this.camera.x = x;
        this.camera.y = y;
        this.camera.cx = x - canvas.width / (2 * this.camera.zoom);
        this.camera.cy = y - canvas.height / (2 * this.camera.zoom);
        this.clamp_camera()
    }

    // Move camera to location.
    update_camera(x, y) {
        this.camera.x += (x - this.camera.x - canvas.width / (2 * this.camera.zoom)) * CAMERA_SPEED;
        this.camera.y += (y - this.camera.y - canvas.height / (2 * this.camera.zoom)) * CAMERA_SPEED;
        this.clamp_camera()
    }

    // Clamp the camera position so it does not go outside the level
    clamp_camera() {
        const halfWidth = canvas.width / (2 * this.camera.zoom);
        const halfHeight = canvas.height / (2 * this.camera.zoom);

        if (this.camera.loop_x === false)
            this.camera.x = Math.max(this.level_x1 + halfWidth, Math.min(this.level_x2 - halfWidth, this.camera.x));
        this.camera.y = Math.max(this.level_y1 + halfHeight, Math.min(this.level_y2 - halfHeight, this.camera.y));

        // Update corner positions
        this.camera.cx = this.camera.x - halfWidth;
        this.camera.cy = this.camera.y - halfHeight;
    }

    // Resets the level. (eg. When the player dies)
    reset_level() {
        this.import_json(this.data_copy);
    }

    // Clears all the variables and makes an empty level.
    clear() {
        this.cman.reset();
        this.wobjs = [];
        this.camera = { x: 0, y: 0, cx: 0, cy: 0, zoom: 2.5, loop_x: false, };
        this.level_x1 = canvas.width * 10; // Just a high number
        this.level_y1 = canvas.height * 10;
        this.level_x2 = 0;
        this.level_y2 = 0;
    }

    // Loads the world from JSON formatting in a given file.
    // NOTE: The JSON must contain all the different elements of a level.
    async load_from_file(filename) {
        this.clear();
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to load world file: ${filename}`);
            }
            let text = await response.text()
            let data = JSON.parse(text);
            this.import_json(data);

        } catch (error) {
            console.error("Error loading level: ", error);
        }
    }

    import_json(data) {

        this.data_copy = data; // Copies data for restarts.

        this.cman.reset();
        this.wobjs = [];

        this.max_persons = 0;

        BUTTON_PRESSED = -1;
        this.chopper = new Chopper(data.chopper.x, data.chopper.y, this.cman, this.wobjs);

        this.overlay.set_player(this.chopper);

        data.walls.forEach(obj => new Wall(obj.x, obj.y, this.cman, this.wobjs));
        data.doors.forEach(obj => new Door(obj.x, obj.y, obj.id, this.cman, this.wobjs));
        data.breaks.forEach(obj => new Break(obj.x, obj.y, this.cman, this.wobjs));
        data.platforms.forEach(obj => new Platform(obj.x, obj.y, this.cman, this.wobjs));
        data.buttons.forEach(obj => new Button(obj.x, obj.y, obj.id, this.cman, this.wobjs));
        data.tanks.forEach(obj => new Tank(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
        data.drones.forEach(obj => new Drone(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
        data.enemy_choppers.forEach(obj => new EnemyChopper(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
        data.persons.forEach(obj => { new Person(obj.x, obj.y, this.cman, this.wobjs, this.chopper); this.max_persons++; });
        data.fuel_stations.forEach(obj => new FuelStation(obj.x, obj.y, this.cman, this.wobjs, this.chopper));
        data.exits.forEach(obj => new Exit(obj.x, obj.y, this.cman, this.wobjs));
        data.hearts.forEach(obj => new Heart(obj.x, obj.y, this.cman, this.wobjs, this.chopper));

        this.level_loop_x = data.level_loop_x ? data.level_loop_x : false;
        this.camera.loop_x = this.level_loop_x;
        this.camera.zoom = 2.5;
        this.set_camera(this.chopper.x, this.chopper.y);

        for (var obj in this.wobjs) {
            if (this.wobjs[obj] && !(this.wobjs[obj] instanceof Exit)) {
                this.level_x1 = Math.min(this.level_x1, this.wobjs[obj].x);
                this.level_y1 = Math.min(this.level_y1, this.wobjs[obj].y);
                this.level_x2 = Math.max(this.level_x2, this.wobjs[obj].x + this.wobjs[obj].width);
                this.level_y2 = Math.max(this.level_y2, this.wobjs[obj].y + this.wobjs[obj].height);
            }
        }
    }


    update(deltaTime) {

        if (this.chopper)
            world.set_camera(this.chopper.x + this.chopper.width / 2, this.chopper.y + this.chopper.height / 2);

        if (this.camera.loop_x) {
            // Loop around all objects.
            let level_width = (this.level_x2 - this.level_x1);
            let off_max_x = this.chopper.x + level_width / 2;
            let off_min_x = this.chopper.x - level_width / 2;

            for (var obj in this.wobjs) {
                if (!(this.wobjs[obj] instanceof Chopper)) {
                    if (this.wobjs[obj].x > off_max_x)
                        this.wobjs[obj].move(this.wobjs[obj].x - level_width, this.wobjs[obj].y);
                    if (this.wobjs[obj].x < off_min_x)
                        this.wobjs[obj].move(this.wobjs[obj].x + level_width, this.wobjs[obj].y);
                }
            }
        }

        // Updates all the objects in the level.
        for (var obj in this.wobjs) {
            this.wobjs[obj].update(deltaTime);
        }

        if (typeof this.chopper !== 'undefined' && ((this.chopper.hp <= 0 && this.chopper.status !== CRASH) || this.chopper.hp < 0)) {
            this.reset_level(); // Restarts the level if the player died.
        }

        this.overlay.update();

    }

    draw(ctx) {

        ctx.save();

        // Apply camera transformations
        ctx.translate(canvas.width / 2, canvas.height / 2); // Move camera to the center of screen
        ctx.scale(world.camera.zoom, world.camera.zoom); // Apply zoom
        ctx.translate(-world.camera.x, -world.camera.y); // Move camera to follow target
        // ctx.translate(-canvas.width / (2 * camera.zoom), -canvas.height / ( 2 * camera.zoom)); // Move camera to follow target

        ctx.fillStyle = colorData['background'];
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        this.wobjs.sort((a, b) => a.z - b.z);
        this.wobjs.forEach(obj => obj.draw(ctx));

        ctx.restore();

        this.overlay.draw(ctx);
    }
}
