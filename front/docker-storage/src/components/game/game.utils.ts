export interface State{
  running: boolean,
  isSpecial: boolean,
  ball: {x: number, y: number},
  speed: number,
  dir: {x: number, y: number},
  p1: {x: number, y: number},
  p2: {x: number, y: number},
  score: {p1: number, p2: number},
  moveP1: {isMoving: boolean, up: boolean},
  moveP2: {isMoving: boolean, up: boolean},
}

export const start: State = {
  running: false,
  isSpecial: false,
  ball: {x: 0, y: 0},
  speed: 0,
  dir: {x: 0, y: 0},
  p1: {x: 0, y: 0},
  p2: {x: 0, y: 0},
  score: {p1: 0, p2: 0},
  moveP1: {isMoving: false, up: false},
  moveP2: {isMoving: false, up: false},
}

export const basesize:{
  height:number,
  width:number,
  ball:number,
  bar:{x: number, y: number},
  halfBar:number,
  halfBall:number
} = {
  height:720,
  width:1280,
  ball:50,
  bar:{x: 25, y: 144},
  halfBar:72,
  halfBall:25
};

export interface gameRoom{
  room: string,
  playerIds: number[],
  state: State,
  ready: boolean,
}