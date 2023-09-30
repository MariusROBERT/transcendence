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
  getGame(p1: number, p2: number | undefined = undefined): gameRoom {
    if (p2 == null)
      return this.controller.games.find(g => g.playerIds.includes(p1));
    return this.controller.games.find(g => g.playerIds.includes(p1) && g.playerIds.includes(p2));
  }

  async joinQueue(id: number, isSpecial:boolean = false){
    this.controller.queue = this.controller.queue.filter(id => this.getGame(id) === undefined);
    this.controller.queueSpecial = this.controller.queueSpecial.filter(id => this.getGame(id) === undefined);

    if (!isSpecial && !this.controller.queue.includes(id))
      this.controller.queue.push(id);

    else if (isSpecial && !this.controller.queueSpecial.includes(id))
      this.controller.queueSpecial.push(id);

    // console.log(isSpecial ? 'Special \n' + this.controller.queueSpecial : 'Normal \n', this.controller.queue);
    await this.tryLaunchGames();
  }

  // try launch games as long as there is more than 2 players in the queue
  async tryLaunchGames(){
    while (this.controller.queue.length >= 2){
      this.controller.queue = this.controller.queue.filter(id => this.getGame(id) === undefined);
      await this.createGame(this.controller.queue[0], this.controller.queue[1], false);
      this.controller.queue.slice(2);
    }

    while (this.controller.queueSpecial.length >= 2){
      this.controller.queueSpecial = this.controller.queueSpecial.filter(id => this.getGame(id) === undefined);
      await this.createGame(this.controller.queueSpecial[0], this.controller.queueSpecial[1], true);
      this.controller.queueSpecial.slice(2);
    }
  }

  // add a new game in the games lists
  async createGame(p1: number, p2:number, isSpecial){
    let game = {
      playerIds: [p1, p2],
      state: {
        running: true,
        isSpecial: isSpecial,
        ball: {x:size.width / 2, y:size.height / 2},
        dir: this.controller.service.normalize({x:Math.random() * 2 - 1, y:Math.random() * 2 - 1}),
        p1: size.height / 2,
        p2: size.height / 2,
        score: {p1: 0, p2: 0},
        speed: 1,
        moveP1: {isMoving: false, up: false},
        moveP2: {isMoving: false, up: false}
      },
      ready:[]
    };
    this.controller.games.push(game);
    this.controller.gateway.openGame(game.playerIds);
  }

  leaveGame(id: number){
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

    //add players to the ready array
    if (game.ready.includes(id)) return;
    game.ready.push(id);

    // if all there launch the game
    if (game.ready.length == 2)
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

    await this.controller.gateway.endGame(game.playerIds);

    // remove the game from the controller's games
    this.controller.games = this.controller.games.filter(g => !g.playerIds.includes(id));
    // dev msg
    return 'game end';
  }
}
