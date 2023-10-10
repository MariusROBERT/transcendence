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
import { MutedService } from 'src/muted/muted.service';
import { MutedEntity } from 'src/database/entities/muted.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelEntity,
      UserEntity,
      MessageEntity,
      MutedEntity,
    ]),
    AuthModule,
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    UserService,
    MessagesService,
    JwtService,
    MutedService,
    ChatGateway,
  ],
})
export class ChannelModule {
}
