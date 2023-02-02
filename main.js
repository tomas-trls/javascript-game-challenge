//Setup Of the Canvas!

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const playerOneHealthBar = document.querySelector("#player-one-damage");
const playerTwoHealthBar = document.querySelector("#player-two-damage");

const timerBox = document.querySelector(".game__timer");
const gameResult = document.querySelector(".game__result");
canvas.width = 1024;
canvas.height = 576;

// Adding Important Physics
const gravity = 0.7;

// Creating A Player
class Player {
  constructor({ position, velocity, color, attackBoxPosition }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.width = 50;
    this.height = 150;

    this.health = 100;
    this.isAttacking;

    this.lastKey;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      attackBoxPosition,
    };
  }

  draw() {
    //Player
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //AttackBox
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();

    //Updating position depending on velocity (moved up since velocity is updated with movements of player)
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //Adding Gravity to the project, changing the velocity.
    if (this.position.y + this.height >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }

    this.attackBox.position.x =
      this.position.x + this.attackBox.attackBoxPosition.x;
    this.attackBox.position.y = this.position.y;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

//Player 1
let player1 = new Player({
  position: {
    x: 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  attackBoxPosition: {
    x: 0,
    y: 0,
  },
});

//Player 2
let player2 = new Player({
  position: {
    x: 800,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  attackBoxPosition: {
    x: -50,
    y: 0,
  },
});

//Movements Object
const keys = {
  a: {
    pressed: false,
  },

  d: {
    pressed: false,
  },

  w: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },

  ArrowUp: {
    pressed: false,
  },
};

//Important Functions

const getWinner = (player1, player2) => {
  if (player1.health == player2.health) {
    gameResult.innerText = "Tie";
  } else if (player1.health > player2.health) {
    gameResult.innerText = "Player 1 wins!";
  } else if (player1.health < player2.health) {
    gameResult.innerText = "Player 2 wins!";
  }
};

let counter = 10;
let timerId;
const handleTimer = () => {
  timerId = setTimeout(handleTimer, 1000);
  if (counter > 0) {
    counter--;
    timerBox.innerText = counter;
  }
  if (counter === 0) {
    getWinner(player1, player2);
  }
};
handleTimer();

const rectangularCollision = (player1, player2) => {
  return (
    player1.attackBox.position.x + player1.attackBox.width >=
      player2.position.x &&
    player1.attackBox.position.x <= player2.position.x + player2.width &&
    player1.attackBox.position.y + player1.attackBox.height >=
      player2.position.y &&
    player1.attackBox.position.y <= player2.position.y + player2.height
  );
};

//Canvas Rendering
const animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //Player 1 Controls
  player1.update();

  player1.velocity.x = 0;
  if (keys.a.pressed && player1.lastKey === "a") {
    player1.velocity.x = -5;
  } else if (keys.d.pressed && player1.lastKey === "d") {
    player1.velocity.x = 5;
  }

  //Player 2 Controls
  player2.update();
  player2.velocity.x = 0;
  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 5;
  }

  //Collision from player to Enemy
  if (rectangularCollision(player1, player2) && player1.isAttacking) {
    player1.isAttacking = false;
    player2.health -= 10;
    playerTwoHealthBar.style.width = `${player2.health}%`;
  }

  //Collision from player2 to player1

  if (rectangularCollision(player2, player1) && player2.isAttacking) {
    player2.isAttacking = false;
    player1.health -= 10;
    playerOneHealthBar.style.width = `${player1.health}%`;
  }
};

animate();

//Player Movements

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    //Player 1
    case "a":
      keys.a.pressed = true;
      player1.lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      player1.lastKey = "d";
      break;
    case "w":
      if (player1.velocity.y == 0) {
        player1.velocity.y = -20;
      }
      break;
    case " ":
      player1.attack();
      break;

    //Player 2 Movements
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      player2.lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      player2.lastKey = "ArrowRight";
      break;

    case "ArrowUp":
      if (player2.velocity.y == 0) {
        player2.velocity.y = -20;
      }
      break;
    case "ArrowDown":
      player2.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //Player 1 release keys
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    //Player 2 release keys
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
