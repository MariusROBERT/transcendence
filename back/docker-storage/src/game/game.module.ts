import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { UserModule } from '../user/user.module';
import { GameMatchmaking } from './game.matchmaking';
import { GameEntity } from 'src/database/entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([GameEntity]),],
  providers: [GameService, GameMatchmaking, GameGateway],
  controllers: [GameController],
})
export class GameModule {}
