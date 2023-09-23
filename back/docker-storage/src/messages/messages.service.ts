import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { MessageEntity } from '../database/entities/message.entity';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { AddMsgDto } from './dto/add-msg.dto';
import { ChannelEntity } from '../database/entities/channel.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    private authService: AuthService,
  ) {}

  async addMsg(message: string, user: UserEntity, chan: ChannelEntity) {
    // console.log("got here");
    const id = chan.id;
    const newMsg = this.messageRepository.create({content:message, sender: user, channel: chan});
    // console.log("CHAN:" + chan.channel_name);
    return await this.messageRepository.save(newMsg);
  }

  async getMsg(channelId: number)
  {
    //var msgs = await this.messageRepository.find({
    //  where: {c: channelId},
    //})
    var msgs= await this.messageRepository.createQueryBuilder("message")
                        .leftJoinAndSelect("message.channel", "channel")
                        .where('channel.id = :channelId', { channelId })
                        .execute();
    return msgs;
  }
}
