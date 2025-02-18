// Perri van den Berg (2025)

const SIZE = 32;

class World {
    constructor() {
        this.curr_world = "";
        this.player = new Player();
        this.walls = [];
        this.doors = [];
        this.keys = [];
        this.hearts = [];
        this.load_from_file("w1");
    }

    async load_from_file(filename) {
        try {
            const response = await fetch(`worlds/${filename}.world`);
            if (!response.ok) {
                throw new Error(`Failed to load world file: ${filename}`);
            }

            this.curr_world = filename;

            const text = await response.text();
            const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            // Read first line (world properties)
            const [width, height, playerSlots] = lines[0].split(' ').map(Number);
            this.width = width;
            this.height = height;
            this.playerSlots = playerSlots;

            this.player.reset();
            this.player.set_inventory_size(playerSlots);

            this.walls = [];
            this.keys = [];
            this.doors = [];
            this.hearts = [];

            // Parse the map layout
            for (let y = 0; y < height; y++) {
                const cells = lines[y + 1].split(' '); // Skip the first line

                for (let x = 0; x < width; x++) {
                    const cell = cells[x];
                    const posX = x * SIZE;
                    const posY = y * SIZE;

                    if (cell === "##") {
                        this.walls.push(new Wall(posX, posY));
                    } else if (cell === "hh") {
                        this.hearts.push(new Heart(posX, posY));
                    } else if (cell.startsWith("k")) {
                        const keyId = parseInt(cell.substring(1), 10);
                        this.keys.push(new Key(posX, posY, keyId));
                    } else if (cell.startsWith("d")) {
                        const doorId = parseInt(cell.substring(1), 10);
                        this.doors.push(new Door(posX, posY, doorId));
                    } else if (cell === "pp") {
                        this.player.set_position(posX, posY);
                    }
                }
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    update(key_board) {

        // Handle inputs.
        if (key_board['h'])
            this.load_from_file("w1");
        if (key_board['j'])
            this.load_from_file("w2");
        if (key_board['k'])
            this.load_from_file("w3");
        if (key_board['r'])
            this.load_from_file(this.curr_world);


        // Update others.
        this.player.update(key_board);

        this.walls.forEach(wall => {
            if (this.player.check_collision(wall))
                this.player.handle_collision(wall);
        });
        this.doors.forEach(door => {
            if (this.player.check_collision(door))
                this.player.handle_collision(door);
        });
        this.keys.forEach(key => {
            if (this.player.check_collision(key))
                this.player.handle_collision(key);
        });
        this.hearts.forEach(heart => {
            if (this.player.check_collision(heart))
                this.player.handle_collision(heart);
        });
    }

    draw(ctx) {
        this.walls.forEach(wall => { wall.draw(ctx); });
        this.doors.forEach(door => { door.draw(ctx); });
        this.keys.forEach(key => { key.draw(ctx); });
        this.hearts.forEach(heart => { heart.draw(ctx); });

        this.player.draw(ctx);

        // TODO: Draw other objects

    }
}

console.log("world loaded")