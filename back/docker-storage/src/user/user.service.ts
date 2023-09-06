import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { MessageEntity } from 'src/database/entities/message.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor (
        @InjectRepository(ChannelEntity)
        private ChannelRepository: Repository<ChannelEntity>,
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>
    ) {
    }

    async IsInChannel(id: number, channel: ChannelEntity) {
        const user = await this.ChannelRepository.findOne( {where: {id}} )
        if (!user)
            return false
        return true
    }

    async getMsgByChannel(user: UserEntity, channels: ChannelEntity[], id: number): Promise<MessageEntity[]> {
        const channel = await this.ChannelRepository.findOne( {where: {id}} )
        if (!channel)
            throw new NotFoundException(`le channel d'id ${id} n'existe pas`)
        if (this.IsInChannel(user.id, channel))
            return channel.messages
        else
            throw new NotFoundException(`le user ${id} n'appartient pas a ce channel`)

    }

}