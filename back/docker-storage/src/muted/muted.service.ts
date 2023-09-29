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

    async createMuted(channel: ChannelEntity, user: UserEntity, time: number)
    {
        var date = new Date(); // Get the current date
        date.setSeconds(date.getSeconds() + time); // Add time in second to the date
        var muted = this.mutedRepository.create();
        muted.channel = channel;
        muted.user = user;
        muted.endDate = date;
        return muted;
    }

    async getMutedsInChannel(id: number) {
        return this.mutedRepository.find({ where: { channel: { id: id }}});
    }
}
