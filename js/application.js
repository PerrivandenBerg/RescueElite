// Perri van den Berg (2025)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const world = new World();

const key_board = {};
window.addEventListener("keydown", (e) => key_board[e.key] = true);
window.addEventListener("keyup", (e) => key_board[e.key] = false);

function update() {
    world.update(key_board);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white'; // Set the color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw a white rectangle that covers the whole canvas
    world.draw(ctx);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}
gameLoop();
