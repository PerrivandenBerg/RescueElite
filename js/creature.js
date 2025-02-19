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

    draw(ctx, color) {
        // Draw outline.
        ctx.save();
        let width = 2;
        ctx.fillStyle = "black";
        for (let i = 0; i < this.joints.length; i++) {
            ctx.beginPath();
            ctx.arc(this.joints[i].x, this.joints[i].y, this.sizes[i] + width, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw body.
        ctx.fillStyle = color;
        for (let i = 0; i < this.joints.length; i++) {
            ctx.beginPath();
            ctx.arc(this.joints[i].x, this.joints[i].y, this.sizes[i], 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }


}