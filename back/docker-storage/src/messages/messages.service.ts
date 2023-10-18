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
    private messageRepository: Repository<MessageEntity>, // private authService: AuthService,
  ) {
  }

  async delete(msgs: MessageEntity[]) {
    return this.messageRepository.remove(msgs);
  }

  async addMsg(message: string, user: UserEntity, chan: ChannelEntity) {
    const newMsg = this.messageRepository.create({
      content: message,
      sender: user,
      channel: chan,
    });
    return await this.messageRepository.save(newMsg);
  }

  async getIds(channelId: number) {
    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.channel', 'channel')
      .where('channel.id = :channelId', { channelId })
      .getMany();
  }

  async getMsg(channelId: number) {
    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.channel', 'channel')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('channel.id = :channelId', { channelId })
      .select([
        'channel.id',
        'message.content',
        'message.createdAt',
        'sender.username',
        'sender.id',
        'sender.urlImg',
      ])
      .getRawMany();
  }
}
