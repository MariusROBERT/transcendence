import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MessagesService } from './messages.service';
import { MessageEntity } from '../database/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), AuthModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {
}
