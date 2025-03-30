// Perri van den Berg (2025)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Global variables.
var globalGravity = 9.8;

let lastTime = 0;

const world = new World();

let gameState = "menu"; // "menu" or "game" or "paused" or "level_select" or "next level" or "level_completed"

let levelScore = 0; // Used in the completion screen.

canvas.width = 800;
canvas.height = 400;


// Full screen.
document.getElementById("full-screen").addEventListener("click", () => full_screen());
function full_screen() {
    let elem = document.documentElement; // Fullscreen the entire window
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
    console.log(canvas.width);
}

// Loads a level.
document.getElementById("load-button").addEventListener("click", () => load());
async function load() {
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
                let data = JSON.parse(e.target.result);
                world.import_json(data);
                gameState = "game";
            } catch (error) {
                console.error("Error loading level: ", error);
                alert("Invalid file format. Please upload a valid level file.");
            }
        };

        reader.readAsText(file);
    });

    input.click();
}


function update(deltaTime) {
    if (gameState === "game")
        world.update(deltaTime);
}

// Start the game when "Play" is clicked
function startGame(level_name) {
    world.load_from_file(level_name);
    gameState = "game";
}

// Handle keyboard input for pausing and returning to menu.
document.addEventListener("keydown", (event) => {
    if (gameState === "game" && event.key === "Escape") {
        gameState = "paused"; // Pause the game
    } else if (gameState === "paused" && event.key === "Escape") {
        gameState = "game"; // Pause the game
    }
});


const buttons = [
    { id: "menu", text: "Play", x: canvas.width / 2 - 75, y: 150, width: 150, height: 50, action: () => gameState = "level_select" },
    { id: "menu", text: "Endless Mode Coming Soon...", x: canvas.width / 2 - 150, y: 220, width: 300, height: 50, action: () => { } },
    { id: "level_select", text: "Chopper Training", x: 90, y: 220, width: 200, height: 50, action: () => startGame("levels/chopper_training.json") },
    { id: "level_select", text: "First Rescue", x: 310, y: 220, width: 200, height: 50, action: () => startGame("levels/first_rescue.json") },
    { id: "level_select", text: "Final Extraction", x: 530, y: 220, width: 200, height: 50, action: () => startGame("levels/final_extraction.json") },
    { id: "level_select", text: "Back", x: 690, y: 340, width: 100, height: 50, action: () => gameState = "menu" },
    { id: "level_completed", text: "Level Select", x: 310, y: 220, width: 200, height: 50, action: () => gameState = "level_select" },
    { id: "level_completed", text: "Menu", x: 310, y: 290, width: 200, height: 50, action: () => gameState = "menu" },
    { id: "paused", text: "Resume", x: canvas.width / 2 - 75, y: 150, width: 150, height: 50, action: () => gameState = "game" },
    { id: "paused", text: "Restart Level", x: canvas.width / 2 - 75, y: 220, width: 150, height: 50, action: () => { world.reset_level(); gameState = "game"; } },
    { id: "paused", text: "Menu", x: canvas.width / 2 - 75, y: 290, width: 150, height: 50, action: () => gameState = "menu" },
    { id: "game", text: "Pause", x: canvas.width - 90, y: 10, width: 80, height: 50, action: () => gameState = "paused" },
    { id: "game", text: "Restart", x: canvas.width - 180, y: 10, width: 80, height: 50, action: () => { world.reset_level(); } },
    { id: "game", text: "Shoot", x: 30, y: canvas.height - 80, width: 70, height: 50, action: () => { world.chopper.shoot(); } }
];


// Handle mouse clicks for menu buttons.
canvas.addEventListener("click", (event) => {
    if (gameState === "menu" || gameState === "game" || gameState === "level_select" || gameState === "paused" || gameState === "level_completed") {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let button of buttons) {
            if (button.id === gameState)
                if (
                    mouseX >= button.x &&
                    mouseX <= button.x + button.width &&
                    mouseY >= button.y &&
                    mouseY <= button.y + button.height
                ) {
                    button.action();
                    break;
                }
        }
    }
});

function renderPaused() {

    // Background overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Paused", canvas.width / 2, 80);

    // Buttons
    ctx.font = "20px Arial";
    for (let button of buttons) {
        if (button.id === "paused") {
            ctx.fillStyle = "#4BB";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#fff";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + 32);
        }
    }
}

// Renders the menu.
function renderMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Rescue Elite", canvas.width / 2, 80);

    // Buttons
    ctx.font = "20px Arial";
    for (let button of buttons) {
        if (button.id === "menu") {
            ctx.fillStyle = "#4BB";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#fff";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + 32);
        }
    }
}

// Handle the level completion screen.
function global_complete_level(score) {
    world.clear();
    gameState = "level_completed";
    levelScore = score;
}

// Render the completion screen.
function renderLevelComplete() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title + Score
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Level Complete!", canvas.width / 2, 100);
    ctx.fillText("Score: " + levelScore, canvas.width / 2, 150);

    // Buttons
    ctx.font = "20px Arial";
    for (let button of buttons) {
        if (button.id === "level_completed") {
            ctx.fillStyle = "#4BB";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#fff";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + 32);
        }
    }
}

// Render the level select.
function renderLevelSelect() {

    // 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Select Level", canvas.width / 2, 80);

    // Buttons
    ctx.font = "20px Arial";
    for (let button of buttons) {
        if (button.id === "level_select") {
            ctx.fillStyle = "#4BB";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#fff";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + 32);
        }
    }
}


function render() {


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "menu") {
        renderMenu();
    } else if (gameState === "level_select") {
        renderLevelSelect();
    } else if (gameState === "level_completed") {
        renderLevelComplete();
    } else if (gameState === "game" || gameState === "paused") {

        world.draw(ctx);

        // If paused, draw the pause overlay
        if (gameState === "paused")
            renderPaused();
        else {
            // Buttons
            ctx.font = "20px Arial";
            for (let button of buttons) {
                if (button.id === "game") {
                    ctx.fillStyle = "#4BB";
                    ctx.fillRect(button.x, button.y, button.width, button.height);
                    ctx.strokeStyle = "#fff";
                    ctx.strokeRect(button.x, button.y, button.width, button.height);
                    ctx.fillStyle = "#fff";
                    ctx.fillText(button.text, button.x + button.width / 2, button.y + 32);
                }
            }
        }
    }
    ctx.restore();
}


// Returns the sprite or errors.
function load_sprite(path) {
    path = "sprites/" + path;
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
    path = "sprites/" + path;

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

// Cache for tinted images.
const tintCache = new Map();

// Transforms the image.
function getTintedImage(image, color) {
    const key = image.src + '|' + color; // Unique encoding.
    if (tintCache.has(key)) {
        return tintCache.get(key);
    }

    let offCanvas = document.createElement("canvas");
    offCanvas.width = image.width;
    offCanvas.height = image.height;
    let offCtx = offCanvas.getContext("2d");

    offCtx.drawImage(image, 0, 0);
    let imageData = offCtx.getImageData(0, 0, image.width, image.height);
    let data = imageData.data;
    let new_rgb = color_to_rgb(color);

    for (let i = 0; i < data.length; i += 4) {
        let alpha = data[i + 3];
        if (data[i] >= 250 && data[i + 1] >= 250 && data[i + 2] >= 250) {
            data[i] = new_rgb.r;
            data[i + 1] = new_rgb.g;
            data[i + 2] = new_rgb.b;
            data[i + 3] = alpha;
        }
    }

    offCtx.putImageData(imageData, 0, 0);
    tintCache.set(key, offCanvas); // Store in memory.
    return offCanvas;
}

// Changes the color and draws the sprite.
function tint_image(ctx, image, color, x, y) {
    let tintedImage = getTintedImage(image, color);
    ctx.drawImage(tintedImage, x, y);
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
