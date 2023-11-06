import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ChannelEntity,
  MessageEntity,
} from 'src/database/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import {
  CreateChannelDto,
  EditChannelDto,
  PublicChannelDto,
} from './dto/channel.dto';
import { UserService } from 'src/user/user.service';
import { MessagesService } from 'src/messages/messages.service';
import { MutedService } from 'src/muted/muted.service';
import { ChanStateEnum } from 'src/utils/enums/channel.enum';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

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

  async returnPublicData(channel: ChannelEntity): Promise<PublicChannelDto> {
    const publicData: PublicChannelDto = {
      id: channel.id,
      channel_name: channel.channel_name,
      chan_status: channel.chan_status,
      priv_msg: channel.priv_msg,
      has_password: !!channel.password,
      owner_id: channel.owner.id,
      owner_username: channel.owner.username,
    };
    return publicData;
  }

  /**
   @description Create a channel
   @param {CreateChannelDto} channel - The channel to create Dto
   @param {UserEntity} user - User that create the channel
   @return {PublicChannelDto} - Public channel data
   @throw {ConflictException} - If channel already exist
   */
  async createChannel(
    channel: CreateChannelDto,
    user: UserEntity,
  ): Promise<PublicChannelDto> {
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
    return this.returnPublicData(chan);
  }

  /**
   @description Join a private channel if exist, else create it
   @param {any} second_user - The second user to join the private channel
   @param {UserEntity} user - The user that create the private channel
   @return {ChannelENtity} - Public channel data
   */
  async joinPrivate(second_user: any, user: UserEntity) {
    const user_two = await this.userService.getUserById(second_user.id);
    let channel = await this.ChannelRepository.createQueryBuilder('channel')
      .innerJoin('channel.users', 'user')
      .innerJoin('channel.users', 'user_two')
      .where('channel.priv_msg = :priv_msg', { priv_msg: true })
      .andWhere('user.id = :userId', { userId: user.id })
      .andWhere('user_two.id = :userTwoId', { userTwoId: user_two.id })
      .getOne();
    if (!channel) {
      channel = this.ChannelRepository.create({
        channel_name: randomUUID(),
        priv_msg: true,
        users: [user, second_user],
        owner: user,
      });
      await this.ChannelRepository.save(channel);
    }
    return { id: channel.id, channel_name: channel.channel_name };
  }

  /**
   @description Edit chan_status and password in channel
   @param {EditChannelDto} dto - The channel Dto to edit
   @param {number} id - The channel id to edit
   @return {PublicChannelDto} - Public channel data
   @throw {NotFoundException} - If channel not found
   */
  async editChannel(
    dto: EditChannelDto,
    id: number,
  ): Promise<PublicChannelDto> {
    const channel = await this.getChannelById(id);

    if (!channel) throw new NotFoundException(`channel ${id} does not exist`);
    channel.password = null;
    if (dto.password.length > 0)
      channel.password = await bcrypt.hash(dto.password, channel.salt);
    channel.chan_status =
      dto.chan_status === 'private'
        ? ChanStateEnum.PRIVATE
        : ChanStateEnum.PUBLIC;
    this.ChannelRepository.save(channel);
    return this.returnPublicData(channel);
  }

  /**
   @description Get a channel entity by id
   @param {number} id - The channel id
   @return {ChannelEntity} - The channel entity
   @throw {NotFoundException} - If channel not found
   */
  async getChannelById(id: number): Promise<ChannelEntity> {
    const channel = await this.ChannelRepository.findOne({
      where: { id },
    });
    if (!channel)
      throw new NotFoundException(`Le channel d'id ${id}, n'existe pas`);
    return channel;
  }

  /**
   @description Get channel public data entity by id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   @throw {NotFoundException} - If channel not found
   */
  async getPublicChannelById(id: number): Promise<PublicChannelDto> {
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

  /**
   @description Get all public channels where user is not banned
   @param {UserEntity} user - The user that request the channels
   @return {PublicChannelDto[]} - Public channels data
   */
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

  /**
   @description Get a channel entity by name
   @param {string} channel_name - The channel name
   @return {ChannelEntity} - The channel entity
   @throw {NotFoundException} - If channel not found
   */
  async getChannelByName(channel_name: string) {
    const channel = await this.ChannelRepository.findOne({
      where: { channel_name },
      //relations: ['admins'],
    });
    if (!channel)
      throw new NotFoundException(`Le channel ${channel_name}, n'existe pas`);
    return channel;
  }

  /**
   @description Get a channel id by name
   @param {string} channel_name - The channel name
   @return {ChannelEntity} - The channel entity
   @throw {NotFoundException} - If channel not found
   */
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

  /**
   @description Get channel messages
   @param {number} id - The channel id
   @return {MessageEntity[]} - The channel messages
   */
  async getChannelMessages(id: number): Promise<MessageEntity[]> {
    if (!id) throw new NotFoundException('Channel Not Found');
    return await this.msgService.getMsg(id);
  }

  /**
   @description Get channel users
   @param {number} - The channel id
   @return {UserEntity[]} - The channel users
   */
  async getChannelUsers(id: number): Promise<UserEntity[]> {
    return await this.userService.getUsersInChannels(id);
  }

  /**
   @description Get channel user with rights
   @param {number} id - The channel id
   @param {UserEntity} user - The user that request the channel
   @return {any} - The channel users
   */
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

  /**
   @description Get channels of user by type
   @param {string} type - The type of user {users, admins, owner}
   @param {number} id - The user id
   @return {ChannelEntity[]} - The channels user with type
   */
  async getChannelOfUserByType(type: string, id: number) {
    const channel = await this.ChannelRepository.createQueryBuilder('channel')
      .leftJoinAndSelect('channel.' + type, type)
      .where(type + '.id = :id', { id })
      .select(['channel.id as id', 'channel.channel_name as name'])
      .andWhere('channel.priv_msg = :priv_msg', { priv_msg: false })
      .getRawMany();
    channel.forEach((channel) => {
      channel['type'] = type;
    });
    return channel;
  }

  /**
   @description Get channels of user
   @param {number} id - The user id
   @return {ChannelEntity[]} - The channels user
   */
  async getChannelOfUser(id: number): Promise<ChannelEntity[]> {
    const chans = await this.getChannelOfUserByType('users', id);
    const admchans = await this.getChannelOfUserByType('admins', id);
    const ownchans = await this.getChannelOfUserByType('owner', id);
    return chans.concat(admchans, ownchans);
  }

  /**
   @description Enter in channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   @throw {ConflictException} - If user already in channel
   */
  async addUserInChannel(
    userid: number,
    id: number,
  ): Promise<PublicChannelDto> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(userid);
    const allusers = await this.userService.getUsersInChannels(id);
    if (allusers.some((u) => u.id === userid)){
      // throw new ConflictException('User already in channel');
      return this.returnPublicData(channel);
    }
    const currentUsers = await this.userService.getFullUsersInChannels(id);
    currentUsers.push(user);
    channel.users = currentUsers;
    await this.ChannelRepository.save(channel);
    return this.returnPublicData(channel);
  }

  /**
   @description Leave channel, if owner give admin to first user or give owner to first admin, else give owner to first user, else delete channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   */
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
          return this.returnPublicData(channel);
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
    return channel;
  }

  removeFrom(users: UserEntity[], id) {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) users.splice(index, 1);
    return users;
  }

  /**
   @description set user as admin in channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   */
  async addAdminInChannel(
    userid: number,
    id: number,
  ): Promise<PublicChannelDto> {
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
    return this.returnPublicData(channel);
  }

  /**
   @description Remove user as admin in channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   */
  async remAdminInChannel(
    userid: number,
    id: number,
  ): Promise<PublicChannelDto> {
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
    return this.returnPublicData(channel);
  }

  /**
   @description Kick user from channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   */
  async KickUserFromChannel(
    userid: number,
    id: number,
  ): Promise<PublicChannelDto> {
    const channel = await this.getChannelById(id);
    try {
      const currentUsers = await this.userService.getFullUsersInChannels(id);
      channel.users = this.removeFrom(currentUsers, userid);
      await this.ChannelRepository.save(channel);
    } catch (e) {
      console.log(e);
    }
    return this.returnPublicData(channel);
  }

  //  Check if user is muted
  async isMuted(user: UserEntity, chan: ChannelEntity): Promise<number> {
    for (let i = 0; i < chan.mutedUsers.length; i++) {
      if (chan.mutedUsers[i].user == user) return i;
    }
    return -1;
  }

  /**
   @description Mute user from channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @param {number} sec - The time in second
   @return {PublicChannelDto} - Public channel data
   @throw {BadRequestException} - If time in second is inferior or equal to zero
   */
  async MuteUserFromChannel(
    userid: number,
    id: number,
    sec: number,
  ): Promise<PublicChannelDto> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(userid);
    if (sec <= 0)
      throw new BadRequestException(
        'Time in second cannot be equal or inferior to zero',
      );
    await this.mutedService.createMuted(channel, user, sec);
    await this.ChannelRepository.save(channel);
    return this.returnPublicData(channel);
  }

  /**
   @description Unmute user from channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   */
  async UnMuteUserFromChannel(
    userid: number,
    id: number,
  ): Promise<PublicChannelDto> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(userid);
    await this.mutedService.removeMuted(channel, user);
    await this.ChannelRepository.save(channel);
    return this.returnPublicData(channel);
  }

  /**
   @description Ban user from channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   @throw {BadRequestException} - If channel is a private message channel
   */
  async BanUserFromChannel(
    userid: number,
    id: number,
  ): Promise<PublicChannelDto> {
    const channel = await this.getChannelById(id);
    const user = await this.userService.getUserById(userid);
    if (channel.priv_msg)
      throw new BadRequestException(
        'This channel is a private message channel',
      );
    try {
      const currentUsers = await this.userService.getFullUsersInChannels(id);
      channel.users = this.removeFrom(currentUsers, userid);
      const currentBan = await this.userService.getBannedInChannels(id);
      currentBan.push(user);
      channel.baned = currentBan;
      await this.ChannelRepository.save(channel);
    } catch (e) {
      console.log(e);
    }
    return this.returnPublicData(channel);
  }

  /**
   @description Unban user from channel
   @param {number} userid - The user id
   @param {number} id - The channel id
   @return {PublicChannelDto} - Public channel data
   */
  async UnBanUserFromChannel(
    userid: number,
    id: number,
  ): Promise<PublicChannelDto> {
    const channel = await this.getChannelById(id);
    if (channel.priv_msg)
      throw new Error('This channel is a private message channel');
    try {
      const currentBan = await this.userService.getBannedInChannels(id);
      channel.baned = this.removeFrom(currentBan, userid);
      await this.ChannelRepository.save(channel);
    } catch (e) {
      console.log(e);
    }
    return this.returnPublicData(channel);
  }

  /**
   @description Add message in channel
   @param {string} message - The message
   @param {UserEntity} user - The user that send the message
   @param {ChannelEntity} chan - The channel where the message is send
   @return {MessageEntity} - The message entity
   */
  AddMessageToChannel(message: string, user: UserEntity, chan: ChannelEntity) {
    this.msgService.addMsg(message, user, chan);
  }
}
