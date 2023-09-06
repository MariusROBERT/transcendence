import { Injectable, } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class ChannelService {

    constructor (
        @InjectRepository(ChannelEntity) 
        private ChannelRepository: Repository<ChannelEntity>,
        private authService: AuthService
    ) {
    }

    async getAllChannel(user: UserEntity): Promise<ChannelEntity[]>
    {
        return await this.ChannelRepository.find({
            where: {
                users: { id: user.id }
            }
        })
    }

 
}
