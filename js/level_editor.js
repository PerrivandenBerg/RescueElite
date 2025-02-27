class LevelEditor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d", { alpha: false });
        this.ctx.imageSmoothingEnabled = false;
        this.gridSize = 8;
        this.objects = { chopper: null, walls: [], doors: [], breaks: [], platforms: [], buttons: [] };
        this.selectedType = "wall";
        this.init_ui();
        this.canvas.addEventListener("click", (e) => this.place_object(e));
        this.draw();
    }

    init_ui() {
        const controls = document.createElement("div");
        controls.style.marginTop = "10px";
        controls.innerHTML = `
            <button onclick="editor.select_type('chopper')">Chopper</button>
            <button onclick="editor.select_type('wall')">Wall</button>
            <button onclick="editor.select_type('door')">Door</button>
            <button onclick="editor.select_type('break')">Breakable</button>
            <button onclick="editor.select_type('platform')">Platform</button>
            <button onclick="editor.select_type('button')">Button</button>
            <button onclick="editor.save_level()">Save</button>
            <input type="file" id="fileInput" />
            <button onclick="editor.load_from_file()">Load</button>
        `;
        document.body.appendChild(controls);
        document.getElementById("fileInput").addEventListener("change", (e) => this.loadFromFile(e));
    }

    select_type(type) {
        this.selectedType = type;
    }

    place_object(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = Math.floor((event.clientX - rect.left) / this.gridSize) * this.gridSize;
        let y = Math.floor((event.clientY - rect.top) / this.gridSize) * this.gridSize;

        if (this.selectedType === "chopper") {
            this.objects.chopper = { x, y };
        } else {
            let list = this.objects[this.selectedType + "s"];
            let index = list.findIndex(obj => obj.x === x && obj.y === y);
            if (index > -1) {
                list.splice(index, 1);
            } else {
                list.push({ x, y, id: this.selectedType === "door" ? Date.now() : undefined });
            }
        }
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw_grid();

        if (this.objects.chopper) this.draw_rect(this.objects.chopper, 32, 18, "blue");
        this.objects.walls.forEach(w => this.draw_rect(w, 8, 8, "gray"));
        this.objects.doors.forEach(d => this.draw_rect(d, 8, 8, "brown"));
        this.objects.breaks.forEach(b => this.draw_rect(b, 8, 8, "red"));
        this.objects.platforms.forEach(p => this.draw_rect(p, 48, 8, "green"));
        this.objects.buttons.forEach(b => this.draw_rect(b, 40, 8, "orange"));
    }

    draw_grid() {
        this.ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            for (let y = 0; y < this.canvas.height; y += this.gridSize) {
                this.ctx.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }
    }

    draw_rect(obj, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(obj.x, obj.y, width, height);
    }

    save_level() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.objects));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "level.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }

    async load_from_file(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.objects = JSON.parse(e.target.result);
                this.draw();
            } catch (error) {
                console.error("Error loading level: ", error);
            }
        };
        reader.readAsText(file);
    }
}

const editor = new LevelEditor("gameCanvas");
