const HEIGHT = 960;
const WIDTH = 1280;

const SPEED = 32;

const LEFT_KEY_CODE = 'a';
const RIGHT_KEY_CODE = 'd';
const UP_KEY_CODE = 'w';
const DOWN_KEY_CODE = 's';

const PAUSE_TOGGLE_KEY_CODE = 'p';
const NEW_GAME_KEY_CODE = 'n';

const LEFT = "LEFT";
const RIGHT = "RIGHT";
const UP = "UP";
const DOWN = "DOWN";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.height = HEIGHT;
canvas.width = WIDTH;

const NEW_GAME = "NEW_GAME";
const PAUSED = "PAUSED";
const PLAY = "PLAY";
const GAME_OVER = "GAME_OVER";

const APPLE_SIZE = 32;

const RANDOM_MIN_X = 0;
const RANDOM_MAX_X = (WIDTH - APPLE_SIZE) / APPLE_SIZE;
const RANDOM_MIN_Y = 0;
const RANDOM_MAX_Y = (HEIGHT - APPLE_SIZE) / APPLE_SIZE;

const INTERVAL = 150;

const game = {
  status: NEW_GAME,
  keyup: false,
  safeAppleSpawn: function() {
    for(let cords of snake.cords){
      if (cords[0] === apple.cords[0] && cords[1] === apple.cords[1]) {
        return false
      }
    }
    apple.spawned = true;
    return true
  },
  appleEaten: function() {
    if(snake.headCords[0] === apple.cords[0] && snake.headCords[1] === apple.cords[1]) {
      return true;
    }
    return false;
  },
  snakeCollision: function() {
    for(let cords of snake.cords.slice(1)){
      if(snake.headCords[0] === cords[0] && snake.headCords[1] === cords[1]) {
        snake.alive = false;
        snake.kill();
      }
    }
  }
}

const apple = {
  size: APPLE_SIZE,
  color: "#de2323",
  spawned: false,
  init: function() {
    this.cords = this.spawnApple();
  },
  spawnApple : function() {
    let x = (Math.floor(Math.random() * (RANDOM_MAX_X - RANDOM_MIN_X + 1) ) + RANDOM_MIN_X) * APPLE_SIZE;
    let y = (Math.floor(Math.random() * (RANDOM_MAX_Y - RANDOM_MIN_Y + 1) ) + RANDOM_MIN_Y) * APPLE_SIZE;
    return [x, y];
  },
  draw: function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.cords[0], this.cords[1], this.size, this.size);
  },
}

const snake = {
  init : function() {
      this.color = "#22ee22";
      this.height = 32;
      this.width = 32;
      this.speed = SPEED;
      this.cords = [[320, 320], [320, 352], [320, 384]];
      this.headCords = this.cords[0];
      this.direction = undefined;
      this.firstMove = true;
      this.alive = true;
  },
  draw() {
    for (cord of this.cords) {
      ctx.fillStyle = this.color;
      ctx.fillRect(cord[0], cord[1], this.width, this.height);
    }
    if(this.direction === LEFT) {
      this.left();
    }else if (this.direction === RIGHT) {
      this.right();
    }else if (this.direction === UP) {
      this.up();
    }else if (this.direction === DOWN) {
      this.down();
    }
    this.headCords = this.cords[0];
    this.tailCords = this.cords[this.cords.length-1]
  },
  left: function() {
    let x = this.cords[0][0];
    let y = this.cords[0][1];
    x - this.speed < 0 ? this.alive = false : x = x - this.speed;
    if(this.alive && this.speed > 0){
      this.move(x, y);
    } else if (!this.alive) {
      this.kill();
    }
  },
  right: function() {
    let x = this.cords[0][0];
    let y = this.cords[0][1];
    x >= WIDTH - this.width ? this.alive = false : x = x + this.speed;
    if(this.alive && this.speed > 0){
      this.move(x, y);
    } else if (!this.alive) {
      this.kill();
    }
  },
  up: function() {
    let y = this.cords[0][1];
    let x = this.cords[0][0];
    y <= 0 ? this.alive = false : y = y - this.speed;
    if(this.alive && this.speed > 0){
      this.move(x, y);
    } else if (!this.alive) {
      this.kill();
    }

  },
  down: function() {
    let y = this.cords[0][1];
    let x = this.cords[0][0];
    y + this.speed > HEIGHT - this.height ? this.alive = false : y = y + this.speed;
    if(this.alive && this.speed > 0){
      this.move(x, y);
    } else if (!this.alive) {
      this.kill();
    }
  },
  kill: function() {
    this.speed = 0;
    this.color = "#226edd";
  },
  move: function(x, y) {
    this.cords.unshift([x, y]);
    this.cords.pop();
    this.firstMove = false;
  },
  grow : function(){
    this.cords.push(this.tailCords);
  }
}

snake.init();
apple.init();

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#222222";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  while(!apple.spawned && !game.safeAppleSpawn()) {
    apple.init();
  }
  if(game.status === PLAY || game.status === PAUSED){
    apple.draw();
  }
  snake.draw();
  if (game.appleEaten()) {
    snake.grow();
    apple.spawned = false;
  }
  game.snakeCollision();
  if (!snake.alive) {
    game.status = GAME_OVER;
    apple.spawned = false;
  }
  // console.log(`x : ${snake.cords[0][0]}, y : ${snake.cords[0][1]} moving ${snake.direction}`);
  // console.log(`GAME STATUS : ${game.status} KEY UP : ${game.keyup}`);

}

window.addEventListener("keydown", (event) => {
  // console.log(`key ${event.key}`);
  if ((game.status === NEW_GAME || game.status === GAME_OVER) && event.key === NEW_GAME_KEY_CODE){
    snake.init();
    apple.init();
    game.status = PLAY;
    game.keyup = true;
    snake.direction = UP;
  } else if (game.keyup && game.status === PAUSED && event.key === PAUSE_TOGGLE_KEY_CODE) {
    game.keyup = false;
    game.status = PLAY;
    snake.speed = SPEED;
  } if (!snake.firstMove && game.status !== PAUSED) {
    if (event.key === LEFT_KEY_CODE && snake.direction !== RIGHT && snake.direction !== LEFT) {
      snake.firstMove = true;
      snake.direction = LEFT;
    } else if (event.key === RIGHT_KEY_CODE && snake.direction !== LEFT && snake.direction !== RIGHT) {
      snake.firstMove = true;
      snake.direction = RIGHT;
    } else if (event.key === UP_KEY_CODE && snake.direction !== DOWN && snake.direction !== UP) {
      snake.firstMove = true;
      snake.direction = UP;
    } else if (event.key === DOWN_KEY_CODE && snake.direction !== UP && snake.direction !== DOWN) {
      snake.firstMove = true;
      snake.direction = DOWN;
    } else if (game.keyup && game.status === PLAY && event.key === PAUSE_TOGGLE_KEY_CODE) {
      game.keyup = false;
      snake.speed = 0;
      game.status = PAUSED;
    }
  }
}, false)
window.addEventListener("keyup", (event) => {
  if (event.key === PAUSE_TOGGLE_KEY_CODE) {
    game.keyup = true;
  }
})

setInterval(draw, INTERVAL);
