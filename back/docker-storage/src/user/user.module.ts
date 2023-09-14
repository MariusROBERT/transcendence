import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/database/entities/user.entity';
import {
  ChannelEntity,
  MessageEntity,
} from 'src/database/entities/channel.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { DatabaseModule } from 'src/database/database.module';
import { MessagesModule } from 'src/messages/messages.module';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChannelEntity, MessageEntity]),
    DatabaseModule,
    AuthModule,
    ChannelModule,
    MessagesModule,
  ],
  controllers: [UserController],
  providers: [UserService, MessagesService], //, ChannelService]
})
export class UserModule {}
