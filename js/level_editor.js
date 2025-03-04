// Perri van den Berg (2025)

// Used to create levels.
// TODO: Finish and improve + Comments.
class LevelEditor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d", { alpha: false });
        this.ctx.imageSmoothingEnabled = false;
        this.grid_size_x = 8;
        this.grid_size_y = 8;

        this.width = 800;
        this.height = 600;

        this.old_x; // Used to draw smoothly.
        this.old_y;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.zoom = 5;
        this.xoff = 0;
        this.yoff = 0;

        this.memory = []; // Stores the level memory for undo.

        this.objects = { chopper: null, walls: [], doors: [], breaks: [], platforms: [], buttons: [], tanks: [], drones: [], enemy_choppers: [], fuel_stations: [], persons: [], exits: [] };
        this.selected_type = "normal";
        this.selected_item = "wall";
        this.is_placing = false;


        // Manages all button inputs.
        this.canvas.addEventListener("mousedown", (e) => this.start_placing(e));
        this.canvas.addEventListener("mousemove", (e) => this.place_object(e));
        this.canvas.addEventListener("mouseup", () => this.stop_placing());
        document.addEventListener("wheel", (e) => this.zoom_canvas(e));

        document.getElementById("brush-normal").addEventListener("click", () => this.select_type("normal"));
        document.getElementById("brush-fill").addEventListener("click", () => this.select_type("fill"));

        document.getElementById("item-erase").addEventListener("click", () => this.select_item("erase"));
        document.getElementById("item-wall").addEventListener("click", () => this.select_item("wall"));
        document.getElementById("item-chopper").addEventListener("click", () => this.select_item("chopper"));
        document.getElementById("item-door").addEventListener("click", () => this.select_item("door"));
        document.getElementById("item-break").addEventListener("click", () => this.select_item("break"));
        document.getElementById("item-tank").addEventListener("click", () => this.select_item("tank"));
        document.getElementById("item-drone").addEventListener("click", () => this.select_item("drone"));
        document.getElementById("item-enemy-chopper").addEventListener("click", () => this.select_item("enemy_chopper"));
        document.getElementById("item-platform").addEventListener("click", () => this.select_item("platform"));
        document.getElementById("item-button").addEventListener("click", () => this.select_item("button"));
        document.getElementById("item-fuel-station").addEventListener("click", () => this.select_item("fuel_station"));
        document.getElementById("item-person").addEventListener("click", () => this.select_item("person"));
        document.getElementById("item-exit").addEventListener("click", () => this.select_item("exit"));

        document.getElementById("undo-button").addEventListener("click", () => this.undo());
        document.getElementById("save-button").addEventListener("click", () => this.save());
        document.getElementById("load-button").addEventListener("click", () => this.load());
        document.getElementById("reset-button").addEventListener("click", () => this.reset());

        window.addEventListener('keydown', e => this.key_press_handler(e));

        this.draw();
    }

    // Undos the last move(s) on the screen.
    undo() {
        let tmp = this.memory.pop();
        if (typeof tmp !== 'undefined') {
            this.objects = tmp;
            this.draw();
        }
        else
            this.reset();
    }

    // Resets the level.
    reset() {
        this.memory = [];
        this.objects = { chopper: null, walls: [], doors: [], breaks: [], platforms: [], buttons: [], tanks: [], drones: [], enemy_choppers: [], fuel_stations: [], persons: [], exits: [] };;
        this.draw();
    }


    key_press_handler(e) {
        var evtobj = e;
        console.log("key: ", evtobj.keyCode);
        if (evtobj.ctrlKey && evtobj.keyCode == 90) // Undo
            this.undo();
        if (evtobj.ctrlKey && evtobj.keyCode == 83) // Save
            this.safe();
    }

    // Loads a level.
    async load() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json"; // Accept JSON files only
        input.style.display = "none";

        input.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    this.objects = JSON.parse(e.target.result);
                    this.draw();
                } catch (error) {
                    console.error("Error loading level: ", error);
                    alert("Invalid file format. Please upload a valid level file.");
                }
            };

            reader.readAsText(file);
        });

        input.click();
    }

    // Saves and downloads the level.
    save() {
        const data_str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.objects));
        const download_anchor = document.createElement("a");
        download_anchor.setAttribute("href", data_str);
        download_anchor.setAttribute("download", "level.json");
        document.body.appendChild(download_anchor);
        download_anchor.click();
        document.body.removeChild(download_anchor);
    }

    // Helper function to change type.
    select_type(type) {
        this.selected_type = type;
    }

    // Helper function to change item.
    select_item(type) {
        this.selected_item = type;
    }

    // Zoom in and out.
    zoom_canvas(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouse_x = event.clientX - rect.left;
        const mouse_y = event.clientY - rect.top;

        const world_x = (mouse_x - this.canvas.width / 2) / this.zoom + this.xoff;
        const world_y = (mouse_y - this.canvas.height / 2) / this.zoom + this.yoff;

        this.zoom *= event.deltaY > 0 ? 0.9 : 1.1;
        this.zoom = Math.max(0.5, Math.min(6, this.zoom)); // Clamp zoom

        this.xoff = world_x - (mouse_x - this.canvas.width / 2) / this.zoom;
        this.yoff = world_y - (mouse_y - this.canvas.height / 2) / this.zoom;

        this.draw();
    }

    start_placing(event) {
        if (this.is_placing === false)
            this.memory.push(structuredClone(this.objects));

        this.is_placing = true;
        this.place_object(event);
    }

    place_objects_line(x1, y1, x2, y2) {
        let list;
        if (this.selected_item !== "erase")
            list = this.objects[this.selected_item + "s"];

        let grid_x = this.grid_size_x;
        let grid_y = this.grid_size_y;

        let dx = x2 - x1;
        let dy = y2 - y1;

        let steps = Math.max(Math.abs(dx), Math.abs(dy)) * 2;

        let x_inc = dx / steps;
        let y_inc = dy / steps;

        let x = x1;
        let y = y1;

        // Loop to place objects along the line.
        for (let k = 0; k <= steps; k++) {
            let g_x = Math.floor(x / grid_x) * grid_x;
            let g_y = Math.floor(y / grid_y) * grid_y;

            // Place object if empty space.
            let newX = g_x;
            let newY = g_y;
            if (this.selected_item === "erase") {
                for (var key in this.objects) {
                    if (this.objects[key] !== null) {
                        if (key === "chopper") {
                            if (this.objects[key].x === newX && this.objects[key].y === newY)
                                this.objects[key] = null;
                        } else {
                            let index = this.objects[key].findIndex(obj => obj.x === newX && obj.y === newY);
                            if (index !== -1) {
                                this.objects[key].splice(index, 1); // Remove the object from the list
                            }
                        }
                    }
                }
            }
            else {
                if (list.findIndex(obj => obj.x === newX && obj.y === newY) === -1) {
                    if (this.selected_item === 'person')
                        newY -= 2;
                    list.push({ x: newX, y: newY, id: undefined });
                }
            }
            x += x_inc;
            y += y_inc;
        }

        this.draw();
    }

    place_objects_fill(x, y, range) {

        let list;
        if (this.selected_item !== "erase")
            list = this.objects[this.selected_item + "s"];

        let queue = [];
        let visited = new Set();

        queue.push([x, y]);
        visited.add(`${x},${y}`);

        // Start the filling process.
        while (queue.length > 0 && range > 0) {
            let [curr_x, curr_y] = queue.shift();
            let found = false;
            // Check if the current position already has an object.
            if (this.selected_item === "erase") {
                if (key === "chopper") {
                    this.objects[key] = null;
                } else {
                    for (var key in this.objects) {
                        if (this.objects[key] !== null) {
                            let index = this.objects[key].findIndex(obj => obj.x === curr_x && obj.y === curr_y);
                            if (index !== -1) {
                                this.objects[key].splice(index, 1);
                                found = true;
                            }
                        }
                    }
                }
            } else {
                let index = list.findIndex(obj => obj.x === curr_x && obj.y === curr_y);
                if (index === -1) {
                    // Add the new object to the list.
                    list.push({ x: curr_x, y: curr_y, id: undefined });
                    found = true;
                }
            }
            if (found) {
                // Check Right
                if (!visited.has(`${curr_x + this.grid_size_x},${curr_y}`)) {
                    queue.push([curr_x + this.grid_size_x, curr_y]);
                    visited.add(`${curr_x + this.grid_size_x},${curr_y}`);
                }

                // Check Left
                if (!visited.has(`${curr_x - this.grid_size_x},${curr_y}`)) {
                    queue.push([curr_x - this.grid_size_x, curr_y]);
                    visited.add(`${curr_x - this.grid_size_x},${curr_y}`);
                }

                // Check Down
                if (!visited.has(`${curr_x},${curr_y + this.grid_size_y}`)) {
                    queue.push([curr_x, curr_y + this.grid_size_y]);
                    visited.add(`${curr_x},${curr_y + this.grid_size_y}`);
                }

                // Check Up
                if (!visited.has(`${curr_x},${curr_y - this.grid_size_y}`)) {
                    queue.push([curr_x, curr_y - this.grid_size_y]);
                    visited.add(`${curr_x},${curr_y - this.grid_size_y}`);
                }

            }
            range--;
        }
    }

    place_object(event) {
        if (!this.is_placing) return;
        const rect = this.canvas.getBoundingClientRect();

        // Get position on screen.
        const mouse_x = event.clientX - rect.left;
        const mouse_y = event.clientY - rect.top;

        const world_x = (mouse_x - this.canvas.width / 2) / this.zoom + this.xoff;
        const world_y = (mouse_y - this.canvas.height / 2) / this.zoom + this.yoff;

        // Snap to the grid.
        let x = Math.floor(world_x / this.grid_size_x) * this.grid_size_x;
        let y = Math.floor(world_y / this.grid_size_y) * this.grid_size_y;

        if (this.selected_item == "chopper") {
            this.objects.chopper = { x, y };
        } else {

            if (this.selected_type === "fill" && this.selected_item === "wall") {
                this.place_objects_fill(x, y, 10000);
            } else {
                this.place_objects_line(x, y, this.old_x ? this.old_x : x, this.old_y ? this.old_y : y);
                this.old_x = x;
                this.old_y = y;
            }
        }
        this.draw();
    }

    stop_placing() {
        this.is_placing = false;
        this.old_x = null;
        this.old_y = null;
    }

    select_type(type) {
        this.selected_type = type;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(-this.xoff, -this.yoff);

        this.draw_grid();

        if (this.objects.chopper) this.draw_rect(this.objects.chopper, 32, 18, "#B8C76F");
        this.objects.walls.forEach(w => this.draw_rect(w, 8, 8, "purple"));
        this.objects.doors.forEach(d => this.draw_rect(d, 8, 8, "blue"));
        this.objects.breaks.forEach(b => this.draw_rect(b, 8, 8, "cyan"));
        this.objects.platforms.forEach(p => this.draw_rect(p, 48, 8, "white"));
        this.objects.buttons.forEach(b => this.draw_rect(b, 32, 8, "blue"));
        this.objects.drones.forEach(b => this.draw_rect(b, 8, 8, "red"));
        this.objects.tanks.forEach(b => this.draw_rect(b, 24, 16, "red"));
        this.objects.enemy_choppers.forEach(b => this.draw_rect(b, 32, 18, "red"));
        this.objects.fuel_stations.forEach(b => this.draw_rect(b, 48, 16, "lime"));
        this.objects.persons.forEach(b => this.draw_rect(b, 8, 10, "white"));
        this.objects.exits.forEach(b => this.draw_rect(b, 32, 32, "green"));

        this.ctx.restore();
    }


    draw_grid() {
        const { width, height } = this.canvas;

        this.ctx.strokeStyle = "rgba(200, 200, 200, 0.5)"; // Light grid color
        this.ctx.lineWidth = 0.5; // Thin grid lines

        // Draw grid lines.
        this.ctx.beginPath();
        for (let x = 0; x < width + 1; x += 8) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
        }
        for (let y = 0; y < height + 1; y += 8) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
        }
        this.ctx.stroke();
    }

    // Helper function to draw sprite.
    draw_rect(obj, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(obj.x, obj.y, width, height);
    }
}

const editor = new LevelEditor("gameCanvas");
