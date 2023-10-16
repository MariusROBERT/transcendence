export interface State {
  running: boolean;
  isSpecial: boolean;
  balls: Ball[];
  player_speed: number;
  p1: number;
  p2: number;
  score: { p1: number; p2: number };
  moveP1: { isMoving: boolean; up: boolean };
  moveP2: { isMoving: boolean; up: boolean };
}

export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vec: Vector2) {
    this.x += vec.x;
    this.y += vec.y;
  }

  sub(vec: Vector2) {
    this.x -= vec.x;
    this.y -= vec.y;
  }

  mul(vec: Vector2) {
    this.x *= vec.x;
    this.y *= vec.y;
  }

  div(vec: Vector2) {
    this.x /= vec.x;
    this.y /= vec.y;
  }

  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const len = this.length();
    this.x /= len;
    this.y /= len;
  }

  reflect(normal: Vector2) {
    const dot = Vector2.dot(this, normal);
    this.x -= 2 * dot * normal.x;
    this.y -= 2 * dot * normal.y;
  }

  static add(vec1: Vector2, vec2: Vector2) {
    return new Vector2(vec1.x + vec2.x, vec1.y + vec2.y);
  }

  static sub(vec1: Vector2, vec2: Vector2) {
    return new Vector2(vec1.x - vec2.x, vec1.y - vec2.y);
  }

  static mul(vec1: Vector2, vec2: Vector2) {
    return new Vector2(vec1.x * vec2.x, vec1.y * vec2.y);
  }

  static div(vec1: Vector2, vec2: Vector2) {
    return new Vector2(vec1.x / vec2.x, vec1.y / vec2.y);
  }

  static scale(vec: Vector2, scalar: number) {
    return new Vector2(vec.x * scalar, vec.y * scalar);
  }

  static normalize(vec: Vector2) {
    const len = vec.length();
    return new Vector2(vec.x / len, vec.y / len);
  }

  static dot(vec1: Vector2, vec2: Vector2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  }

  static reflect(vec: Vector2, normal: Vector2) {
    const dot = Vector2.dot(vec, normal);
    return Vector2.sub(vec, Vector2.scale(normal, 2 * dot));
  }
}

export class Ball {
  id: number;
  pos: Vector2;
  dir: Vector2;
  speed: number;

  constructor(pos: Vector2, dir: Vector2, speed: number, id: number) {
    this.id = id;
    this.pos = pos;
    this.dir = dir;
    this.speed = speed;
  }

  bounceWithWall() {
    if (
      this.pos.y < size.halfBall ||
      this.pos.y > size.height - size.halfBall
    ) {
      this.dir.y *= -1;
    }
  }

  bounceWithPlayers(state: State) {
    //collision with the left player
    if (
      this.pos.x - size.halfBall <= size.p1X &&
      this.pos.y - size.halfBall < state.p1 + size.halfBar &&
      this.pos.y + size.halfBall > state.p1 - size.halfBar
    )
      this.dir = new Vector2(
        this.pos.x - (size.p1X - size.ball),
        this.pos.y - state.p1,
      );
    //collision with the right player
    if (
      this.pos.x + size.halfBall >= size.p2X &&
      this.pos.y - size.halfBall < state.p2 + size.halfBar &&
      this.pos.y + size.halfBall > state.p2 - size.halfBar
    )
      this.dir = new Vector2(
        this.pos.x - (size.p2X + size.ball),
        this.pos.y - state.p2,
      );
  }

  bounceWithBall(ball: Ball) {
    if (Math.abs(this.pos.x - ball.pos.x) > size.ball) return;
    if (Math.abs(this.pos.y - ball.pos.y) > size.ball) return;
    const len = Math.sqrt(
      (this.pos.x - ball.pos.x) ** 2 + (this.pos.y - ball.pos.y) ** 2,
    );
    if (len > size.ball) return;
    const normal = new Vector2(
      (ball.pos.x - this.pos.x) / len,
      (ball.pos.y - this.pos.y) / len,
    );
    this.dir.reflect(normal);
    ball.dir.reflect(normal);
  }

  update() {
    this.dir.normalize();
    this.pos.add(Vector2.scale(this.dir, this.speed));
  }
}

export const size = {
  height: 720,
  width: 1280,
  ball: 50,
  bar: { x: 25, y: 144 },
  halfBar: 72,
  halfBall: 25,
  p1X: 25,
  p2X: 1280 - 25,
};

export interface gameRoom {
  playerIds: number[];
  state: State;
  ready: number[];
}

export const delay = (ms: number | undefined) =>
  new Promise((res) => (ms ? setTimeout(res, ms) : setTimeout(res, 0)));
export const clamp = (val, valmin, valmax) =>
  Math.min(Math.max(val, valmin), valmax);
