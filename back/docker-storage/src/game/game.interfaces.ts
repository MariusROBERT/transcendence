export interface State{
  running: boolean,
  isSpecial: boolean,
  ball: {x: number, y: number},
  speed: number,
  dir: {x: number, y: number},
  p1: number,
  p2: number,
  score: {p1: number, p2: number},
  moveP1: {isMoving: boolean, up: boolean},
  moveP2: {isMoving: boolean, up: boolean},
}

export const size = {
  height:720,
  width:1280,
  ball:50,
  bar:{x: 25, y: 144},
  halfBar:72,
  halfBall:25,
  p1X: 25,
  p2X: 1280 - 25,
};

export interface gameRoom{
  playerIds: number[],
  state: State,
  ready: number[],
}

export const delay = (ms: number | undefined) => new Promise(res => ms ? setTimeout(res, ms) : setTimeout(res, 0));
export const clamp = (val, valmin, valmax) => Math.min(Math.max(val, valmin), valmax);
