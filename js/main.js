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
const DEMO = "DEMO";

const APPLE_SIZE = 32;

const RANDOM_MIN_X = 0;
const RANDOM_MAX_X = (WIDTH - APPLE_SIZE) / APPLE_SIZE;
const RANDOM_MIN_Y = 0;
const RANDOM_MAX_Y = (HEIGHT - APPLE_SIZE) / APPLE_SIZE;

const INTERVAL = 150;

const SNAKE_COLOR = "#22ee22";
const DEAD_SNAKE_COLOR = "#226edd";
const APPLE_COLOR = "#de2323";

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
    return snake.headCords[0] === apple.cords[0] && snake.headCords[1] === apple.cords[1];
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
  color: APPLE_COLOR,
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
      this.color = SNAKE_COLOR;
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
    this.color = DEAD_SNAKE_COLOR;
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

let computerSnake = {
  init: function() {
    this.snake = snake;
    this.snake.direction = UP;
  },
  getAppleCords: function() {
    this.appleCords = apple.cords;
  },


  nextMove: function() {
    // need to move up
    if (this.snake.headCords[1] > this.appleCords[1]) {
      console.log("COMPUTER SNAKE UP");
      if (this.snake.direction !== DOWN && !this.wouldCollideUp(this.snake.headCords)) {
        return UP;
      } else if (!this.wouldCollideRight(this.snake.headCords)) {
        return RIGHT;
      } else if (!this.wouldCollideLeft(this.snake.headCords)) {
        return LEFT;
      }
      // need to move left
    } else if (this.snake.headCords[0] > this.appleCords[0]) {
      console.log("COMPUTER SNAKE LEFT");
      if (this.snake.direction !== RIGHT && !this.wouldCollideLeft(this.snake.headCords)) {
        return LEFT;
      } else if (!this.wouldCollideDown(this.snake.headCords)) {
        return DOWN;
      } else if (!this.wouldCollideUp(this.snake.headCords)) {
        return UP;
      }

      // need to move right
    } else if (this.snake.headCords[0] < this.appleCords[0]) {
      console.log("COMPUTER SNAKE RIGHT");
      if (this.snake.direction !== LEFT && !this.wouldCollideRight(this.snake.headCords)) {
        return RIGHT;
      } else if (!this.wouldCollideUp(this.snake.headCords)) {
        return UP;
      } else if (!this.wouldCollideDown(this.snake.headCords)) {
        return DOWN;
    }
    // need to move down
    } else if(this.snake.headCords[1] < this.appleCords[1]) {
      console.log("COMPUTER SNAKE DOWN");
      if (this.snake.direction !== UP && !this.wouldCollideDown(this.snake.headCords)) {
        return DOWN;
      } else if (!this.wouldCollideLeft(this.snake.headCords)) {
        return LEFT;
      } else if (!this.wouldCollideRight(this.snake.headCords)) {
        return RIGHT;
      }
    }
    else {
      // do nothing
    }
    return this.snake.direction;
  },
  wouldCollide: function(headCords) {
    for(let cords of this.snake.cords.slice(1)) {
      if (headCords[0] === cords[0] && headCords[1] === cords[1]) {
        return true
      }
    }
    return false
  },
  wouldCollideLeft: function(headCords) {
    console.log("checking left direction with head cords : " + headCords)
    for(let cords of this.snake.cords.slice(1)) {
      if (headCords[0] -SPEED  === cords[0] && headCords[1] === cords[1]) {
        console.log("would collide left, avoiding direction!");
        return true
      }
    }
    return false
  },
  wouldCollideRight: function(headCords) {
    console.log("checking right direction with head cords : " + headCords)
    for(let cords of this.snake.cords.slice(1)) {
      if (headCords[0] +SPEED === cords[0] && headCords[1] === cords[1]) {
        console.log("would collide right, avoiding direction!");
        return true
      }
    }
    return false
  },
  wouldCollideUp: function(headCords) {
    console.log("checking up direction with head cords : " + headCords)
    for(let cords of this.snake.cords.slice(1)) {
      if (headCords[0] === cords[0] && headCords[1] - SPEED === cords[1]) {
        console.log("would collide up, avoiding direction!");
        return true
      }
    }
    return false
  },
  wouldCollideDown: function(headCords) {
    console.log("checking down direction with head cords : " + headCords)
    for(let cords of this.snake.cords.slice(1)) {
      if (headCords[0]=== cords[0] && headCords[1] + SPEED === cords[1]) {
        console.log("would collide down, avoiding direction!");
        return true
      }
    }
    return false
  }

}

snake.init();
apple.init();
game.status = DEMO;
if(game.status === DEMO) {
  computerSnake.init();
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#222222";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  while(!apple.spawned && !game.safeAppleSpawn()) {
    apple.init();
  }
  if(game.status === PLAY || game.status === PAUSED || game.status === DEMO){
    apple.draw();
  }
  if(game.status === DEMO) {
    computerSnake.getAppleCords();
    console.log("Computer snake tracking apple at x: " + computerSnake.appleCords[0] +
    " y: " + computerSnake.appleCords[1]);
    console.log("computer snake direction : " + computerSnake.snake.direction);
    snake.direction = computerSnake.nextMove();
    computerSnake.nextMove();
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
  console.log(`x : ${snake.cords[0][0]}, y : ${snake.cords[0][1]} moving ${snake.direction}`);
  // console.log(`GAME STATUS : ${game.status} KEY UP : ${game.keyup}`);

}

window.addEventListener("keydown", (event) => {
  // console.log(`key ${event.key}`);
  if ((game.status === NEW_GAME || game.status === GAME_OVER) && event.key === NEW_GAME_KEY_CODE) {
    snake.init();
    apple.init();
    game.status = PLAY;
    game.keyup = true;
    snake.direction = UP;
  } else if (game.keyup && game.status === PAUSED && event.key === PAUSE_TOGGLE_KEY_CODE) {
    game.keyup = false;
    game.status = PLAY;
    snake.speed = SPEED;
  } if (!snake.firstMove && game.status !== PAUSED && game.status !== DEMO) {
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
    } else if (game.keyup && (game.status === PLAY || game.status === DEMO ) && event.key === PAUSE_TOGGLE_KEY_CODE) {
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
