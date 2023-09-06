import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { MessageEntity } from 'src/database/entities/message.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { UpdateUserDto } from 'src/user/dto/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor (
        @InjectRepository(ChannelEntity)
        private ChannelRepository: Repository<ChannelEntity>,
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>,
        private authService: AuthService
    ) {
    }

// PROFILE :

    async updateProfile(id: number, profil: UpdateUserDto, user: UserEntity): Promise<UserEntity> {
        const newProfil = await this.UserRepository.preload({
            id, // search user == id
            ...profil // modif seulement les differences
        })
        if (!newProfil)
            throw new NotFoundException(`le user ${id} n'existe pas`)
        if (this.authService.isOwner(newProfil, user))
            return await this.UserRepository.save(newProfil)
    }

    async getProfile(id: number, user: UserEntity): Promise<UserEntity> {
        return await 
    }

// CHANNEL :

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