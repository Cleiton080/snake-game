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
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    eat(food) {
        if(Math.abs((food.y + food.height) - (this.y + this.height)) <= food.height && Math.abs((food.x + food.width) - (this.x + this.width)) <= food.width) {
            this.score++;
            this.speed += 0.1;
            food.x = Math.floor(Math.random() * this.ctx.canvas.width);
            food.y = Math.floor(Math.random() * this.ctx.canvas.height);
            console.log(`Score: ${this.score}`);
            console.log(`Speed: ${this.speed}`);
        }
    }
}

class Food {
    constructor(ctx, opt = {}) {
        this.ctx = ctx;
        this.x = opt.x || 0;
        this.y = opt.y || 0;
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
        this.up = false;
        this.down = false;
        this.right = false;
        this.left = false;
    }

    init() {
        document.addEventListener("keypress", (event) => {
            switch(event.key) {
                case this.getKeys().up:
                    this.unpressKeys();
                    this.up = true;
                    break;
                case this.getKeys().down:
                    this.unpressKeys();
                    this.down = true;
                    break;
                case this.getKeys().left:
                    this.unpressKeys();
                    this.left = true;
                    break;
                case this.getKeys().right:
                    this.unpressKeys();
                    this.right = true;
                    break;
            }
        });
    }

    move(caracter) {
        if(this.up)
            caracter.y -= caracter.speed;
        if(this.down)
            caracter.y += caracter.speed;
        if(this.right)
            caracter.x += caracter.speed;
        if(this.left)
            caracter.x -= caracter.speed;
    }

    unpressKeys() {
        this.up = this.down = this.right = this.left = false;
    }

    getKeys() {
        return {
            up: "w",
            down: "s",
            left: "a",
            right: "d"
        };
    }
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
        draw();
        snake.eat(food);
        keyboard.move(snake);
        requestAnimationFrame(loop);
    }

    loop();

})();
