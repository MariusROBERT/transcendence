import { Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
    constructor (
        @InjectRepository(ChannelEntity) 
        private ChannelRepository: Repository<ChannelEntity>,
        private authService: AuthService,
        private userService: UserService
    ) {
    }

    // async createChannel(channel: CreateChannelDto, user: UserEntity): Promise<ChannelEntity> {
    //     const newChannel = this.ChannelRepository.create(channel)
    //     newChannel.owner = user
    //     newChannel.admin.push(user)      
    //     return await this.ChannelRepository.save(newChannel)
    // }

    // async updateChannel(id: number, channel: UpdateChannelDto, user: UserEntity): Promise<ChannelEntity> {
    //     const newChannel = await this.ChannelRepository.preload({
    //         id, // search user == id
    //         ...channel // modif seulement les differences
    //     })
    //     if (!newChannel)
    //         throw new NotFoundException(`le user ${id} n'existe pas`)
    //     if (this.userService.isOwner(newChannel, user))
    //         return await this.ChannelRepository.save(newChannel)
    // }

    // async removeChannel(id: number, user: UserEntity): Promise<ChannelEntity> {
    //     const chanToRemove = await this .ChannelRepository.findOne({where: {id}})
    //     if (this.userService.isChanOwner(user, chanToRemove) || this.userService.isChanAdmin(user, chanToRemove))
    //         return await this.ChannelRepository.remove(chanToRemove)
    //     else
    //         throw new UnauthorizedException(`Vous n'etes pas autorisé à supprimer cette channel`)
    // }

}
