//Important Functions
import { timerTimeOut } from "../main.js";
const gameResult = document.querySelector(".game__result");

export const getWinner = (player1, player2) => {
  clearTimeout(timerTimeOut);
  if (player1.health == player2.health) {
    gameResult.innerText = "Tie";
  } else if (player1.health > player2.health) {
    player2.switchSprite("death");
    gameResult.innerText = "Player 1 wins!";
  } else if (player1.health < player2.health) {
    player1.switchSprite("death");
    gameResult.innerText = "Player 2 wins!";
  }
};

export const rectangularCollision = (player1, player2) => {
  return (
    player1.attackBox.position.x + player1.attackBox.width >=
      player2.position.x &&
    player1.attackBox.position.x <= player2.position.x + player2.width &&
    player1.attackBox.position.y + player1.attackBox.height >=
      player2.position.y &&
    player1.attackBox.position.y <= player2.position.y + player2.height
  );
};
