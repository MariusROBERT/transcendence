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
        if (this.isOwner(newProfil, user))
            return await this.UserRepository.save(newProfil)
    }

    async getProfile(id: number, user: UserEntity): Promise<UserEntity> {
        const profile = await this.UserRepository.findOne({ where: {id} });
        if (!profile)
            throw new NotFoundException(`le user ${id} n'appartient pas a ce channel`)
        if (this.isOwner(profile, user))
            return profile
    }

// CHANNEL :

    async getChannels(user: UserEntity, channel: ChannelEntity[]): Promise<ChannelEntity[]> {
        // return await this.ChannelRepository
        // .createQueryBuilder('channel')
        // .innerJoin('channel.users', 'user') // Supposons que "users" est le nom de la colonne de jointure entre ChannelEntity et UserEntity
        // .where('user.id = :userId', { userId: user.id })
        // .getMany();

        return await this.ChannelRepository
            .createQueryBuilder('channels')
            .leftJoinAndSelect('channels.users', 'user')
            .where('user.id = :userId', { userId: user.id })
            .getMany();

    }

    async isInChannel(id: number, channel: ChannelEntity) {
        const user = await this.ChannelRepository.findOne( {where: {id}} )
        if (!user)
            return false
        return true
    }

    async getMsgsByChannel(user: UserEntity, channels: ChannelEntity[], id: number): Promise<MessageEntity[]> {
        const channel = await this.ChannelRepository.findOne( {where: {id}} )
        if (!channel)
            throw new NotFoundException(`le channel d'id ${id} n'existe pas`)
        if (this.isInChannel(user.id, channel))
            return channel.messages
        else
            throw new NotFoundException(`le user ${id} n'appartient pas a ce channel`)

    }

// UTILS : 

    isOwner(objet: any, user: UserEntity): boolean {
        return (objet.user && user.id === objet.user.id)
    }

    isChanOwner(user: UserEntity, channel: ChannelEntity): boolean {
        return (channel.owner.id == user.id)
    }

    isChanAdmin(user: UserEntity, channel: ChannelEntity): boolean {
        if (!channel.admin)
            return false;
        // Vérifiez si l'utilisateur existe dans la liste des administrateurs
        const isAdmin = channel.admin.some(adminUser => adminUser.id === user.id);
        return isAdmin;
    }

}