import { Injectable } from '@nestjs/common';
import { GameController } from './game.controller';
import { gameRoom, size } from './game.interfaces';
import { delay } from 'rxjs';

@Injectable()
export class GameMatchmaking {
  controller: GameController;

  setController(controller: GameController) {
    this.controller = controller;
  }

  //returns a Game with 1 given or the 2 given player
  getGame(p1:number, p2:number | undefined = undefined): gameRoom{
    if (p2 == null)
      return this.controller.games.find(g => g.playerIds[0] == p1 || g.playerIds[1] == p1);
    return this.controller.games.find(g =>
      (g.playerIds[0] == p1 && g.playerIds[1] == p2)
      || (g.playerIds[0] == p2 && g.playerIds[1] == p1))
  }

  async joinQueue(queue: number[], id: number, isSpecial:boolean = false){
    // console.log('user:', id, ' is joined the queue');
    queue.push(id);
    await this.tryLaunchGames(queue, isSpecial);
  }

  // try launch games as long as there is more than 2 players in the queue
  async tryLaunchGames(queue: number[], isSpecial: boolean){
    while (queue.length >= 2){
      // console.log('try lanch game with:',queue[0] ,' and ', queue[1]);
      queue = queue.filter(id => this.getGame(id) === undefined);
      await this.createGame(queue[0], queue[1], isSpecial);
      queue.slice(2);
    }
  }

  // add a new game in the games lists
  async createGame(p1: number, p2:number, isSpecial){
    const room = await this.controller.gateway.createRoom(p1, p2);
    if (room === undefined)
      return;
    let game = {
      room: room,
      playerIds: [p1, p2],
      state: {
        running: true,
        isSpecial: isSpecial,
        ball: {x:size.width / 2, y:size.height / 2},
        dir: this.controller.service.normalize({x:Math.random() * 2 - 1, y:Math.random() * 2 - 1}),
        p1: {x:size.ball / 2, y:size.height / 2},
        p2: {x:size.width - size.ball / 2, y:size.height / 2},
        score: {p1: 0, p2: 0},
        speed: 1,
        moveP1: {isMoving: false, up: false},
        moveP2: {isMoving: false, up: false}
      },
      ready:false
    };
    this.controller.games.push(game);
    // console.log('game was created:', room);
    this.controller.gateway.openGame(room);
  }

  async quitGame(id: number){
    const game = this.getGame(id);
    if (game === undefined) return;
    const playerNumber = game.playerIds.indexOf(id);
    if (playerNumber === 0)
      game.state.score.p1 = 0;
    else
      game.state.score.p2 = 0;
    return this.endGame(id);
  }

  //Called from each player before starting
  startGame(id: number) {
    //check if the two players are free and stops there games
    let game = this.getGame(id);
    if (game === undefined) return;

    //first call set ready to true and second start the update function
    if (!game.ready)
      game.ready = true;
    else
      this.controller.service.update(game);
  }

  async endGame(id: number){
    //find game
    let game = this.getGame(id);
    if (game === undefined)
      return 'game not found';

    //stop the game
    if (game.state.running) {
      game.state.running = false;
      //wait 1 frame
      await delay(35);
    }

    //TODO: Save game score and update dataBase here

    //TODO: Send front event to show the GameOverPanel

    // leave the room
    (await this.controller.gateway.getSocketFromUser(game.playerIds[0]))?.leave(game.room);
    (await this.controller.gateway.getSocketFromUser(game.playerIds[1]))?.leave(game.room);

    // remove the game from the controller's games
    this.controller.games = this.controller.games.filter(g => g.playerIds[0] != id || g.playerIds[1] != id);
    // dev msg
    return 'game end';
  }

}
