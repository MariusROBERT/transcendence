import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChannelEntity,
  MessageEntity,
} from 'src/database/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import {
  CreateChannelDto,
  EditChannelDto,
  UpdateChannelDto,
} from './dto/channel.dto';
import { UserService } from 'src/user/user.service';
import { MessagesService } from 'src/messages/messages.service';
import { MutedService } from 'src/muted/muted.service';
import { ChanStateEnum } from 'src/utils/enums/channel.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private ChannelRepository: Repository<ChannelEntity>,
    private userService: UserService,
    private msgService: MessagesService,
    private mutedService: MutedService,
  ) {
  }

  async createChannel(
    channel: CreateChannelDto,
    user: UserEntity,
  ): Promise<ChannelEntity> {
    const chan = this.ChannelRepository.create({
      ...channel,
    });
    chan.owner = user;
    chan.admins = [];
    chan.salt = await bcrypt.genSalt();
    if (chan.password)
      chan.password = await bcrypt.hash(chan.password, chan.salt);
    try {
      await this.ChannelRepository.save(chan);
    } catch (e) {
      throw new ConflictException('Channel already exist');
    }
    return chan;
  }

  async editChannel(dto: EditChannelDto, id: number) {
    let channel = await this.getChannelById(id);

    if (!channel)
      throw new NotFoundException(`Le channel d'id ${id}, n'existe pas`);
    channel.password = null;
    if (dto.password.length > 0)
      channel.password = await bcrypt.hash(dto.password, channel.salt);
    channel.chan_status =
      dto.chan_status === 'private'
        ? ChanStateEnum.PRIVATE
        : ChanStateEnum.PUBLIC;
    return await this.ChannelRepository.save(channel);
  }

  async getChannelById(id: number): Promise<ChannelEntity> {
    const channel = await this.ChannelRepository.findOne({
      where: { id },
    });
    if (!channel)
      throw new NotFoundException(`Le channel d'id ${id}, n'existe pas`);
    return channel;
  }

  async getPublicChannelById(id: number): Promise<ChannelEntity> {
    const channel = await this.ChannelRepository.createQueryBuilder('channel')
      .leftJoin('channel.owner', 'owner')
      .select([
        'channel.id',
        'channel.channel_name as channel_name',
        'channel.chan_status as channel_status',
        'channel.priv_msg',
        'owner.id as owner_id',
      ])
      .where('channel.id = :id', { id })
      .getRawOne();
    if (!channel)
      throw new NotFoundException(`Le channel d'id ${id}, n'existe pas`);
    return channel;
  }

  async getPublicChannelsData(user: UserEntity) {
    const banned = await this.ChannelRepository.createQueryBuilder('channel')
      .innerJoin('channel.baned', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .getMany();
    let channel;
    if (banned.length > 0) {
      channel = await this.ChannelRepository.createQueryBuilder('channel')
        .where('channel.chan_status = :status', {
          status: ChanStateEnum.PUBLIC,
        })
        .andWhere('channel.priv_msg = :priv_msg', { priv_msg: false })
        .andWhere('channel.id NOT IN (:...bannedChannelIds)', {
          bannedChannelIds: banned.map((bannedChannel) => bannedChannel.id),
        })
        .getMany();
    } else {
      channel = await this.ChannelRepository.createQueryBuilder('channel')
        .where('channel.chan_status = :status', {
          status: ChanStateEnum.PUBLIC,
        })
        .andWhere('channel.priv_msg = :priv_msg', { priv_msg: false })
        .getMany();
    }
    return channel.map((channel) => ({
      id: channel.id,
      channel_name: channel.channel_name,
      chan_status: channel.chan_status,
      priv_msg: channel.priv_msg,
      has_password: !!channel.password,
    }));
  }

  async getChannelByName(channel_name: string) {
    const channel = await this.ChannelRepository.findOne({
      where: { channel_name },
      //relations: ['admins'],
    });
    if (!channel)
      throw new NotFoundException(`Le channel ${channel_name}, n'existe pas`);
    return channel;
  }

  async getChannelIdByName(channel_name: string) {
    const channel = await this.ChannelRepository.createQueryBuilder('channel')
      .leftJoin('channel.owner', 'owner')
      .select(['channel.id'])
      .where('channel.channel_name = :channel_name', { channel_name })
      .getOne();
    if (!channel)
      throw new NotFoundException(`Le channel ${channel_name}, n'existe pas`);
    return channel;
  }

  async getChannelMessages(id: number): Promise<MessageEntity[]> {
    return await this.msgService.getMsg(id);
  }

  async getChannelUsers(id: number): Promise<UserEntity[]> {
    return await this.userService.getUsersInChannels(id);
  }

  async getChannelUserRights(id: number, user: UserEntity) {
    const usersInChannel = await this.userService.getUsersInChannels(id);
    for (const currentUser of usersInChannel) {
      if (currentUser.id === user.id) {
        // L'utilisateur actuel est le même que l'utilisateur passé en paramètre
        return { currentUser };
      }
    }
    throw new NotFoundException('User Not Found');
  }

  async getChannelOfUser(id: number): Promise<ChannelEntity[]> {
    const chans = await this.ChannelRepository.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'users')
      .where('users.id = :id', { id })
      .select(['channel.id as id', 'channel.channel_name as name'])
      .getRawMany();
    const admchans = await this.ChannelRepository.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.admins', 'admins')
      .where('admins.id = :id', { id })
      .select(['channel.id as id', 'channel.channel_name as name'])
      .getRawMany();
    const ownchans = await this.ChannelRepository.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.owner', 'owner')
      .where('owner.id = :id', { id })
      .select(['channel.id as id', 'channel.channel_name as name'])
      .getRawMany();
    chans.forEach((chan) => {
      chan['type'] = 'member';
    });
    admchans.forEach((admchans) => {
      admchans['type'] = 'admin';
    });
    ownchans.forEach((ownchans) => {
      ownchans['type'] = 'owner';
    });
    return chans.concat(admchans, ownchans);
  }

  async updateChannel(
    id: number,
    channelDto: UpdateChannelDto,
    uid: number,
  ): Promise<ChannelEntity> {
    const chan = await this.getChannelById(id);
    const user = await this.userService.getUserById(uid);
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
    throw new UnauthorizedException(
      'You\'re not authorize to update this channel because you\'re the owner or an admin',
    );
  }

  async addUserInChannel(userid: number, id: number): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(userid);
    //  TODO ADD THIS TO GUARD
    const allusers = await this.userService.getUsersInChannels(id);
    if (allusers.some((u) => u.id === userid))
      throw new ConflictException('User already in channel');
    const currentUsers = await this.userService.getFullUsersInChannels(id);
    currentUsers.push(user);
    channel.users = currentUsers;
    await this.ChannelRepository.save(channel);
    return channel;
  }

  async leaveChannel(userid: number, id: number) {
    const channel = await this.getChannelById(id);
    const users = await this.userService.getFullUsersInChannels(id);
    const admins = await this.userService.getFullAdminInChannels(id);

    if (userid === channel.owner.id) {
      if (admins.length > 0) {
        const adm = admins[0]; // Select the first join
        channel.admins = this.removeFrom(admins, adm.id);
        channel.owner = adm;
      } else {
        if (users.length === 0) {
          const msg_ids = await this.msgService.getIds(channel.id);
          await this.msgService.delete(msg_ids);
          await this.ChannelRepository.delete(channel.id);
          return { id: channel.id, name: channel.channel_name };
        }
        const usr = users[0];
        channel.users = this.removeFrom(users, usr.id);
        channel.owner = usr;
      }
    } else {
      channel.users = this.removeFrom(users, userid);
      channel.admins = this.removeFrom(admins, userid);
    }
    await this.ChannelRepository.save(channel);
    return { id: channel.id, name: channel.channel_name };
  }

  removeFrom(users: UserEntity[], id) {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) users.splice(index, 1);
    return users;
  }

  //  Tested
  async addAdminInChannel(userid: number, id: number): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(userid);
    try {
      const currentUsers = await this.userService.getFullUsersInChannels(id);
      channel.users = this.removeFrom(currentUsers, userid);
      const currentAdmins = await this.userService.getFullAdminInChannels(id);
      currentAdmins.push(user);
      channel.admins = currentAdmins;
      await this.ChannelRepository.save(channel);
    } catch (e) {
      console.log(e);
    }
    return channel;
  }

  //  Tested
  async remAdminInChannel(userid: number, id: number): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(userid);
    try {
      const currentAdmins = await this.userService.getFullAdminInChannels(id);
      channel.admins = this.removeFrom(currentAdmins, userid);
      const currentUsers = await this.userService.getFullUsersInChannels(id);
      currentUsers.push(user);
      channel.users = currentUsers;
      await this.ChannelRepository.save(channel);
    } catch (e) {
      console.log(e);
    }
    return channel;
  }

  //  Tested
  async KickUserFromChannel(uid: number, id: number): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    // const user = await this.userService.getUserById(uid);
    try {
      const currentUsers = await this.userService.getFullUsersInChannels(id);
      channel.users = this.removeFrom(currentUsers, uid);
      await this.ChannelRepository.save(channel);
    } catch (e) {
      console.log(e);
    }
    return channel;
  }

  async isMuted(user: UserEntity, chan: ChannelEntity): Promise<number> {
    for (let i = 0; i < chan.mutedUsers.length; i++) {
      if (chan.mutedUsers[i].user == user) return i;
    }
    return -1;
  }

  //  Do it at the end
  async MuteUserFromChannel(
    uid: number,
    id: number,
    sec: number,
  ): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(uid);
    if (sec <= 0)
      throw new BadRequestException(
        'Time in second cannot be equal or inferior to zero',
      );
    await this.mutedService.createMuted(channel, user, sec);
    return channel;
  }

  async UnMuteUserFromChannel(uid: number, id: number): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(uid);
    await this.mutedService.removeMuted(channel, user);
    return channel;
  }

  // tested
  async BanUserFromChannel(uid: number, id: number): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(uid);
    if (channel.priv_msg)
      throw new Error('This channel is a private message channel');
    try {
      const currentUsers = await this.userService.getFullUsersInChannels(id);
      channel.users = this.removeFrom(currentUsers, uid);
      const currentBan = await this.userService.getBannedInChannels(id);
      currentBan.push(user);
      channel.baned = currentBan;
      await this.ChannelRepository.save(channel);
    } catch (e) {
      console.log(e);
    }
    return channel;
  }

  // Tested
  async UnBanUserFromChannel(uid: number, id: number): Promise<ChannelEntity> {
    const channel = await this.getChannelById(id);
    if (channel.priv_msg)
      throw new Error('This channel is a private message channel');
    try {
      const currentBan = await this.userService.getBannedInChannels(id);
      channel.baned = this.removeFrom(currentBan, uid);
      await this.ChannelRepository.save(channel);
    } catch (e) {
      console.log(e);
    }
    return channel;
  }

  AddMessageToChannel(message: string, user: UserEntity, chan: ChannelEntity) {
    //if (!msg.channel.users.includes(msg.sender))
    //  throw new Error('The user is not in channel');
    //if ((await this.isMuted(msg.sender, msg.channel)) >= 0)
    //  throw new Error('The user is muted');
    //console.log(message + " " + user + " " + chan);
    this.msgService.addMsg(message, user, chan);
  }
}
