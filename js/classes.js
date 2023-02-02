import { canvas, c, gravity } from "../main.js";

export class Sprite {
  constructor({ position, imageSrc, scale = 1 }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
  }
}

export class Player {
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
    if (this.position.y + this.height >= canvas.height - 20) {
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
