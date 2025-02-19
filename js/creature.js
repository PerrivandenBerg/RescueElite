class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
    }

    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }

    setMag(magnitude) {
        let length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length !== 0) {
            this.x = (this.x / length) * magnitude;
            this.y = (this.y / length) * magnitude;
        }
        return this;
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    static fromAngle(angle) {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
}

class Creature {
    constructor(x, y, sizes, segmentDistance, angleConstraint) {
        this.sizes = sizes; // Array of segment sizes
        this.segmentDistance = segmentDistance;
        this.angleConstraint = angleConstraint;
        this.joints = [];
        this.angles = [];

        this.joints.push(new Vector(x, y));
        this.angles.push(0);

        this.current_colors = new Array(sizes.length).fill("gray");  // Default color
        this.targetColor = "gray";
        this.colorTransitionTimers = new Array(sizes.length).fill(0);
        this.transitionSpeed = 0.02; // Speed of interpolation

        for (let i = 1; i < sizes.length; i++) {
            this.joints.push(this.joints[i - 1].add(new Vector(0, this.segmentDistance)));
            this.angles.push(0);
        }
    }

    move(targetX, targetY) {
        let targetPos = new Vector(targetX, targetY);

        // Move head
        this.joints[0] = targetPos.copy();

        // Move the rest of the body
        for (let i = 1; i < this.joints.length; i++) {
            let direction = this.joints[i].sub(this.joints[i - 1]).setMag(this.segmentDistance);
            this.joints[i] = this.joints[i - 1].add(direction);
        }
    }

    set_position(x, y) {
        this.joints[0] = new Vector(x, y);

        for (let i = 1; i < this.joints.length; i++) {
            let direction = Vector.fromAngle(Math.PI / 2).setMag(this.segmentDistance);
            this.joints[i] = this.joints[i - 1].add(direction);
        }
    }

    constrainAngle(curAngle, prevAngle, constraint) {
        let delta = curAngle - prevAngle;
        if (delta > constraint) delta = constraint;
        if (delta < -constraint) delta = -constraint;
        return prevAngle + delta;
    }

    getPosX(index, angleOffset, lengthOffset) {
        let joint = this.joints[index];
        let angle = this.angles[index] + angleOffset;
        return joint.x + Math.cos(angle) * (this.sizes[index] + lengthOffset);
    }

    getPosY(index, angleOffset, lengthOffset) {
        let joint = this.joints[index];
        let angle = this.angles[index] + angleOffset;
        return joint.y + Math.sin(angle) * (this.sizes[index] + lengthOffset);
    }

    set_color(newColor) {
        if (this.targetColor != newColor) {
            this.targetColor = newColor;
            this.colorTransitionTimers = this.colorTransitionTimers.map((_, i) => i * 0.01); // Delay per segment
        }
    }

    update(deltaTime) {
        for (let i = 0; i < this.joints.length; i++) {
            if (this.colorTransitionTimers[i] > 0) {
                this.colorTransitionTimers[i] -= deltaTime; // Countdown delay
                continue;
            }
            this.current_colors[i] = this.targetColor;
        }
    }

    draw(ctx) {
        // Draw outline.
        let width = 2;
        ctx.fillStyle = "black";
        for (let i = 0; i < this.joints.length; i++) {
            ctx.beginPath();
            ctx.arc(this.joints[i].x, this.joints[i].y, this.sizes[i] + width, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw body.
        for (let i = 0; i < this.joints.length; i++) {
            ctx.fillStyle = this.current_colors[i];
            ctx.beginPath();
            ctx.arc(this.joints[i].x, this.joints[i].y, this.sizes[i], 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw eyes.
        ctx.fillStyle = "white";
        let head = this.joints[0];  // First joint (head)
        let next = this.joints[1];  // Second joint to get direction
        let angle = Math.atan2(next.y - head.y, next.x - head.x); // Get head's rotation

        let eyeOffsetX = Math.cos(angle + Math.PI / 2) * this.sizes[0] * 0.5;
        let eyeOffsetY = Math.sin(angle + Math.PI / 2) * this.sizes[0] * 0.5;

        let eyeSize = this.sizes[0] * 0.3; // Scale eyes to head size

        // Left eye.
        ctx.beginPath();
        ctx.arc(head.x + eyeOffsetX, head.y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Right eye.
        ctx.beginPath();
        ctx.arc(head.x - eyeOffsetX, head.y - eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
    }



}