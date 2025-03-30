// Perri van den Berg (2025)

// Joystick class for mobile movement control.
class Joystick {
    constructor() {

        this.active = false;
        this.baseX = 0;
        this.baseY = 0;
        this.stickX = 0;
        this.stickY = 0;
        this.radius = 40;
        this.stickRadius = 20;

        this.controls = { left: false, right: false, up: false, down: false };

        document.addEventListener("touchstart", (e) => this.start(e.touches[0]), false);
        document.addEventListener("touchmove", (e) => this.move(e.touches[0]), false);
        document.addEventListener("touchend", () => this.end(), false);

        document.addEventListener("mousedown", (e) => this.start(e), false);
        document.addEventListener("mousemove", (e) => this.move(e), false);
        document.addEventListener("mouseup", () => this.end(), false);
    }



    start(input) {
        const rect = canvas.getBoundingClientRect();
        const x = input.clientX - rect.left;
        const y = input.clientY - rect.top;

        let screenWidth = canvas.width;
        let screenHeight = canvas.height;

        if (x < screenWidth / 2 || y < screenHeight * (1 / 3)) {
            return; // Only activate if touch is in the bottom-right area
        }

        this.active = true;
        this.baseX = x;
        this.baseY = y;
        this.stickX = this.baseX;
        this.stickY = this.baseY;

        console.log(this.stickX, this.stickY)
    }

    move(input) {
        if (!this.active) return;
        const rect = canvas.getBoundingClientRect();
        let x = input.clientX - rect.left;
        let y = input.clientY - rect.top;

        let dx = x - this.baseX;
        let dy = y - this.baseY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);

        if (distance > this.radius) {
            dx = Math.cos(angle) * this.radius;
            dy = Math.sin(angle) * this.radius;
        }

        this.stickX = this.baseX + dx;
        this.stickY = this.baseY + dy;

        // Determine control states
        this.controls.left = dx < -this.radius / 2;
        this.controls.right = dx > this.radius / 2;
        this.controls.up = dy < -this.radius / 2;
        this.controls.down = dy > this.radius / 2;
    }

    end() {
        this.active = false;
        this.controls = { left: false, right: false, up: false, down: false };
    }

    update(player) {
        player.controls.left = this.controls.left;
        player.controls.right = this.controls.right;
        player.controls.up = this.controls.up;
        player.controls.down = this.controls.down;
    }

    draw(ctx) {
        if (!this.active) {

            ctx.beginPath();
            ctx.arc(650, 300, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(650, 300, this.stickRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fill();
            ctx.closePath();

        } else {

            ctx.beginPath();
            ctx.arc(this.baseX, this.baseY, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.stickX, this.stickY, this.stickRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fill();
            ctx.closePath();
        }
    }
}
