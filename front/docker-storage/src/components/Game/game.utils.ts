import p5Types from 'p5';

export interface GameState {
  balls: { id: number, pos: { x: number, y: number } }[],
  p1: number,
  p2: number,
  score: { p1: number, p2: number }
}

export interface Size {
  height: number,
  width: number,
  ball: number,
  bar: { x: number, y: number },
  halfBar: number,
  halfBall: number,
  p1X: number,
  p2X: number,
}

export const baseSize = {
  height: 720,
  width: 1280,
  ball: 15,
  bar: { x: 25, y: 144 },
  halfBar: 72,
  halfBall: 3,
  p1X: 25,
  p2X: 1280 - 25,
};

export const start: GameState = {
  balls: [],
  p1: baseSize.height / 2,
  p2: baseSize.height / 2,
  score: { p1: 0, p2: 0 },
};

export interface gameRoom {
  room: string,
  playerIds: number[],
  state: GameState,
  ready: boolean,
}

class Particle {
  age: number;
  pos: { x: number, y: number };
  color: [number, number, number];

  constructor(pos: { x: number, y: number }, color: [number, number, number] = [255, 0, 0]) {
    this.pos = pos;
    this.age = 0;
    this.color = color;
  }

  update() {
    this.age++;
  }

  draw(p5: p5Types, size: number) {
    p5.fill(...this.color, 255 - this.age * 15);
    p5.noStroke();
    p5.circle(this.pos.x, this.pos.y, size - this.age);
    p5.fill(255, 255, 255);
  }
}

export class Ball {
  pos: p5Types.Vector;
  particles: Particle[];
  rainbow = new Rainbow();

  constructor(p5: p5Types, pos: { x: number, y: number }) {
    this.pos = p5.createVector(pos.x, pos.y);
    this.particles = [];
  }

  getColor(
    size: Size,
    theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN',
  ): [number, number, number] {
    if (theme === 'R/B Gradient') {
      const red = 255 - (this.pos.x * 255) / size.width;
      const blue = (this.pos.x * 255) / size.width;
      return [red, 0, blue];
    }
    if (theme === 'RGB') {
      return this.rainbow.next();
    }
    if (theme === 'WHITE') {
      return [200, 200, 200];
    }
    if (theme === 'GREEN') {
      return [0, 255, 0];
    }
    return [0, 0, 0];
  }

  draw(
    p5: p5Types,
    size: Size,
    theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN',
  ) {
    // Particles
    for (const particle of this.particles) {
      particle.draw(p5, size.ball);
    }
    // Neon
    p5.noStroke();
    p5.fill(...this.getColor(size, theme), 25);
    for (let i = 0; i < 30; i += 5) {
      p5.circle(this.pos.x, this.pos.y, size.ball + i);
    }
    p5.fill(255);
    p5.circle(this.pos.x, this.pos.y, size.ball);
  }
}

export class GuidedBall extends Ball {
  id: number;

  constructor(p5: p5Types, id: number, pos: { x: number, y: number }) {
    super(p5, pos);
    this.id = id;
  }

  update(
    vec: { x: number; y: number },
    size: Size,
    theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN',
  ) {
    while (this.particles.length > size.ball - 1) this.particles.shift();
    for (const particle of this.particles) {
      particle.update();
    }
    let color: [number, number, number];
    if (theme === 'R/B') {
      if (this.pos.x < vec.x) color = [255, 0, 0];
      else color = [0, 0, 255];
    } else color = this.getColor(size, theme);
    this.pos.x = vec.x;
    this.pos.y = vec.y;
    this.particles.push(new Particle({ ...this.pos }, color));
  }
}

export class AutonomousBall extends Ball {
  readonly minSpeed = 5;
  readonly maxSpeed = 20;
  dir: p5Types.Vector;
  speed: number;
  grow = true;

  constructor(p5: p5Types, pos: { x: number, y: number }, dir: { x: number, y: number }) {
    super(p5, pos);
    this.dir = p5.createVector(dir.x, dir.y);
    this.dir.normalize();
    this.speed = Math.random() * 5 + 3;
  }

  static dot(vec1: p5Types.Vector, vec2: p5Types.Vector) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  }

  static reflect(vec: p5Types.Vector, normal: p5Types.Vector) {
    const dot = AutonomousBall.dot(vec, normal);
    vec.sub(p5Types.Vector.mult(normal, 2 * dot));
  }

  getColor(
    size: Size,
    theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN',
  ): [number, number, number] {
    if (theme === 'R/B') {
      if (this.dir.x > 0) return [255, 0, 0];
      return [0, 0, 255];
    }
    return super.getColor(size, theme);
  }

  bounceWithWall(size: Size) {
    if (this.pos.x - (size.ball / 2) < 5)
      this.dir.x = Math.abs(this.dir.x);
    else if (this.pos.x + (size.ball / 2) > (size.width - 5))
      this.dir.x = -Math.abs(this.dir.x);

    if (this.pos.y - (size.ball / 2) < 5)
      this.dir.y = Math.abs(this.dir.y);
    else if (this.pos.y + (size.ball / 2) > (size.height - 5))
      this.dir.y = -Math.abs(this.dir.y);
  }

  bounceWithBall(size: Size, ball: AutonomousBall, p5: p5Types) {
    if (Math.abs(this.pos.x - ball.pos.x) > size.ball) return;
    if (Math.abs(this.pos.y - ball.pos.y) > size.ball) return;
    const len = Math.sqrt(
      (this.pos.x - ball.pos.x) ** 2 + (this.pos.y - ball.pos.y) ** 2,
    );
    if (len > size.ball) return;
    const normal = p5.createVector(
      (ball.pos.x - this.pos.x) / len,
      (ball.pos.y - this.pos.y) / len,
    );
    AutonomousBall.reflect(this.dir, normal);
    AutonomousBall.reflect(ball.dir, normal);
    this.changeSpeed(this);
    this.changeSpeed(ball);
  }

  changeSpeed(ball: AutonomousBall) {
    ball.speed += ball.grow ? 0.1 : -0.1;
    if (ball.speed > ball.maxSpeed) {
      ball.speed = ball.maxSpeed;
      ball.grow = false;
    }
    if (ball.speed < ball.minSpeed) {
      ball.speed = ball.minSpeed;
      ball.grow = true;
    }
  }

  update(
    size: Size,
    balls: AutonomousBall[],
    p5: p5Types,
    theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN',
  ) {
    while (this.particles.length > size.ball - 1) this.particles.shift();
    for (const particle of this.particles) {
      particle.update();
    }

    this.bounceWithWall(size);
    for (const ball of balls) {
      this.bounceWithBall(size, ball, p5);
    }

    this.dir.normalize();
    this.pos.add(p5Types.Vector.mult(this.dir, this.speed));

    this.particles.push(new Particle({ ...this.pos }, this.getColor(size, theme)));
  }
}

export class MouseBall extends AutonomousBall {
  update(size: Size, balls: AutonomousBall[], p5: p5Types) {
    for (const ball of balls) {
      this.bounceWithBall(size, ball, p5);
    }

    this.pos.x = p5.mouseX;
    this.pos.y = p5.mouseY;
  }

  draw(p5: p5Types, size: Size) {
    // Particles
    for (const particle of this.particles) {
      particle.draw(p5, size.ball);
    }
    // Neon
    p5.noStroke();
    for (let i = 0; i < 20; i += 2) {
      p5.fill(255, 255, 255, 25);
      p5.circle(this.pos.x, this.pos.y, size.ball + i);
    }
    p5.fill(20);
    p5.circle(this.pos.x, this.pos.y, size.ball);
  }
}

export class Rainbow {
  step = 0;
  red = 0;
  green = 0;
  blue = 0;
  static increase = 5;

  constructor() {
    const startRandom = Math.floor(Math.random() * 6);
    this.step = startRandom;
    switch (startRandom) {
      case 0:
        this.red = Math.floor(Math.random() * 255);
        break;
      case 1:
        this.red = Math.floor(Math.random() * 255);
        this.green = 255;
        break;
      case 2:
        this.green = Math.floor(Math.random() * 255);
        break;
      case 3:
        this.green = Math.floor(Math.random() * 255);
        this.blue = 255;
        break;
      case 4:
        this.blue = Math.floor(Math.random() * 255);
        break;
      case 5:
        this.red = Math.floor(Math.random() * 255);
        this.blue = 255;
        break;
    }
  }

  next(): [number, number, number] {
    switch (this.step) {
      case 0:
        this.green += Rainbow.increase;
        if (this.green >= 255)
          this.step++;
        break;
      case 1:
        this.red -= Rainbow.increase;
        if (this.red <= 0)
          this.step++;
        break;
      case 2:
        this.blue += Rainbow.increase;
        if (this.blue >= 255)
          this.step++;
        break;
      case 3:
        this.green -= Rainbow.increase;
        if (this.green <= 0)
          this.step++;
        break;
      case 4:
        this.red += Rainbow.increase;
        if (this.red >= 255)
          this.step++;
        break;
      case 5:
        this.blue -= Rainbow.increase;
        if (this.blue <= 0)
          this.step = 0;
        break;
    }
    return [this.red, this.green, this.blue];
  }

  current(): [number, number, number] {
    return [this.red, this.green, this.blue];
  }
}
