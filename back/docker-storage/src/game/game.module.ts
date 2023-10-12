import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { UserModule } from '../user/user.module';
import { GameMatchmaking } from './game.matchmaking';

@Module({
  imports: [UserModule],
  providers: [GameService, GameMatchmaking, GameGateway],
  controllers: [GameController],
})
export class GameModule {
}
