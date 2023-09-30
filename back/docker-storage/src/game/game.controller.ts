import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GameService } from "./game.service";
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
    public matchmaking: GameMatchmaking)
  {
    this.service.setController(this);
    this.gateway.setController(this);
    this.matchmaking.setController(this);
  }

  @Get('/in_queue/:id')
  async isInQueue(@Param('id', ParseIntPipe) id: number): Promise<{ isInQueue: undefined | 'normal' | 'special' }> {
    await this.matchmaking.tryLaunchGames();
    if (this.queue.includes(id)) {
      return { isInQueue: 'normal' };
    }
    if (this.queueSpecial.includes(id)) {
      return { isInQueue: 'special' };
    }
    return { isInQueue: undefined };
  }
}
