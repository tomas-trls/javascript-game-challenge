//Setup Of the Canvas!

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const playerOneHealthBar = document.querySelector("#player-one-damage");
const playerTwoHealthBar = document.querySelector("#player-two-damage");

const timerBox = document.querySelector(".game__timer");

canvas.width = 1024;
canvas.height = 576;

// Adding Important Physics
const gravity = 0.7;

// Creating A Player
class Player {
  constructor({ position, velocity, color }) {
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
      width: 150,
      height: 50,
    };
  }

  draw() {
    //Player
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //AttackBox
    c.fillStyle = "green";
    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );
  }

  update() {
    this.draw();

    //Updating position depending on velocity
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //Adding Gravity to the project, changing the velocity.
    if (this.position.y + this.height >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
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
let counter = 10;
const handleTimer = () => {
  setTimeout(handleTimer, 1000);
  if (counter > 0) {
    counter--;
    timerBox.innerText = counter;
  }
};

handleTimer();
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
};

animate();

//Player Movements

window.addEventListener("keydown", (event) => {
  switch (event.key) {
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
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
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
