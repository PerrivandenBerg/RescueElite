// Perri van den Berg (2025)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

var SCALE = 1;

canvas.width = 400 * window.devicePixelRatio;
canvas.height = 200 * window.devicePixelRatio;
console.log(window.devicePixelRatio);
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

var gobalGravity = 9.8;

let lastTime = 0;

const world = new World();

function update(deltaTime) {
    world.update(deltaTime);
}

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    world.draw(ctx);
}


// Returns the sprite or errors.
function load_sprite(path) {
    path = "../sprites/" + path;
    if (sprite_storage[path]) {
        return sprite_storage[path];
    } else {
        console.error("Sprite not found:", path);
        return null;
    }
}

// Loads and caches a sprite
let sprite_storage = {};

async function store_sprite(path) {
    path = "../sprites/" + path;

    const sprite = new Image();
    sprite.src = path;

    // Return a promise that resolves when the sprite is loaded.
    return new Promise((resolve, reject) => {
        sprite.onload = () => {
            sprite_storage[path] = sprite;
            resolve(sprite);
        };

        sprite.onerror = (error) => {
            console.error("Error loading sprite:", path, error);
            reject(`Error loading sprite at ${path}`);
        };
    });
}

// Preloads all sprites
async function preload_sprites(paths) {
    try {
        // Using for...of to wait for each sprite to load sequentially
        for (const path of paths) {
            await store_sprite(path);  // Wait for each sprite to be loaded
        }
        console.log("All sprites loaded!");
        gameLoop();  // Start the game once all sprites are loaded
    } catch (error) {
        console.error("Failed to load some sprites:", error);
    }
}



// Tints an image to another color and draws it.
function tint_image(ctx, image, color, x, y) {
    let off = document.createElement("canvas");
    off.width = image.width;
    off.height = image.height;
    let ctx2 = off.getContext("2d");

    // Draw original image
    ctx2.drawImage(image, 0, 0);

    // Apply tint but keep transparency
    ctx2.globalCompositeOperation = "source-atop";
    ctx2.fillStyle = color;
    ctx2.fillRect(0, 0, image.width, image.height);
    ctx2.globalCompositeOperation = "destination-in"; // Keep original alpha
    ctx2.drawImage(image, 0, 0);

    ctx.globalCompositeOperation = "source-over"; // Reset composite mode

    ctx.drawImage(off, x, y, image.width, image.height);
}



function gameLoop(time) {
    let deltaTime = (time - lastTime) / 1000; // Convert ms to seconds
    lastTime = time;
    update((deltaTime || 0));
    render();
    requestAnimationFrame(gameLoop);
}

preload_sprites(["breakable.png",
    "chopper_front_1.png", "chopper_front_2.png",
    "chopper_side_fast_1.png", "chopper_side_fast_2.png",
    "chopper_side_fast_1_flip.png", "chopper_side_fast_2_flip.png",
    "chopper_side_med_1.png", "chopper_side_med_2.png",
    "chopper_side_med_1_flip.png", "chopper_side_med_2_flip.png",
    "chopper_side_idle_1.png", "chopper_side_idle_2.png",
    "chopper_side_idle_1_flip.png", "chopper_side_idle_2_flip.png",
    "door_closed.png", "door_open.png",
    "life.png",
    "platform.png",
    "button_on.png", "button_off.png"]);
