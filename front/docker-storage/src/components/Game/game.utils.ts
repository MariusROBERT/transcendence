import p5Types from 'p5';

export interface State {
  ball: { x: number, y: number },
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

export const basesize = {
  height: 720,
  width: 1280,
  ball: 50,
  bar: {x: 25, y: 144},
  halfBar: 72,
  halfBall: 25,
  p1X: 25,
  p2X: 1280 - 25,
};

export const start: State = {
  ball: {x: basesize.width / 2, y: basesize.height / 2},
  p1: basesize.height / 2,
  p2: basesize.height / 2,
  score: {p1: 0, p2: 0},
};

export interface gameRoom {
  room: string,
  playerIds: number[],
  state: State,
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
    p5.fill(...this.color, 255 - (this.age) * 15);
    p5.noStroke();
    p5.circle(this.pos.x, this.pos.y, size - this.age);
    p5.fill(255, 255, 255);
  }
}

export class Ball {
  pos: { x: number, y: number };
  particles: Particle[];
  rainbow = new Rainbow();

  constructor(pos: { x: number, y: number }) {
    this.pos = pos;
    this.particles = [];
  }

  draw(p5: p5Types, size: Size) {
    for (const particle of this.particles) {
      particle.draw(p5, size.ball);
    }
    p5.circle(this.pos.x, this.pos.y, size.ball);
  }
}

export class GuidedBall extends Ball {
  constructor(pos: { x: number, y: number }) {
    super(pos);
  }

  update(vec: { x: number, y: number }, size: Size) {
    while (this.particles.length > size.ball - 1)
      this.particles.shift();
    for (const particle of this.particles) {
      particle.update();
    }
    this.pos.x = vec.x;
    this.pos.y = vec.y;
    this.particles.push(new Particle({...this.pos}, this.rainbow.next()));
  }
}

export class AutonomousBall extends Ball {
  dir: { x: number, y: number };

  constructor(pos: { x: number, y: number }, dir: { x: number, y: number }) {
    super(pos);
    this.dir = dir;
  }

  update(size: Size) {
    while (this.particles.length > size.ball - 1)
      this.particles.shift();
    for (const particle of this.particles) {
      particle.update();
    }
    this.pos.x += this.dir.x;
    if (this.pos.x - (size.ball / 2) < 5)
      this.dir.x *= -1;
    else if (this.pos.x + (size.ball / 2) > (size.width - 5))
      this.dir.x *= -1;

    if (this.pos.y - (size.ball / 2) < 5)
      this.dir.y *= -1;
    else if (this.pos.y + (size.ball / 2) > (size.height - 5))
      this.dir.y *= -1;

    this.pos.y += this.dir.y;
    this.particles.push(new Particle({...this.pos}, this.rainbow.next()));
  }
}

class Rainbow {
  step = 0;
  red = 255;
  green = 0;
  blue = 0;
  static increase = 5;

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
}












