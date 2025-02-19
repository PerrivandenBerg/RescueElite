// Perri van den Berg (2025)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let lastTime = 0;

const world = new World();

const key_board = {};
window.addEventListener("keydown", (e) => key_board[e.key] = true);
window.addEventListener("keyup", (e) => key_board[e.key] = false);

function update(deltaTime) {
    world.update(key_board, deltaTime);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white'; // Set the color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw a white rectangle that covers the whole canvas
    world.draw(ctx);
}

function gameLoop(time) {
    let deltaTime = (time - lastTime) / 1000; // Convert ms to seconds
    lastTime = time;
    update(deltaTime);
    render();
    requestAnimationFrame(gameLoop);
}
gameLoop();
