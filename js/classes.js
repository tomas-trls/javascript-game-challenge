import { canvas, c, gravity } from "../main.js";

export class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesRate = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesRate = framesRate;
    this.framesStatic = 0;
    this.framesRead = 0;
    this.framesHold = 3;
    this.offset = offset;
  }

  draw() {
    /*
      https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    */
    c.drawImage(
      this.image,
      this.framesStatic * (this.image.width / this.framesRate),
      0,
      this.image.width / this.framesRate,
      this.image.height,

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesRate) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesRead++;

    if (this.framesRead % this.framesHold == 0) {
      if (this.framesStatic < this.framesRate - 1) {
        this.framesStatic++;
      } else {
        this.framesStatic = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

export class Player extends Sprite {
  constructor({
    position,
    velocity,
    color,
    attackBoxPosition,
    imageSrc,
    scale = 1,
    framesRate = 1,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesRate,
      offset,
    });
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

    this.framesStatic = 0;
    this.framesRead = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    this.dead = false;
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

    //Adding Animation of Sprite
    this.framesRead++;

    if (this.framesRead % this.framesHold == 0) {
      if (this.framesStatic < this.framesRate - 1) {
        this.framesStatic++;
      } else {
        this.framesStatic = 0;
      }
    }
  }

  attack() {
    this.switchSprite("attack");
    this.isAttacking = true;
  }

  switchSprite(sprite) {
    if (
      this.image == this.sprites.attack.image &&
      this.framesStatic < this.sprites.attack.framesRate - 1
    )
      return;

    if (
      this.image == this.sprites.hit.image &&
      this.framesStatic < this.sprites.hit.framesRate - 1
    )
      return;

    if (
      this.image == this.sprites.death.image &&
      this.framesStatic < this.sprites.death.framesRate - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesRate = this.sprites.idle.framesRate;
          this.framesStatic = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesRate = this.sprites.run.framesRate;
          this.framesStatic = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesRate = this.sprites.jump.framesRate;
          this.framesStatic = 0;
        }
        break;
      case "attack":
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.framesRate = this.sprites.attack.framesRate;
          this.framesStatic = 0;
        }
        break;
      case "hit":
        if (this.image !== this.sprites.hit.image) {
          this.image = this.sprites.hit.image;
          this.framesRate = this.sprites.hit.framesRate;
          this.framesStatic = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesRate = this.sprites.death.framesRate;
          this.framesStatic = 0;
        }
        break;
    }
  }
}
