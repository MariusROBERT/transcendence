import { Controller } from '@nestjs/common';
import { MessagesService } from './messages.service';

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
