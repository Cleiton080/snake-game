const randomInt = (max) => Math.floor(Math.random() * max);

class Snake {
    constructor(ctx, opt = {}) {
        this.ctx = ctx;
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.score = 0;
        this.grid = opt.grid || 20;
        this.speed = opt.speed || 4;
        this.color = opt.color || "#000";
        this.tail = [];
    }

    draw() {
        this.ctx.beginPath();
        
        // Draw snake' head
        this.ctx.rect(this.x, this.y, this.grid, this.grid);
        
        // Draw snake' tail
        for(let tail of this.tail)
            this.ctx.rect(tail.x, tail.y, this.grid, this.grid);
        
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        
        this.ctx.closePath();    
    }

    move() {
        if(this.tail.length >= 1) {
            this.tail.pop();
            this.tail.unshift({ x: this.x, y: this.y });
        }
    }

    eat(foods) {
        foods.forEach(food => {
            if(Math.abs((food.y + food.grid) - (this.y + this.grid)) <= food.grid && Math.abs((food.x + food.grid) - (this.x + this.grid)) <= food.grid) {
                this.score++;
                this.speed += 0.01;
                food.x = randomInt(this.ctx.canvas.width - this.grid);
                food.y = randomInt(this.ctx.canvas.height - this.grid);
                this.tail.unshift({ x: this.x, y: this.y });
                console.log(`Score: ${this.score}`);
                console.log(`Speed: ${this.speed}`);
            }
        });
    }

    crash(callback) {
        const {width, height} = this.ctx.canvas;
        // Check if the snake crashed on the wall
        if(this.x < 0 || this.x >= width - this.grid || this.y < 0 || this.y >= height - this.grid)
            callback(this);
    }
}

class Food {
    constructor(ctx, opt = {}) {
        this.ctx = ctx;
        this.grid = opt.grid || 20;
        this.x = opt.x || randomInt(this.ctx.canvas.width - this.grid);
        this.y = opt.y || randomInt(this.ctx.canvas.height - this.grid);
        this.color = opt.color || "red";
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.grid, this.grid);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class Keyboard {
    constructor() {
        this.up = this.down = this.left = false;
        this.right = true;
        this.keys = {
            up: "w",
            down: "s",
            left: "a",
            right: "d"
        };
    }

    keyPressed(key, opositeKey) {
        if(!this[opositeKey]) {
            this.unpressKeys();
            this[key] = true;
        }
    }

    init() {
        document.addEventListener("keypress", (event) => {
            const {up, down, left, right} = this.keys;
            switch(event.key) {
                case up: this.keyPressed("up", "down"); break;
                case down: this.keyPressed("down", "up"); break;
                case left: this.keyPressed("left", "right"); break;
                case right: this.keyPressed("right", "left"); break;
            }
        });
    }

    move(character) {

        if(typeof character.move === "function") character.move();
        
        if(this.up) character.y -= character.speed;

        if(this.down) character.y += character.speed;
        
        if(this.right) character.x += character.speed;
        
        if(this.left) character.x -= character.speed;
    }

    unpressKeys() { this.up = this.down = this.right = this.left = false; }
}

(function() {

    const ctx = document.getElementById("game").getContext("2d");
    const grid = 20;

    const keyboard = new Keyboard();
    const snake = new Snake(ctx, { grid });
    const foods = [new Food(ctx, { grid })];

    keyboard.init();

    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        snake.draw();
        foods.forEach(food => food.draw());
    }
    
    function loop() {
        keyboard.move(snake);
        draw();
        snake.crash(() => alert('Crashed'));
        snake.eat(foods);
        requestAnimationFrame(loop);
    }

    loop();

})();
