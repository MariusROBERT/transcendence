import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChannelEntity } from '../database/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private ChannelRepository: Repository<ChannelEntity>,
    private userService: UserService,
  ) {}

  async createChannel(
    channel: CreateChannelDto,
    user: UserEntity,
  ): Promise<ChannelEntity> {
    const chan = this.ChannelRepository.create({
      ...channel,
    });

    chan.owner = user;
    chan.admins = [];
    chan.admins.push(user);
    try {
      await this.ChannelRepository.save(chan);
    } catch (e) {
      throw new ConflictException('alreday used');
    }
    return chan;
  }

  async getChannelById(id: number): Promise<ChannelEntity> {
    const channel = await this.ChannelRepository.findOne({
      where: { id },
      relations: ['admins'],
    });
    if (!channel)
      throw new NotFoundException(`Le channel d'id ${id}, n'existe pas`);
    return channel;
  }

  async updateChannel(
    id: number,
    channelDto: UpdateChannelDto,
    user: UserEntity,
  ): Promise<ChannelEntity> {
    const chan = await this.getChannelById(id);
    const channelToUpdate = await this.ChannelRepository.preload({
      id, // search user == id
      ...channelDto, // modif seulement les differences
    });
    if (!channelToUpdate)
      throw new NotFoundException(`la channel d'id: ${id} n'existe pas`);
    if (
      this.userService.isChanOwner(user, chan) ||
      this.userService.isChanAdmin(user, chan)
    )
      return await this.ChannelRepository.save(channelToUpdate);
    // la modification fonctionne en revanche
    else
      throw new UnauthorizedException(
        `You're not authorize to update this channel because you're the owner or an admin`,
      );
  }

  async addUserInChannel(user: UserEntity, id: number): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    channel.users = [...channel.users, user];
    await this.ChannelRepository.save(channel);
    return channel;
  }

  async addAdminInChannel(
    user: UserEntity,
    id: number,
  ): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    channel.admins = [...channel.admins, user];
    await this.ChannelRepository.save(channel);
    return channel;
  }

  async KickUserFromChannel(
    user: UserEntity,
    id: number,
  ): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    if (channel.priv_msg == true)
      throw new Error('This channel is a private message channel');
    //  Todo: Check if admin can be kicked
    if (channel.admins.includes(user) || channel.owner == user)
      throw new Error('The user is admin or owner');
    if (channel.baned.includes(user)) throw new Error('The user is banned');
    if (channel.users.includes(user))
      throw new Error('The user is not in channel');
    channel.users.indexOf(user) !== -1 &&
      channel.users.splice(channel.users.indexOf(user), 1);
    await this.ChannelRepository.save(channel);
    return channel;
  }

  async MuteUserFromChannel(
    user: UserEntity,
    id: number,
    sec: number,
  ): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    if (channel.priv_msg == true)
      throw new Error('This channel is a private message channel');
    //  Todo: Check if admin can be muted
    if (channel.admins.includes(user) || channel.owner == user)
      throw new Error('The user is admin or owner');
    if (channel.baned.includes(user)) throw new Error('The user is banned');
    if (sec <= 0)
      throw new Error('Time in second cannot be equal or inferior to zero');
    //  Todo: Check if user is already muted, if it is juste update the Date
    var date = new Date(); // Get the current date
    date.setSeconds(date.getSeconds() + sec); // Add time in second to the date
    var muteEntity: MutedEntity;
    muteEntity.channel = channel;
    muteEntity.user = user;
    muteEntity.endDate = date;
    channel.mutedUsers = [...channel.mutedUsers, muteEntity];
    await this.ChannelRepository.save(channel);
    return null;
  }

  async BanUserFromChannel(
    user: UserEntity,
    id: number,
  ): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    if (channel.priv_msg == true)
      throw new Error('This channel is a private message channel');
    //  Todo: Check if admin can be banned
    if (channel.admins.includes(user) || channel.owner == user)
      throw new Error('The user is admin or owner');
    if (channel.baned.includes(user))
      throw new Error('The user is already banned');
    channel.users.indexOf(user) !== -1 &&
      channel.users.splice(channel.users.indexOf(user), 1);
    channel.baned = [...channel.baned, user];
    await this.ChannelRepository.save(channel);
    return channel;
  }
}
