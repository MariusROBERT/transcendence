import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../database/entities/user.entity';
import {
  ChannelEntity,
  MessageEntity,
} from '../database/entities/channel.entity';
import { ChannelModule } from '../channel/channel.module';
import { DatabaseModule } from '../database/database.module';
import { MessagesModule } from '../messages/messages.module';
import { MessagesService } from '../messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChannelEntity, MessageEntity]),
    DatabaseModule,
    AuthModule,
    ChannelModule,
    MessagesModule,
  ],
  controllers: [UserController],
  providers: [UserService, MessagesService],
  exports: [UserService],
})
export class UserModule {
}
