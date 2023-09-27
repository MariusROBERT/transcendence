import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../database/entities/message.entity';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../database/entities/channel.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    // private authService: AuthService,
  ) {
  }

  async addMsg(message: string, user: UserEntity, chan: ChannelEntity) {
    // console.log("got here");
    const newMsg = this.messageRepository.create({ content: message, sender: user, channel: chan });
    // console.log("CHAN:" + chan.channel_name);
    return await this.messageRepository.save(newMsg);
  }
}
