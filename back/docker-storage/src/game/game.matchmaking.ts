import { Injectable } from '@nestjs/common';
import { GameController } from './game.controller';
import { gameRoom, size } from './game.interfaces';
import { delay } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { GameEntity } from 'src/database/entities/game.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameMatchmaking {
  
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    private service: UserService
  ) {}

  controller: GameController;
  
  setController(controller: GameController) {
    this.controller = controller;
  }

  async addGame(user1:UserEntity, user2: UserEntity, n1:number, n2:number) {
    
    const winner = (n1 > n2 ? user1.id : user2.id);
    const newGame = this.gameRepository.create({
      player1: user1.id,
      player2: user2.id,
      elo1:    user1.elo,
      elo2:    user2.elo,
      points1: n1,
      points2: n2,
      winner:  winner,
      date:    new Date(),
    });
    await this.gameRepository.save(newGame);
    return (newGame.id);
  }

  //returns a Game with 1 given or the 2 given player
  getGame(p1: number, p2: number | undefined = undefined): gameRoom {
    if (p2 == null)
      return this.controller.games.find((g) => g.playerIds.includes(p1));
    return this.controller.games.find(
      (g) => g.playerIds.includes(p1) && g.playerIds.includes(p2),
    );
  }

  async joinQueue(id: number, isSpecial: boolean = false) {
    this.controller.queue = this.controller.queue.filter(
      (id) => this.getGame(id) === undefined,
    );
    this.controller.queueSpecial = this.controller.queueSpecial.filter(
      (id) => this.getGame(id) === undefined,
    );

    if (!isSpecial && !this.controller.queue.includes(id))
      this.controller.queue.push(id);
    else if (isSpecial && !this.controller.queueSpecial.includes(id))
      this.controller.queueSpecial.push(id);

    // console.log('after join: \nSpecial  ', this.controller.queueSpecial, '\nNormal  ', this.controller.queue);
    await this.tryLaunchGames();
  }

  // try launch games as long as there is more than 2 players in the queue
  async tryLaunchGames() {
    while (this.controller.queue.length >= 2) {
      this.controller.queue = this.controller.queue.filter(
        (id) => this.getGame(id) === undefined,
      );
      await this.createGame(
        this.controller.queue[0],
        this.controller.queue[1],
        false,
      );
      this.controller.queue.slice(2);
    }

    while (this.controller.queueSpecial.length >= 2) {
      this.controller.queueSpecial = this.controller.queueSpecial.filter(
        (id) => this.getGame(id) === undefined,
      );
      await this.createGame(
        this.controller.queueSpecial[0],
        this.controller.queueSpecial[1],
        true,
      );
      this.controller.queueSpecial.slice(2);
    }
  }

  // add a new game in the games lists
  async createGame(p1: number, p2: number, isSpecial: boolean) {
    const game: gameRoom = {
      playerIds: [p1, p2],
      state: {
        running: true,
        isSpecial: isSpecial,
        balls: [],
        p1: size.height / 2,
        p2: size.height / 2,
        score: { p1: 0, p2: 0 },
        player_speed: 1,
        moveP1: { isMoving: false, up: false },
        moveP2: { isMoving: false, up: false },
      },
      ready: [],
    };
    this.controller.games.push(game);
    this.controller.gateway.openGame(game.playerIds);
  }

  async leaveGame(id: number) {
    const game = this.getGame(id);
    if (game === undefined) return;
    const playerNumber = game.playerIds.indexOf(id);
    if (playerNumber === 0)
      game.state.score.p1 = -1;
    else
      game.state.score.p2 = -1;
    return this.endGame(id);
  }

  //Called from each player before starting
  async startGame(id: number) {
    //check if the two players are free and stops there games
    const game = this.getGame(id);
    if (game === undefined) return;

    //add players to the ready array
    if (game.ready.includes(id)) return;
    game.ready.push(id);

    // if all there launch the game
    if (game.ready.length == 2) {
      await this.controller.service.startNewRound(game.state);
      this.controller.service.update(game);
    }
  }

  async endGame(id: number) {
    //find game
    let game = this.getGame(id);
    if (game === undefined)
      return 'game not found';

    const user1 = await this.service.getUserById(game.playerIds[0]);
    const user2 = await this.service.getUserById(game.playerIds[1]);

    // user1.gamesId = [...user1.gamesId, id];
    // user2.gamesId = [...user2.gamesId, id];
    
    // user1.elo =
    
    //stop the game
    if (game.state.running) {
      game.state.running = false;
      //wait 1 frame
      await delay(35);
    }

    this.controller.games = this.controller.games.filter(g => !g.playerIds.includes(id));

    let gameId = await this.addGame(user1, user2, game.state.score.p1, game.state.score.p2);
    let player1Won = game.state.score.p1 > game.state.score.p2;
    await this.service.endOfGameUpdatingProfile(gameId, user1, player1Won);
    await this.service.endOfGameUpdatingProfile(gameId, user2, !player1Won);
    //TODO: Save game score and update dataBase here

    // remove the game from the controller's games
    this.controller.games = this.controller.games.filter((g) => g !== game);

    // send end Game to the player's front
    await this.controller.gateway.endGame(game.playerIds);

    // remove the game from the controller's games
    this.controller.games = this.controller.games.filter(g => !g.playerIds.includes(id));
    // dev msg
    return 'game end';
  }

  async getLastGame(playerId: number) : Promise<{game: GameEntity}> {
    const games = await this.gameRepository.find({
      where: [{ player1: playerId }, { player2: playerId }],
      order: { date: 'DESC' }, // Tri par date décroissante pour obtenir la dernière partie
      take: 1, // Limitation à une seule partie (la dernière)
    });
    return {game:games[0]};
  }
}

