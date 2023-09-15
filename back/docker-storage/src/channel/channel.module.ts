import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { MessageEntity } from 'src/database/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity, UserEntity, MessageEntity]),
    AuthModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, UserService, MessagesService, ChatGateway],
})
export class ChannelModule {}
