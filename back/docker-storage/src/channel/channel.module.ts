import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChannelEntity } from '../database/entities/channel.entity';
import { UserEntity } from '../database/entities/user.entity';
import { UserService } from '../user/user.service';
import { MessageEntity } from '../database/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity, UserEntity, MessageEntity]),
    AuthModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, UserService, MessagesService, JwtService, ChatGateway],
})
export class ChannelModule {}
