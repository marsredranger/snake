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

const game = {
  status: NEW_GAME,
  keyup : false
}

const snake = {
  color: "#22ee22",
  height: 32,
  width: 32,
  speed: SPEED,
  cords: [[320, 320], [320, 352], [320, 384]],
  direction: undefined,
  firstMove: true,
  alive: true,
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
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#222222";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  snake.draw();
  // console.log(`x : ${snake.cords[0][0]}, y : ${snake.cords[0][1]} moving ${snake.direction}`);
  // console.log(`GAME STATUS : ${game.status} KEY UP : ${game.keyup}`);
  window.addEventListener("keydown", (event) => {
    // console.log(`key ${event.key}`);
    if (game.status === NEW_GAME && event.key === NEW_GAME_KEY_CODE){
      game.status = PLAY;
      game.keyup = true;
      snake.direction = UP;
    } else if (game.keyup && game.status === PAUSED && event.key === PAUSE_TOGGLE_KEY_CODE) {
      game.keyup = false;
      game.status = PLAY;
      snake.speed = SPEED;
    } else if (!snake.firstMove && game.status !== PAUSED) {
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
}

setInterval(draw, 200);
