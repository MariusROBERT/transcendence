import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { MessageEntity } from 'src/database/entities/message.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { AddMsgDto } from './add-msg.dto';
import { ChannelEntity } from 'src/database/entities/channel.entity';

@Injectable()
export class MessagesService {
    constructor (
        @InjectRepository(MessageEntity)
        private messageRepository: Repository<MessageEntity>,
        private authService: AuthService
    ) {
    }

    async addMsg(msg: AddMsgDto, user: UserEntity, channel: ChannelEntity) {
        const newMsg = this.messageRepository.create(msg)
        newMsg.channel = channel;
        newMsg.sender = user;
        return await this.messageRepository.save(newMsg)
    }

    
}
