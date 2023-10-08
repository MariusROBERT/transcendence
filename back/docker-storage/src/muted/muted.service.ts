import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity, UserEntity } from 'src/database/entities/channel.entity';
import { MutedEntity } from 'src/database/entities/muted.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MutedService {
    constructor(
    @InjectRepository(MutedEntity)
    private mutedRepository: Repository<MutedEntity>
    ) {}

    async removeMuted(channel: ChannelEntity, user: UserEntity)
    {
        const if_exist = await this.getMutedInChannel(channel.id, user.id)
        if (if_exist)
            await this.mutedRepository.remove(if_exist);
    }

    async createMuted(channel: ChannelEntity, user: UserEntity, time: number)
    {
        await this.removeMuted(channel, user);
        const date = new Date();
        date.setSeconds(date.getSeconds() + time);
        const muted = this.mutedRepository.create();
        muted.channel = channel;
        muted.user = user;
        muted.endDate = date;
        this.mutedRepository.save(muted);
        return muted;
    }

    async getMutedInChannel(id: number, user: number) {
        return await this.mutedRepository.findOne({
            where: { user: { id: user }, channel: { id: id } },
        });
    }
}
