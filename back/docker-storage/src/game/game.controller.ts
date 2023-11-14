import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameMatchmaking } from './game.matchmaking';
import { gameRoom } from './game.interfaces';

@Controller('game')
export class GameController {
  games: gameRoom[] = [];
  queue: number[] = [];
  queueSpecial: number[] = [];

  constructor(
    public service: GameService,
    public gateway: GameGateway,
    public matchmaking: GameMatchmaking,
  ) {
    this.service.setController(this);
    this.gateway.setController(this);
    this.matchmaking.setController(this);
  }

  @Get('/in_queue/:id')
  async isInQueue(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ isInQueue: undefined | 'normal' | 'special' }> {
    await this.matchmaking.tryLaunchGames();
    if (this.queue.includes(id)) {
      return { isInQueue: 'normal' };
    }
    if (this.queueSpecial.includes(id)) {
      return { isInQueue: 'special' };
    }
    return { isInQueue: undefined };
  }

  @Get('/is_in_game/:id')
  async isInGame(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ isInGameWith: number | undefined }> {

    const game = await this.matchmaking.getGame(id);
    if (!game) return { isInGameWith: undefined };

    const inGameWith =
      game.playerIds[0] !== id ? game.playerIds[0] : game.playerIds[1];
    return { isInGameWith: inGameWith };
  }


  @Get('/get_last_game/:id')
  async getScore(@Param('id', ParseIntPipe) id: number) {
    return await this.matchmaking.getLastGame(id);
  }

  @Get('/get_game/:id')
  async getGamesById(@Param('id', ParseIntPipe) id:number){
    return await this.service.getGames(id);
  }
}
