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
  bar: { x: 25, y: 144 },
  halfBar: 72,
  halfBall: 25,
  p1X: 25,
  p2X: 1280 - 25,
};

export const start: State = {
  ball: { x: basesize.width / 2, y: basesize.height / 2 },
  p1: basesize.height / 2,
  p2: basesize.height / 2,
  score: { p1: 0, p2: 0 },
};

export interface gameRoom {
  room: string,
  playerIds: number[],
  state: State,
  ready: boolean,
}