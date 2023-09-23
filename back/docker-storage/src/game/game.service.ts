import {Injectable} from '@nestjs/common';
import { clamp, delay, gameRoom, size, State } from './game.interfaces';
import { GameController } from './game.controller';

@Injectable()
export class GameService {
  controller: GameController;

  setController(controller: GameController) {
    this.controller = controller;
  }

  // VECTOR ------------------------------------------------------------ //
  normalize({x, y} :{x: number, y: number}): {x: number, y: number} {
    const len: number = Math.sqrt(x * x + y * y);
    x /= len;
    y /= len;
    return {x, y}
  }

  scale(v: { x: number; y: number }, factor: number): {x: number, y: number} {
    return {x: v.x * factor, y: v.y * factor};
  }

  add(v1: {x: number; y: number}, v2: {x: number; y: number}): {x: number, y: number} {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }

  // GAME LOGIC ----------------------------------------------------------- //
  //called at the start of the game and then every frame till the game ends
  async update(game: gameRoom){
    //check for the end game conditions
    if (game.state.score.p1 >= 10 || game.state.score.p2 >= 10 || !game.state.running) {
      game.state.running = false;
      return this.controller.matchmaking.endGame(game.playerIds[0]);
    }
    //call the logic in async function
    this.updateLogic(game.state);

    //await for a 30hz frame
    await delay(33);

    //send the new state to the gateway
    this.controller.gateway.sendState(game);

    //and call itself again
    return this.update(game);
  }

  // called every frame to update the state of the game
  async updateLogic(state: State) {
    //move the ball to the current direction
    state.ball = this.add(state.ball, (this.scale(state.dir, state.speed)));

    // move the players
    if (state.moveP1.isMoving) {
      state.p1.y += state.moveP1.up ? -state.speed : state.speed;
      state.p1.y = clamp(state.p1.y, size.ball * 1.5 + size.halfBar, size.height - size.ball * 1.5 - size.halfBar);
    }
    if (state.moveP2.isMoving) {
      state.p2.y += state.moveP2.up ? -state.speed : state.speed;
      state.p2.y = clamp(state.p2.y, size.ball * 1.5 + size.halfBar, size.height - size.ball * 1.5 - size.halfBar);
    }

    //check if the ball enter a 'GOAL'
    if (state.ball.x < 0 || state.ball.x > size.width)
    {
      // Update Score
      if (state.ball.x < 0)
        state.score.p2 += 1;
      if (state.ball.x > size.width)
        state.score.p1 += 1;

      // Start the new Round
      state.ball = {x:size.width/2, y:size.height/2};
      state.dir.x *= -1;
      state.speed = Math.max(state.speed - 1, 1);
    }

    //manage the 'physics' of the game
    else
      this.bounce(state);

    //increase progressively the speed
    state.speed = Math.min(state.speed + 0.02, 30)
  }

  //manage the 'physics' of the game
  bounce(state: State) {
    //up and down collision
    if (state.ball.y > size.height - size.halfBall || state.ball.y < size.halfBall)
      state.dir.y *= -1

    //collision with the left player
    if ((state.ball.x - size.ball / 2) < (state.p1.x)
      && (state.ball.y - size.halfBall) < (state.p1.y + size.halfBar)
      && (state.ball.y + size.halfBall) > (state.p1.y - size.halfBar))
      state.dir = {x:state.ball.x - (state.p1.x - size.ball), y: state.ball.y - state.p1.y}

    //collision with the right player
    if (state.ball.x + size.halfBall > state.p2.x
      && state.ball.y - size.halfBall < state.p2.y + size.halfBar
      && state.ball.y + size.halfBall > state.p2.y - size.halfBar)
      state.dir = {x: state.ball.x - (state.p2.x + size.ball), y: state.ball.y - state.p2.y}

    state.dir = this.normalize(state.dir)
  }

  movePlayer(state: State, player: number, isMoving: boolean, moveUp: boolean) {
    if (player === 0){
      state.moveP1.isMoving = isMoving;
      state.moveP1.up = moveUp;
    } else {
      state.moveP2.isMoving = isMoving;
      state.moveP2.up = moveUp;
    }
  }

}