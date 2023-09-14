import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { User } from 'src/utils/decorators/user.decorator';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { AddMsgDto } from './dto/add-msg.dto';
import { MessageEntity } from 'src/database/entities/message.entity';

@Controller('messages')
export class MessagesController {
  ChannelService: any;
  constructor(private MessageService: MessagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async AddMessage(
    @Body() AddMsgDto: AddMsgDto,
    @User() user: UserEntity,
    channel: ChannelEntity,
  ): Promise<MessageEntity> {
    return await this.MessageService.addMsg(AddMsgDto, user, channel);
  }
}
