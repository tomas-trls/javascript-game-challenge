import { Player, Sprite } from "./js/classes.js";

import { getWinner, rectangularCollision } from "./js/functions.js";
//Setup Of the Canvas!

export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

const playerOneHealthBar = document.querySelector("#player-one-damage");
const playerTwoHealthBar = document.querySelector("#player-two-damage");

const timerBox = document.querySelector(".game__timer");
canvas.width = 1024;
canvas.height = 576;

// Adding Important Physics
export const gravity = 0.7;

// Creating A Player

//Player 1
export let player1 = new Player({
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
  imageSrc: "./assets/Martial Hero 3/Sprite/Idle.png",
  framesMax: 10,
  scale: 3,
  offset: { x: 200, y: 100 },
  sprites: {
    idle: {
      imageSrc: "./assets/Martial Hero 3/Sprite/Idle.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "./assets/Martial Hero 3/Sprite/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/Martial Hero 3/Sprite/Going Up.png",
      framesMax: 3,
    },
    attack: {
      imageSrc: "./assets/Martial Hero 3/Sprite/Attack2.png",
      framesMax: 6,
    },
  },
});

//Player 2
export let player2 = new Player({
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
  imageSrc: "./assets/Medieval Warrior Pack 2/Sprites/Idle.png",
  framesMax: 8,
  scale: 3,
  offset: { x: 100, y: 140 },
  sprites: {
    idle: {
      imageSrc: "./assets/Medieval Warrior Pack 2/Sprites/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/Medieval Warrior Pack 2/Sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/Medieval Warrior Pack 2/Sprites/Jump.png",
      framesMax: 2,
    },
    attack: {
      imageSrc: "./assets/Medieval Warrior Pack 2/Sprites/Attack2.png",
      framesMax: 4,
    },
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

//Background Sprite

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/Rocky Pass Files/PNG/back.png",
  scale: 2.4,
});

const middle = new Sprite({
  position: {
    x: 0,
    y: 100,
  },
  imageSrc: "./assets/Rocky Pass Files/PNG/middle.png",
  scale: 2,
});

const near = new Sprite({
  position: {
    x: 0,
    y: 100,
  },
  imageSrc: "assets/Rocky Pass Files/PNG/near.png",
  scale: 2,
});

//Timer
let counter = 60;
export let timerTimeOut;
const handleTimer = () => {
  timerTimeOut = setTimeout(handleTimer, 1000);
  if (counter > 0) {
    counter--;
    timerBox.innerText = counter;
  }
  if (counter === 0) {
    getWinner(player1, player2);
  }
};

handleTimer();

//Canvas Rendering
const animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //Background Rendering
  background.update();
  middle.update();
  near.update();

  //Player 1 Controls
  player1.update();

  //Moving
  player1.velocity.x = 0;

  player1.switchSprite("idle");
  if (keys.a.pressed && player1.lastKey === "a") {
    player1.velocity.x = -5;
    player1.switchSprite("run");
  } else if (keys.d.pressed && player1.lastKey === "d") {
    player1.velocity.x = 5;
    player1.switchSprite("run");
  }

  //Jumping
  if (player1.velocity.y < 0) {
    player1.switchSprite("jump");
  }

  //Player 2 Controls
  c.scale(-1, 1);
  player2.update();
  player2.velocity.x = 0;
  player2.switchSprite("idle");
  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -5;
    player2.switchSprite("run");
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 5;
    player2.switchSprite("run");
  }

  //Jumping
  if (player2.velocity.y < 0) {
    player2.switchSprite("jump");
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

  // Game ends when player life is 0

  if (player1.health <= 0 || player2.health <= 0) {
    getWinner(player1, player2, timerTimeOut);
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
