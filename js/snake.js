const randomInt = (max) => Math.floor(Math.random() * max);

class Snake {
    constructor(ctx, opt = {}) {
        this.ctx = ctx;
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.score = 0;
        this.width = opt.width || 20,
        this.height = opt.height || 20;
        this.speed = opt.speed || 4;
        this.color = opt.color || "#000";
        this.tail = [];
    }

    draw() {
        this.ctx.beginPath();
        
        // Draw snake' head
        this.ctx.rect(this.x, this.y, this.width, this.height);
        
        // Draw snake' tail
        for(let tail of this.tail)
            this.ctx.rect(tail.x, tail.y, this.width, this.height);
        
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        
        this.ctx.closePath();    
    }

    move() {
        if(this.tail.length >= 1) {
            this.tail.pop();
            this.tail.unshift({
                x: this.x,
                y: this.y
            });
        }
    }

    eat(food) {
        if(Math.abs((food.y + food.height) - (this.y + this.height)) <= food.height && Math.abs((food.x + food.width) - (this.x + this.width)) <= food.width) {
            this.score++;
            this.speed += 0.1;
            food.x = randomInt(this.ctx.canvas.width);
            food.y = randomInt(this.ctx.canvas.height);
            this.tail.unshift({
                x: this.x,
                y: this.y
            });
            console.log(`Score: ${this.score}`);
            console.log(`Speed: ${this.speed}`);
        }
    }
}

class Food {
    constructor(ctx, opt = {}) {
        this.ctx = ctx;
        this.x = opt.x || randomInt(this.ctx.canvas.width);
        this.y = opt.y || randomInt(this.ctx.canvas.height);
        this.width = opt.width || 20;
        this.height = opt.height || 20;
        this.color = opt.color || "red";
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
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

    move(caracter) {

        if(typeof caracter.move === "function") caracter.move();
        
        if(this.up) caracter.y -= caracter.speed;

        if(this.down) caracter.y += caracter.speed;
        
        if(this.right) caracter.x += caracter.speed;
        
        if(this.left) caracter.x -= caracter.speed;
    }

    unpressKeys() { this.up = this.down = this.right = this.left = false; }
}

(function() {

    let ctx = document.getElementById("game").getContext("2d");

    const keyboard = new Keyboard();
    const snake = new Snake(ctx);
    const food = new Food(ctx);

    keyboard.init();

    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        snake.draw();
        food.draw();
    }
    
    function loop() {
        snake.eat(food);
        keyboard.move(snake);
        draw();
        requestAnimationFrame(loop);
    }

    loop();

})();
