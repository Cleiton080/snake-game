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
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = "#000";
        
        // Draw snake' tail
        for(let tail of this.tail) {
            this.ctx.fillRect(tail.x, tail.y, this.width, this.height);
            this.ctx.fillStyle = "#000";
        }

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
            food.x = Math.floor(Math.random() * this.ctx.canvas.width);
            food.y = Math.floor(Math.random() * this.ctx.canvas.height);
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
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.width = opt.width || 20;
        this.height = opt.height || 20;
        this.color = opt.color || "red";
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.color;
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

        if(typeof caracter.move === "function")
            caracter.move();
        
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
    const snake = new Snake(ctx, {
        x: 0,
        y: 0
    });
    const food = new Food(ctx, {
        x: 100
    });

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
