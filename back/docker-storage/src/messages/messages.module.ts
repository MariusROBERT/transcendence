import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesService } from './messages.service';
import { MessageEntity } from 'src/database/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    AuthModule
  ],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}
