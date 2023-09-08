import { ConflictException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { ChannelDto, CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
    constructor (
        @InjectRepository(ChannelEntity)
        private ChannelRepository: Repository<ChannelEntity>,
        private userService: UserService
    ) {
    }

    async createChannel(channel: CreateChannelDto, user: UserEntity): Promise<ChannelEntity> {
        try {
            await this.ChannelRepository.findOne({ where: { channel_name: channel.channel_name } });
        }
        catch (e) {
            try {
                const newChannel = this.ChannelRepository.create({
                    ...channel,
                });
                await this.ChannelRepository.save(newChannel);
                newChannel.owner = user;
                newChannel.admin = [];
                newChannel.admin.push(user);
                return newChannel
            } catch (e) {
            }
        }
        throw new ConflictException(`Le channel_name: ${channel.channel_name} est déjà utilisé.`)
    }

    async getChannelById(id: number): Promise<ChannelDto> { // meme ca ca marche pas zbi alors que getUserById fonctionne sur le meme putain de principe 
        const channel = await this.ChannelRepository.findOne({ where: {id}});
        if (!channel)
            throw new NotFoundException(`le channel ${id} n'existe pas`)

        const chan = new ChannelDto();
        chan.id = channel.id;
        chan.channel_name = channel.channel_name;
        chan.chan_status = channel.chan_status;
        return chan;
    }

    async updateChannel(id: number, channelDto: UpdateChannelDto, user: UserEntity): Promise<ChannelEntity> {
        try {
            const chan = await this.getChannelById(id);
        } catch (e)
        {
            // c'est pas normal que ca existe pas
            throw new NotFoundException(`la channel d'id: ${id} n'existe pas TA MERE`)
        }
        const channelToUpdate = await this.ChannelRepository.preload({
            id, // search user == id
            ...channelDto // modif seulement les differences
        })
        if (!channelToUpdate)
            throw new NotFoundException(`la channel d'id: ${id} n'existe pas`)
        
        if (this.userService.isChanOwner(user, channelToUpdate)) // marche pas --> voir fonction isChanOwner
            return await this.ChannelRepository.save(channelToUpdate) // la modification fonctionne en revanche
        else
            throw new UnauthorizedException(`You're not authorize to update this channel because you're the owner or an admin`)
    }

    async removeChannel(id: number, user: UserEntity): Promise<ChannelEntity> {
        const chanToRemove = await this .ChannelRepository.findOne({where: {id}})
        if (this.userService.isChanOwner(user, chanToRemove) || this.userService.isChanAdmin(user, chanToRemove))
            return await this.ChannelRepository.remove(chanToRemove)
        else
            throw new UnauthorizedException(`Vous n'etes pas autorisé à supprimer cette channel`)
    }

}
