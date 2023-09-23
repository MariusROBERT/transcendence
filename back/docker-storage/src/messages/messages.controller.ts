import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { AddMsgDto } from './dto/add-msg.dto';
import { MessageEntity } from '../database/entities/message.entity';

@Controller('messages')
export class MessagesController {
  ChannelService: any;

  constructor(private MessageService: MessagesService) {}

  //@Post()
  //@UseGuards(JwtAuthGuard)
  //async AddMessage(@Body() AddMsgDto: AddMsgDto): Promise<MessageEntity> {
  //  return await this.MessageService.addMsg(AddMsgDto);
  //}
}
