// Perri van den Berg (2025)

class Player extends Collision {
    constructor() {
        super(0, 0, 20, 20);
        this.x = 0;
        this.y = 0;
        this.x_prev = this.x;
        this.y_prev = this.y;
        this.width = 20;
        this.height = 20;
        this.color = 'grey';
        this.speed = 2;

        let body_list = this.snake_body(40)
        this.body = new Creature(this.x, this.y, body_list, 4, Math.PI / 8);

        this.inventory_size = 0;
        this.inventory = [];
        this.curr_key = -1;
        this.max_hp = 3;
        this.hp = this.max_hp;
    }

    snake_body(i) {
        let list = []
        for (let j = 0; j < i; j++) {
            if (j === 0)
                list.push(9.5);
            else if (j === 1)
                list.push(10.0);
            else
                list.push(8.0 - j / 8.0);
        }
        return list;
    }

    update(key_board) {
        let moveX = 0;
        let moveY = 0;

        if (key_board['a']) moveX -= 1;
        if (key_board['d']) moveX += 1;
        if (key_board['w']) moveY -= 1;
        if (key_board['s']) moveY += 1;

        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= Math.SQRT1_2;
            moveY *= Math.SQRT1_2;
        }

        this.x_prev = this.x;
        this.y_prev = this.y;

        this.x = this.x + moveX * this.speed;
        this.y = this.y + moveY * this.speed;

        this.body.move(this.x + this.width/2, this.y + this.width/2);
    }

    set_position(x, y) {
        this.x = x;
        this.y = y;
        this.body.set_position(x + this.width/2, y + this.width/2);
    }

    handle_collision(other) {
        if (other instanceof Wall || other instanceof Door) {
            if (!(other.req == this.curr_key)) {

                let tmp_x = this.x;
                let tmp_y = this.y;
                let collX = false;
                let collY = false;

                this.x = this.x_prev;
                this.y = tmp_y;
                if (this.check_collision(other))
                    collY = true;

                this.x = tmp_x;
                this.y = this.y_prev;
                if (this.check_collision(other))
                    collX = true;

                if (collX)
                    this.x = this.x_prev;
                else
                    this.x = tmp_x;
                if (collY)
                    this.y = this.y_prev;
                else
                    this.y = tmp_y;
            }
        }

        if (other instanceof Key) {
            this.set_key(other.req);
        }

    }

    reset() {
        this.inventory = [];
        this.curr_key = -1;
        this.hp = this.max_hp;
    }

    get_key() {
        return this.curr_key;
    }

    set_key(key) {
        // Already has key? Do nothing.
        if (this.inventory.includes(key)) {
            this.curr_key = key;
            return true;
        }
        // Has slots left? Fill slots.
        if (this.inventory.length < this.inventory_size) {
            this.inventory.push(key);
            this.curr_key = key;
            return true;
        }
        // Has no slots left? Replace current color.
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i] === this.curr_key) {
                this.inventory[i] = key;
                return true;
            }
        }
        return false;
    }

    set_inventory_size(size) {
        this.inventory_size = size;
    }

    draw(ctx) {
        this.color = 'grey';
        if (this.curr_key == 0) // red
            this.color = 'red';
        if (this.curr_key == 1) // blue
            this.color = 'blue';
        if (this.curr_key == 2) // green
            this.color = 'green';
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        this.body.draw(ctx, this.color);
    }
}
