import {Injectable} from '@nestjs/common';
import {Ball, clamp, delay, gameRoom, size, State, Vector2,} from './game.interfaces';
import {GameController} from './game.controller';
import {GameEntity} from 'src/database/entities/game.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {PublicGameDto} from './game.dto';
import {UserEntity} from '../database/entities/user.entity';

//rajout pour le matchmeking
@Injectable()
export class GameService {
  controller: GameController;

  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private UserRepository: Repository<UserEntity>,
  ) {
  }

  setController(controller: GameController) {
    this.controller = controller;
  }

  // GAME LOGIC ------------------------------------------------------------- //
  frameRate: number = 1000 / 120;

  //called at the start of the game and then every frame till the game ends
  async update(game: gameRoom) {
    //check for the end game conditions
    if (
      (game.state.isSpecial && (game.state.score.p1 >= 10 || game.state.score.p2 >= 10))
      || (game.state.score.p1 >= 20 || game.state.score.p2 >= 20)
      || !game.state.running
    ) {
      game.state.running = false;
      return this.controller.matchmaking.endGame(game.playerIds[0]);
    }
    //call the logic in async function
    this.updateLogic(game.state);

    //await for a 60hz frame
    await delay(this.frameRate);

    //send the new state to the gateway
    this.controller.gateway.sendState(game);

    //and call itself again
    return this.update(game);
  }

  // called every frame to update the state of the game
  async updateLogic(state: State) {
    // move the players
    this.movePlayerBar(state);

    //if there is no ball, return
    if (state.balls.length === 0) return;

    //move the ball to the current direction
    for (let i = 0; i < state.balls.length; i++) {
      state.balls[i].update();
    }

    //check if the ball enter a 'GOAL'
    this.goal(state);

    // remove the balls that are out of the screen
    state.balls = state.balls.filter(
      (b) => b.pos.x > 0 && b.pos.x < size.width,
    );

    // Start the new Round
    if (state.balls.length === 0) return this.startNewRound(state);

    //manage the 'physics' of the game
    this.bounce(state);

    //increase progressively the speed of players
    state.player_speed = Math.min(state.player_speed + 0.001, 7);

    //increase progressively the speed of balls
    for (let i = 0; i < state.balls.length; i++) {
      state.balls[i].speed = Math.min(state.balls[i].speed + 0.002, 10);
    }
  }

  onPlayerMove(
    state: State,
    player: number,
    isMoving: boolean,
    moveUp: boolean,
  ) {
    if (player === 0) {
      state.moveP1.isMoving = isMoving;
      state.moveP1.up = moveUp;
    } else {
      state.moveP2.isMoving = isMoving;
      state.moveP2.up = moveUp;
    }
  }

  private movePlayerBar(state: State) {
    if (state.moveP1.isMoving) {
      state.p1 += state.moveP1.up ? -state.player_speed : state.player_speed;
      state.p1 = clamp(
        state.p1,
        size.ball * 1.5 + size.halfBar,
        size.height - size.ball * 1.5 - size.halfBar,
      );
    }
    if (state.moveP2.isMoving) {
      state.p2 += state.moveP2.up ? -state.player_speed : state.player_speed;
      state.p2 = clamp(
        state.p2,
        size.ball * 1.5 + size.halfBar,
        size.height - size.ball * 1.5 - size.halfBar,
      );
    }
  }

  private goal(state: State) {
    for (let i = 0; i < state.balls.length; i++) {
      const ball = state.balls[i];
      if (ball.pos.x < 0 || ball.pos.x > size.width) {
        // Update Score
        if (ball.pos.x < 0) state.score.p2 += 1;
        if (ball.pos.x > size.width) state.score.p1 += 1;
      }
    }
  }

  //manage the 'physics' of the game
  private bounce(state: State) {
    //up and down collision
    for (let i = 0; i < state.balls.length; i++) {
      const ball = state.balls[i];
      ball.bounceWithWall();
      ball.bounceWithPlayers(state);
      for (let j = i + 1; j < state.balls.length; j++) {
        ball.bounceWithBall(state.balls[j]);
      }
    }
  }

  // Start New Round -------------------------------------------------------- //
  async startNewRound(state: State) {
    //wait 1 second
    await delay(1000);
    if (!state.isSpecial) return this.startNewRoundNormal(state);

    const mod = this.getRandomMod();
    switch (mod) {
      case '2_balls':
        return this.startNewRound2Balls(state);
      case 'speed_up':
        return this.startNewRoundSpeedUp(state);
      case 'speed_down':
        return this.startNewRoundSpeedDown(state);
      case 'big_bar':
        return this.startNewRoundBigBar(state);
    }
  }

  private startNewRoundNormal(state: State) {
    state.balls.push(
      new Ball(
        new Vector2(size.width / 2, size.height / 2),
        new Vector2(1, 1),
        Math.max(state.player_speed - 2, 1),
        0,
      ),
    );
    state.player_speed = Math.max(state.player_speed - 2, 1);
  }

  // Mod New Rounds --------------------------------------------------------- //
  private getRandomMod() {
    const mod = Math.floor(Math.random() * 4);
    switch (mod) {
      case 0:
        return '2_balls';
      case 1:
        return 'speed_up';
      case 2:
        return 'speed_down';
      case 3:
        return 'big_bar';
    }
  }

  private startNewRound2Balls(state: State) {
    this.createNBalls(state, 2);
    state.player_speed = Math.max(state.player_speed - 2, 1);
  }

  private createNBalls(state: State, n: number) {
    const yposincr = (size.height - 2 * size.ball) / (n + 1);
    let ypos = size.ball + yposincr;
    for (let i = 0; i < n; i++) {
      state.balls.push(
        new Ball(
          new Vector2(size.width / 2, ypos),
          new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1),
          1,
          i,
        ),
      );
      ypos += yposincr;
    }
  }

  private startNewRoundSpeedUp(state: State) {
    //place holder
    this.createNBalls(state, 7);
    state.player_speed = Math.max(state.player_speed - 2, 1);
  }

  private startNewRoundSpeedDown(state: State) {
    //place holder
    this.createNBalls(state, 3);
    state.player_speed = Math.max(state.player_speed - 2, 1);
  }

  private startNewRoundBigBar(state: State) {
    //place holder
    this.createNBalls(state, 4);
    state.player_speed = Math.max(state.player_speed - 2, 1);
  }

  async getGames(playerId: number): Promise<{ gameHist: PublicGameDto[] }> {
    let gameHist: PublicGameDto[] = [];
    const games = await this.gameRepository.find({
      where: [{player1: playerId}, {player2: playerId}],
      order: {date: 'DESC'},
      // take: 10, //limitation a 10 parties pour le moment
    });
    const user = await this.UserRepository.findOne({
      where: {id: playerId}
    });
    for (const element of games) {
      let game: PublicGameDto = new PublicGameDto();
      if (element.player1 == playerId) {
        const opponent = await this.UserRepository.findOne({
          where: {id: element.player2}
        });
        game.idUser = playerId;
        game.user = user.username;
        game.eloUser = element.elo1;
        game.scoreUser = element.points1;
        game.urlImgUser = user.urlImg;
        game.idOpponent = opponent.id;
        game.opponent = opponent.username;
        game.urlImgOpponent = opponent.urlImg;
        game.eloOpponent = element.elo2;
        game.scoreOpponent = element.points2;
      } else {
        const opponent = await this.UserRepository.findOne({
          where: {id: element.player1}
        });
        game.idUser = playerId;
        game.user = user.username;
        game.eloUser = element.elo2;
        game.scoreUser = element.points2;
        game.urlImgUser = user.urlImg;
        game.idOpponent = opponent.id;
        game.opponent = opponent.username;
        game.urlImgOpponent = opponent.urlImg;
        game.eloOpponent = element.elo1;
        game.scoreOpponent = element.points1;
      }
      game.id = element.id;
      game.date = element.date;
      gameHist.push(game);
    }
    return {gameHist};
  }
}
