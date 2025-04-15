// Perri van den Berg (2025)

// Joystick class for mobile movement control.
class Joystick {
    constructor(player) {

        this.player = player;

        this.active = false;
        this.baseX = 0;
        this.baseY = 0;
        this.stickX = 0;
        this.stickY = 0;
        this.radius = 40;
        this.stickRadius = 20;

        this.joystick_touch_id = null;

        this.controls = { left_right: 0, up_down: 0 };

        // Input from both touch screen and mouse input.
        document.addEventListener("touchstart", (e) => {
            for (let touch of e.changedTouches) {
                this.start(touch, true);
            }
            e.preventDefault(); // Prevent default scrolling
        }, { passive: false });

        document.addEventListener("touchmove", (e) => {
            for (let touch of e.changedTouches) {
                this.move(touch, true);
            }
            e.preventDefault();
        }, { passive: false });

        document.addEventListener("touchend", (e) => {
            for (let touch of e.changedTouches) {
                this.end(touch, true);
            }
            e.preventDefault();
        }, { passive: false });


        document.addEventListener("mousedown", (e) => this.start(e, false), false);
        document.addEventListener("mousemove", (e) => this.move(e, false), false);
        document.addEventListener("mouseup", (e) => this.end(e, false), false);
    }

    // Used to reset the level.
    set_player(player) {
        this.player = player;
    }

    // Start pressing the button and setting an initial position.
    start(input, check) {
        const rect = canvas.getBoundingClientRect();
        const x = input.clientX - rect.left;
        const y = input.clientY - rect.top;

        let screenWidth = canvas.width;
        let screenHeight = canvas.height;

        // Only activate if touch is in the bottom-right area.
        if (x < screenWidth / 2 || y < screenHeight * (1 / 3)) {
            return;
        }

        // If already tracking a touch, ignore new ones.
        if (this.joystick_touch_id !== null && check) return;

        this.joystick_touch_id = input.identifier;

        this.active = true;
        this.baseX = x;
        this.baseY = y;
        this.stickX = this.baseX;
        this.stickY = this.baseY;
    }

    // Moving the joystick while keeping the button pressed.
    move(input, check) {
        if (!this.active || (input.identifier !== this.joystick_touch_id && check)) return;
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

        // Determine control states.
        this.controls.left_right = dx / this.radius;
        this.controls.up_down = dy / this.radius;
    }

    // Stops moving the joystick and reset everything.
    end(input, check) {
        if (input.identifier !== this.joystick_touch_id && check) return;

        this.joystick_touch_id = null;
        this.active = false;
        this.controls = { left_right: 0, up_down: 0 };
        this.player.controls.left_right = this.controls.left_right;
        this.player.controls.up_down = this.controls.up_down;
    }

    update() {
        if (this.active) {
            this.player.controls.left_right = this.controls.left_right;
            this.player.controls.up_down = this.controls.up_down;
        }
    }

    draw(ctx) {
        // Draws the outer gray-ish circle and the inner white circle.
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
