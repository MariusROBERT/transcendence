import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { User } from '../utils/decorators/user.decorator';
import { ChannelEntity } from '../database/entities/channel.entity';
import { UserEntity } from '../database/entities/user.entity';
import { AddMsgDto } from './dto/add-msg.dto';
import { MessageEntity } from '../database/entities/message.entity';

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
