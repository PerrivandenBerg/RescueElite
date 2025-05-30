// Perri van den Berg (2025)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Global variables.
var globalGravity = 9.8;

const world = new World();

let gameState = "menu"; // "menu" or "settings" or "game" or "paused" or "level_completed"
let lastState = "menu";

let levelScore = 0; // Used in the completion screen.

canvas.width = 800;
canvas.height = 400;

let levels = ["levels/exp_0.json", "levels/exp_1.json", "levels/exp_2.json", "levels/exp_3.json", "levels/exp_4.json", "levels/exp_5.json", "levels/exp_6.json", "levels/exp_7.json"]

function next_level() {

    endLevel();
    gameData.currentLevel++
    startDataLevel(levels[gameData.currentLevel]);
    if (gameData.currentLevel >= levels.length) {
        gameState = "game_completed";
        gameData.completedGame = true;
        return;
    }

    startGame(levels[gameData.currentLevel]);

}

// On mobile?
let mobileControlsEnabled = true;

function isMobile() {
    const isTouchCapable = navigator.maxTouchPoints > 1 || 'ontouchstart' in window;
    const isMobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    return ((isMobileAgent || isStandalone) && isTouchCapable);
}

function toggleMobileControls() {
    mobileControlsEnabled = !mobileControlsEnabled;
    const btn = buttons.find(b => b.id === "settings" && b.text.includes("Mobile Controls"));
    if (btn) {
        btn.text = `Mobile Controls: ${mobileControlsEnabled ? "On" : "Off"}`;
    }
}

// Fullscreen.
let isFullScreen = false;
let fullScreenSupported = false;
function toggleFullScreen() {
    let elem = document.documentElement;

    if (!isFullScreen) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => {
                isFullScreen = true;
            }).catch((err) => {
                console.warn("Fullscreen request failed:", err);
            });
        } else {
            console.warn("Fullscreen not supported on this device/browser.");
            window.alert("Fullscreen not supported on this device/browser.");
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                isFullScreen = false;
            }).catch((err) => {
                console.warn("Exiting fullscreen failed:", err);
            });
        }
    }
}

// Loads a level.
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
    } else if (gameState === "game" && event.key === "c") { // Capture the level.
        makeLevelCapture();
    }
});

const buttons = [
    { id: "menu", text: "START", x: canvas.width / 2 - 150, y: canvas.height - 85, width: 300, height: 75, action: () => { gameState = "level_selector" } },
    { id: "menu", text: "Fullscreen", x: canvas.width - 110, y: canvas.height - 60, width: 100, height: 50, action: () => toggleFullScreen() },
    { id: "menu", text: "Settings", x: canvas.width - 220, y: canvas.height - 60, width: 100, height: 50, action: () => gameState = "settings" },
    { id: "level_selector", text: "1", x: canvas.width / 2 - 200, y: canvas.height / 2 + 60, width: 40, height: 40, action: () => { gameData.currentLevel = 0; next_level() } },
    { id: "level_selector", text: "2", x: canvas.width / 2 - 140, y: canvas.height / 2 + 60, width: 40, height: 40, action: () => { gameData.currentLevel = 1; next_level() } },
    { id: "level_selector", text: "3", x: canvas.width / 2 - 80, y: canvas.height / 2 + 60, width: 40, height: 40, action: () => { gameData.currentLevel = 2; next_level() } },
    { id: "level_selector", text: "4", x: canvas.width / 2 - 20, y: canvas.height / 2 + 60, width: 40, height: 40, action: () => { gameData.currentLevel = 3; next_level() } },
    { id: "level_selector", text: "5", x: canvas.width / 2 + 40, y: canvas.height / 2 + 60, width: 40, height: 40, action: () => { gameData.currentLevel = 4; next_level() } },
    { id: "level_selector", text: "6", x: canvas.width / 2 + 100, y: canvas.height / 2 + 60, width: 40, height: 40, action: () => { gameData.currentLevel = 5; next_level() } },
    { id: "level_selector", text: "7", x: canvas.width / 2 + 160, y: canvas.height / 2 + 60, width: 40, height: 40, action: () => { gameData.currentLevel = 6; next_level() } },
    { id: "level_selector", text: "tutorial", x: canvas.width / 2 - 60, y: canvas.height / 2, width: 120, height: 40, action: () => { gameData.currentLevel = -1; next_level() } },
    { id: "level_selector", text: "Back", x: canvas.width - 110, y: canvas.height - 60, width: 100, height: 50, action: () => gameState = "menu" },
    { id: "level_completed", text: "Next Level", x: 310, y: 220, width: 200, height: 50, action: () => next_level() },
    { id: "level_completed", text: "Menu", x: canvas.width - 110, y: canvas.height - 60, width: 100, height: 50, action: () => { next_level(); gameState = "menu" } },
    { id: "paused", text: "Restart Level", x: canvas.width / 2 - 75, y: 150, width: 150, height: 50, action: () => { recordDeath(world.chopper.x, world.chopper.y, true); world.reset_level(); gameState = "game"; } },
    { id: "paused", text: "Menu", x: canvas.width / 2 - 75, y: 220, width: 150, height: 50, action: () => { gameState = "menu", endLevel(); } },
    { id: "paused", text: "Back", x: canvas.width - 110, y: canvas.height - 60, width: 100, height: 50, action: () => gameState = "game" },
    { id: "game", text: "Pause", x: canvas.width - 90, y: 10, width: 80, height: 50, action: () => gameState = "paused" },
    { id: "game", text: "Restart", x: canvas.width - 180, y: 10, width: 80, height: 50, action: () => { recordDeath(world.chopper.x, world.chopper.y, true); world.reset_level(); } },
    { id: "game", text: "Shoot", x: 30, y: canvas.height - 80, width: 70, height: 50, action: () => { world.chopper.shoot(); } },
    { id: "settings", text: "Fullscreen", x: canvas.width / 2 - 75, y: 120, width: 150, height: 50, action: () => toggleFullScreen() },
    { id: "settings", text: "Mobile Controls: On", x: canvas.width / 2 - 100, y: 190, width: 200, height: 50, action: () => toggleMobileControls() },
    { id: "settings", text: "Upload Level", x: canvas.width / 2 - 75, y: 260, width: 150, height: 50, action: () => load() },
    { id: "settings", text: "Back", x: canvas.width - 110, y: canvas.height - 60, width: 100, height: 50, action: () => gameState = "menu" },
    { id: "game_completed", text: "Menu", x: canvas.width / 2 - 75, y: 220, width: 150, height: 50, action: () => { gameState = "menu", endLevel(); } },
];

// Handle mouse clicks for menu buttons.
function handleInput(x, y) {
    for (let button of buttons) {
        if (button.id === gameState) {
            if (
                x >= button.x &&
                x <= button.x + button.width &&
                y >= button.y &&
                y <= button.y + button.height
            ) {
                button.action();
                break;
            }
        }
    }
}

// Mouse input.
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = x / rect.width * canvas.width;
    y = y / rect.height * canvas.height;
    handleInput(x, y);
});

// Touch input.
canvas.addEventListener("touchstart", (event) => {
    if (event.changedTouches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const touch = event.changedTouches[0];
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    x = x / rect.width * canvas.width;
    y = y / rect.height * canvas.height;
    handleInput(x, y);
}, { passive: true });

// Takes a full screen picture of the level grid.
function makeLevelCapture() {
    const levelX = world.level_x1;
    const levelY = world.level_y1;
    const levelWidth = world.level_x2 - world.level_x1;
    const levelHeight = world.level_y2 - world.level_y1;

    // High DPI factor.
    const dpiScale = 4;

    // Create an offscreen canvas.
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = levelWidth * dpiScale;
    exportCanvas.height = levelHeight * dpiScale;
    const exportCtx = exportCanvas.getContext("2d");

    exportCtx.imageSmoothingEnabled = false;
    exportCtx.scale(dpiScale, dpiScale);
    exportCtx.translate(-levelX, -levelY);

    // Draw all objects.
    exportCtx.fillStyle = colorData['background'];
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    world.wobjs.sort((a, b) => a.z - b.z);
    world.wobjs.forEach(obj => {
        if (typeof obj.draw === "function") {
            obj.draw(exportCtx);
        }
    });

    // Save the image.
    exportCanvas.toBlob(function (blob) {
        const link = document.createElement("a");
        link.download = "level_screenshot.png";
        link.href = URL.createObjectURL(blob);
        link.click();
    }, "image/png");
}



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



function renderGameCompleted() {

    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Completed!", canvas.width / 2, 80);


    // Credits
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Contact info: s2912457@vuw.leidenuniv.nl", 10, canvas.height - 10);
    ctx.fillText("Created by Perri van den Berg", 10, canvas.height - 34);
    ctx.fillText("Based on the game Fort Apocalypse", 10, canvas.height - 22);
    ctx.textAlign = "center";


    // Text
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Thank you for participating", canvas.width / 2, 125);

    // Buttons
    for (let button of buttons) {
        if (button.id === "game_completed") {
            ctx.font = "20px Arial";
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
let sprite_timer = 0;
function renderMenu(deltaTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = "#4BB";
    ctx.shadowBlur = 20;
    ctx.fillText("Rescue Elite", canvas.width / 2, 100);
    ctx.shadowBlur = 0; // Reset shadow

    // Credits
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Contact info: s2912457@vuw.leidenuniv.nl", 10, canvas.height - 10);
    ctx.fillText("Created by Perri van den Berg", 10, canvas.height - 34);
    ctx.fillText("Based on the game Fort Apocalypse", 10, canvas.height - 22);
    ctx.textAlign = "center";

    // Buttons
    for (let button of buttons) {
        if (button.id === gameState && (button.text === "START" || button.text === "CONTINUE")) {
            ctx.font = "50px Arial";
            ctx.fillStyle = "#4BB";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#fff";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + 55);
        } else if (button.id === gameState) {
            ctx.font = "20px Arial";
            ctx.fillStyle = "#4BB";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#fff";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + 32);
        }
    }

    // Right side animated chopper
    const chopperX = canvas.width - 150;
    const chopperY = 130;
    sprite_timer += deltaTime * 10.0;
    if (sprite_timer >= 2)
        sprite_timer = 0;
    ctx.imageSmoothingEnabled = false;
    let sprite_chopper = load_sprite("chopper_side_fast_" + (sprite_timer >= 1 ? 1 : 2) + "_flip.png");
    tint_image(ctx, sprite_chopper, colorData['player'], chopperX, chopperY, 4, 4);
}


// Renders the level selector.
function renderLevelSelector() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Level Selector", canvas.width / 2, 40);

    // Buttons
    for (let button of buttons) {
        if (button.id === gameState) {
            ctx.fillStyle = "#4BB";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#fff";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + 32);
        }
    }
}


// Renders the settings menu.
function renderSettings() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Settings", canvas.width / 2, 40);

    ctx.font = "20px Arial";
    for (let button of buttons) {
        if (button.id === gameState) {
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
    endLevel();
    gameState = "level_completed";
    levelScore = score;
    world.clear();
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
    const level = gameData.levels[gameData.levels.length - 1];

    ctx.fillText("Level Complete!", canvas.width / 2, 100);

    ctx.font = "16px Arial";
    ctx.fillText("People Rescued: " + level.rescued + "/" + world.max_persons, canvas.width / 2, 130);
    ctx.fillText("Enemies Defeated: " + level.enemiesKilled, canvas.width / 2, 150);
    ctx.fillText("Death Count: " + level.deaths.length, canvas.width / 2, 170);
    ctx.fillText("Time: " + Math.round(level.playtime / 100) / 10 + "s", canvas.width / 2, 190);

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

function render(deltaTime) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "menu") {
        renderMenu(deltaTime);
    } else if (gameState === "level_selector") {
        renderLevelSelector();
    } else if (gameState === "game_completed") {
        renderGameCompleted();
    } else if (gameState === "settings") {
        renderSettings();
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
                    if (!mobileControlsEnabled && button.text === "Shoot")
                        continue;
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
        mobileControlsEnabled = !isMobile();
        gameData.isOnMobile = mobileControlsEnabled;
        toggleMobileControls();
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
    let offCtx = offCanvas.getContext("2d", { willReadFrequently: true, alpha: true, premultipliedAlpha: false });

    offCtx.drawImage(image, 0, 0);
    let imageData = offCtx.getImageData(0, 0, image.width, image.height);
    let data = imageData.data;
    let new_rgb = color_to_rgb(color);


    for (let i = 0; i < data.length; i += 4) {
        let alpha = data[i + 3];
        const tolerance = 10;
        if ((tolerance + data[i]) % 255 <= tolerance * 2 &&
            (tolerance + data[i + 1]) % 255 <= tolerance * 2 &&
            (tolerance + data[i + 2]) % 255 <= tolerance * 2) {
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
function tint_image(ctx, image, color, x, y, xscale = 1, yscale = 1) {
    let tintedImage = getTintedImage(image, color);
    ctx.drawImage(tintedImage, x, y, tintedImage.width * xscale, tintedImage.height * xscale);
}

let accumulator = 0;
let lastTime = 0;
const fixedDelta = 1 / 60; // 60 updates per second

function gameLoop(currentTime) {
    currentTime /= 1000; // Convert to seconds
    let deltaTime = currentTime - lastTime || 0;
    if (deltaTime > 0.25) deltaTime = 0.25; // Avoid spiral of death
    lastTime = currentTime;

    accumulator += deltaTime;

    // Run game logic in fixed steps (multiple if needed)
    while (accumulator >= fixedDelta) {
        update(fixedDelta); // Fixed-step update
        accumulator -= fixedDelta;
    }

    render(deltaTime); // Always render at full refresh rate
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
