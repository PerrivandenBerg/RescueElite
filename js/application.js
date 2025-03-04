// Perri van den Berg (2025)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Width and Height of the screen.
canvas.width = 800;
canvas.height = 400;

var globalGravity = 9.8;

let lastTime = 0;

const world = new World();

function update(deltaTime) {
    world.update(deltaTime);
}

function render() {

    ctx.save();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // Apply camera transformations
    ctx.translate(canvas.width / 2, canvas.height / 2); // Move camera to the center of screen
    ctx.scale(camera.zoom, camera.zoom); // Apply zoom
    ctx.translate(-camera.x, -camera.y); // Move camera to follow target
   // ctx.translate(-canvas.width / (2 * camera.zoom), -canvas.height / ( 2 * camera.zoom)); // Move camera to follow target

    world.draw(ctx);

    ctx.restore();
}

// Zoom in and out using the mouse wheel.
canvas.addEventListener("wheel", (event) => {
    camera.zoom *= event.deltaY > 0 ? 0.9 : 1.1; // Scroll to zoom
    camera.zoom = Math.max(0.5, Math.min(3, camera.zoom)); // Clamp zoom level
});

// Camera values.
const camera = {
    x: 0,  // Camera position (updated dynamically)
    y: 0,
    cx: 0, // Corner of the camera.
    cy: 0,
    zoom: 1.5,  // Set value
};

// Set the camera's x and y coords.
function set_camera(x, y) {
    camera.x = x;
    camera.y = y;
    camera.cx = x - canvas.width / (2 * camera.zoom);
    camera.cy = y - canvas.height / (2 * camera.zoom);
}

// Move camera to location.
const cameraSpeed = 0.1;
function update_camera(x, y) {
    camera.x += (x - camera.x - canvas.width / (2 * camera.zoom)) * cameraSpeed;
    camera.y += (y - camera.y - canvas.height / (2 * camera.zoom)) * cameraSpeed;
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

// Convert hex colors to RGB.
function hex_to_rgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// Function to convert color names or hex to RGB.
function color_to_rgb(color) {
    let ctxTemp = document.createElement("canvas").getContext("2d");
    ctxTemp.fillStyle = color;
    return hex_to_rgb(ctxTemp.fillStyle);
}

// Tints an image smoothly, preserving transparency.
function tint_image(ctx, image, color, x, y) {
    let off = document.createElement("canvas");
    off.width = image.width;
    off.height = image.height;
    let ctx2 = off.getContext("2d");

    // Draw original image.
    ctx2.drawImage(image, 0, 0);

    // Get image data.
    let imageData = ctx2.getImageData(0, 0, image.width, image.height);
    let data = imageData.data;

    let new_rgb = color_to_rgb(color);

    for (let i = 0; i < data.length; i += 4) {
        let alpha = data[i + 3] / 255; // Normalize alpha to 0-1

        // Blend only if the pixel is not fully transparent.
        if (alpha > 0) {
            data[i] = Math.round(data[i] * (1 - alpha) + new_rgb.r * alpha);
            data[i + 1] = Math.round(data[i + 1] * (1 - alpha) + new_rgb.g * alpha);
            data[i + 2] = Math.round(data[i + 2] * (1 - alpha) + new_rgb.b * alpha);
        }
    }

    // Put modified image data back to canvas.
    ctx2.putImageData(imageData, 0, 0);

    // Draw onto the main canvas.
    ctx.drawImage(off, x, y);
}


function gameLoop(time) {
    let deltaTime = (time - lastTime) / 1000; // Convert ms to seconds.
    lastTime = time;
    update((deltaTime || 0));
    render();
    requestAnimationFrame(gameLoop);
}
// Loads all the sprites at the start for smoother gameplay.
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
    "button_on.png", "button_off.png",
    "person_1.png", "person_2.png", "person_1_flip.png", "person_2_flip.png",
    "drone.png", "drone_flip.png",
    "rocket.png", "rocket_flip.png",
    "tank.png", "tank_flip.png",
    "fuel_station.png"]);
