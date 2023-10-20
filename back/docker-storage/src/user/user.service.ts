import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from '../database/entities/channel.entity';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import {
  PublicProfileDto,
  UpdatePwdDto,
  UpdateUserDto,
  UserGameStatus,
} from './dto/user.dto';
import { UserStateEnum } from '../utils/enums/user.enum';
import { MessageEntity } from '../database/entities/message.entity';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { API_URL } from '../utils/Globals';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(ChannelEntity)
    private ChannelRepository: Repository<ChannelEntity>,
    @InjectRepository(UserEntity)
    private UserRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private MessageRepository: Repository<MessageEntity>,
  ) {
  }

  // --------- PROFILE --------- :
  // -- Private -- :

  async updateProfile(profile: UpdateUserDto, user: UserEntity) {
    const id: number = user.id;
    const errors = await validate(profile);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //console.log('modifications apportées: ', profile);

    const newProfile = await this.UserRepository.preload({
      id, // search user == id
      ...profile, // modif seulement les differences
    });
    if (!newProfile) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé.`);
    }
    if (profile.is2fa_active) {
      const { otpauthUrl } = await this.generateTwoFactorSecret(newProfile);
      const secret = /secret=(.+?)&/.exec(otpauthUrl);

      return {
        ...(await this.UserRepository.save(newProfile)),
        qrCode: await toDataURL(otpauthUrl),
        code2fa: secret ? secret[1] : '',
      };
    }
    return await this.UserRepository.save(newProfile);
  }

  async updatePassword(updatePwdDto: UpdatePwdDto, user: UserEntity) {
    // NEW_PASSWORD

    const id = user.id;
    const name = user.username;
    const currentUser = await this.UserRepository.createQueryBuilder('user') // honnetement je comprend pas pourquoi le salt n'est pas dans mon user du parametre...
      .where('user.username = :name', { name })
      .getOne();
    if (currentUser.username.endsWith('_42'))
      throw new UnauthorizedException('Oauth42 user can\'t change password');
    const oldHash = await bcrypt.hash(
      updatePwdDto.oldPassword,
      currentUser.salt,
    );
    if (oldHash !== currentUser.password) {
      throw new UnauthorizedException('Wrong password');
    }

    //DEV: comment these 2 lines for dev
    // if (!/^((?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#+=`'";:?.,<>~\-\\]).{8,50})$/.test(updatePwdDto.newPassword))
    //   return new BadRequestException('Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character');

    const newPassword = await bcrypt.hash(
      updatePwdDto.newPassword,
      currentUser.salt,
    );
    const newProfil = await this.UserRepository.preload({
      id, // search user == id
      password: newPassword, // modif seulement password
    });
    return await this.UserRepository.save(newProfil);
  }

  // Log IN / OUT -------------------------------------------------------------------------------- //
  async login(user: UserEntity) {
    user.user_status = UserStateEnum.ON;
    await this.UserRepository.save(user);
  }

  async logout(user: UserEntity) {
    // pas testé
    const lastMsg = await this.getLastMsg(user);
    if (lastMsg) user.last_msg_date = lastMsg.createdAt;
    user.user_status = UserStateEnum.OFF;
    user.gameInvitationTo = -1;
    user.gameInvitationFrom = -1;
    await this.UserRepository.save(user);
  }

  //  USE FOR ADMIN BAN MUTE ..
  async updateUserChannel(user: UserEntity, channel: ChannelEntity) {
    try {
      if (!user.channels) user.baned = [];
      //user.channels.push(channel);
      user.baned = [...user.baned, channel];
      await this.UserRepository.save(user);
    } catch (e) {
      console.log('Error: ' + e);
    }
  }

  // -- Public -- :

  async getPublicProfile(
    id: number,
    user: UserEntity,
  ): Promise<PublicProfileDto> {
    const profile = await this.UserRepository.findOne({ where: { id } });
    if (!profile) throw new NotFoundException(`le user ${id} n'existe pas`);

    const PublicProfile = new PublicProfileDto();
    PublicProfile.id = profile.id;
    PublicProfile.username = profile.username;
    PublicProfile.urlImg = profile.urlImg;
    PublicProfile.user_status = profile.user_status;
    PublicProfile.winrate = profile.winrate;
    PublicProfile.gamesPlayed = profile.gamesPlayed;
    PublicProfile.elo = profile.elo;
    PublicProfile.gamesId = profile.gamesId;


    return PublicProfile;
  }

  async getAllProfile(user: UserEntity): Promise<PublicProfileDto[]> {
    const users = await this.UserRepository.find();
    // Créez un tableau pour stocker les profils
    const PublicProfiles: PublicProfileDto[] = [];
    for (const profile of users) {
      const PublicProfile = await this.getPublicProfile(profile.id, user);
      PublicProfiles.push(PublicProfile);
    }
    return PublicProfiles;
  }

  // FRIEND'S DEMAND :

  async askFriend(user: UserEntity, id: number) {
    const userAsked = await this.UserRepository.findOne({ where: { id } });
    if (!userAsked) {
      throw new NotFoundException(`le user d'id ${id} n'existe pas`);
    }

    if (userAsked.blocked.includes(user.id)) return;
    if (user.blocked.includes(userAsked.id)) return;

    if (!user.sentInvitesTo.includes(id))
      user.sentInvitesTo = [...user.sentInvitesTo, id];
    if (!userAsked.recvInvitesFrom.includes(user.id))
      userAsked.recvInvitesFrom = [...userAsked.recvInvitesFrom, user.id];

    await this.UserRepository.save(user);
    await this.UserRepository.save(userAsked);
  }

  async handleAsk(
    receiver: UserEntity, // receiver
    sender: UserEntity, // sender
    accept: boolean,
  ) {
    if (!receiver.sentInvitesTo.includes(sender.id)) return;
    if (!sender.recvInvitesFrom.includes(receiver.id)) return;

    receiver.sentInvitesTo = receiver.sentInvitesTo.filter(
      (id) => id !== sender.id,
    );
    sender.recvInvitesFrom = sender.recvInvitesFrom.filter(
      (id) => id !== receiver.id,
    );

    if (receiver.blocked.includes(sender.id)) return;
    if (sender.blocked.includes(receiver.id)) return;

    if (accept) {
      receiver.friends = [...receiver.friends, sender.id];
      sender.friends = [...sender.friends, receiver.id];
    }
    this.UserRepository.save(receiver);
    this.UserRepository.save(sender);
  }

  async blockAUser(sender: UserEntity, receiver: UserEntity) {
    if (sender.friends.includes(receiver.id)) {
      sender.friends = sender.friends.filter((id) => id !== receiver.id);
      await this.UserRepository.save(sender);
    }
    if (receiver.friends.includes(sender.id)) {
      receiver.friends = receiver.friends.filter((id) => id !== sender.id);
      await this.UserRepository.save(receiver);
    }

    if (sender.blocked.includes(receiver.id)) return;
    sender.blocked = [...sender.blocked, receiver.id];
    await this.UserRepository.save(sender);
  }

  async unblockAUser(sender: UserEntity, receiver: number) {
    if (!sender.blocked.includes(receiver)) return;
    sender.blocked = sender.blocked.filter((id) => id !== receiver);
    await this.UserRepository.save(sender);
  }

  async cancelFriendRequest(sender: UserEntity, receiver: UserEntity) {
    sender.sentInvitesTo = sender.sentInvitesTo.filter(
      (id) => id !== receiver.id,
    );
    receiver.recvInvitesFrom = receiver.recvInvitesFrom.filter(
      (id) => id !== sender.id,
    );

    await this.UserRepository.save(sender);
    await this.UserRepository.save(receiver);
  }

  // CHANNEL & MESSAGE :

  async getChannels(user: UserEntity): Promise<ChannelEntity[]> {
    return await this.ChannelRepository.createQueryBuilder('channels')
      .leftJoinAndSelect('channels.users', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async isInChannel(id: number) {
    const user = await this.ChannelRepository.findOne({ where: { id } });
    return !!user;
  }

  async getUsersInChannels(channelId: number) {
    const users = await this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.channels', 'channel')
      .where('channel.id = :channelId', { channelId })
      .select(['user.id', 'user.username', 'user.urlImg'])
      .getMany();
    const admin = await this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.admin', 'admin')
      .where('admin.id = :channelId', { channelId })
      .select(['user.id', 'user.username', 'user.urlImg'])
      .getMany();
    const owner = await this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.own', 'own')
      .where('own.id = :channelId', { channelId })
      .select(['user.id', 'user.username', 'user.urlImg'])
      .getMany();
    const fusers = users.map((d) => {
      const data = { ...d };
      data['type'] = 'member';
      return data;
    });
    const fadmin = admin.map((d) => {
      const data = { ...d };
      data['type'] = 'admin';
      return data;
    });
    const fowner = owner.map((d) => {
      const data = { ...d };
      data['type'] = 'owner';
      return data;
    });
    return fusers.concat(fadmin, fowner);
  }

  async getFullAdminInChannels(channelId: number) {
    return await this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.admin', 'admin')
      .where('admin.id = :channelId', { channelId })
      .getMany();
  }

  //  The diff here is that full data are sent
  async getFullUsersInChannels(channelId: number) {
    return this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.channels', 'channel')
      .where('channel.id = :channelId', { channelId })
      .getMany();
  }

  async getBannedInChannels(channelId: number) {
    return await this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.baned', 'baned')
      .where('baned.id = :channelId', { channelId })
      .getMany();
  }

  // des qu'il se log ==> return ChannelEntity[] (ou y'a des news msgs) ou null si aucun message
  async isNotifMsg(user: UserEntity): Promise<ChannelEntity[]> | null {
    // est ce quil a des new msg et si oui de quel cahnnel
    const userChannels = await this.getChannels(user);
    const lastMsg = await this.getLastMsg(user);
    const channelsWithNewMsg: ChannelEntity[] = [];
    if (lastMsg.createdAt > user.last_msg_date) {
      // il y a des msg qu'il n'a pas vu. Mais de quel channel ?
      // pour chaque channel aller voir s'il y a des new msg;
      for (const channel of userChannels) {
        const messagesInChannel = await this.MessageRepository.find({
          where: { channel: { id: channel.id } },
          order: { createdAt: 'DESC' }, // Triez par date de création décroissante pour obtenir le dernier message
          take: 1, // Récupérez seulement le premier (le plus récent) message
        });
        if (messagesInChannel[0].createdAt > user.last_msg_date)
          // stocker les channel et les retourner
          channelsWithNewMsg.push(channel);
      }
      return channelsWithNewMsg;
    }
    return null;
  }

  async getLastMsg(user: UserEntity): Promise<MessageEntity> {
    // pas testé
    const userChannels = await this.getChannels(user);
    if (!userChannels || userChannels.length === 0) return null;
    let latestMessage: MessageEntity | null = null;
    // Itérer sur les chaînes pour trouver le dernier message
    for (const channel of userChannels) {
      const messagesInChannel = await this.MessageRepository.find({
        where: { channel: { id: channel.id } },
        order: { createdAt: 'DESC' }, // Triez par date de création décroissante pour obtenir le dernier message
        take: 1, // Récupérez seulement le premier (le plus récent) message
      });
      if (messagesInChannel && messagesInChannel.length > 0) {
        const lastMessageInChannel = messagesInChannel[0];
        if (
          !latestMessage ||
          lastMessageInChannel.createdAt > latestMessage.createdAt
        ) {
          latestMessage = lastMessageInChannel;
        }
      }
    }
    return latestMessage;
  }

  async getMsgsByChannel(
    // pas testé
    user: UserEntity,
    channels: ChannelEntity[],
    id: number,
  ): Promise<MessageEntity[]> {
    const channel = await this.ChannelRepository.findOne({ where: { id } });
    if (!channel)
      throw new NotFoundException(`le channel d'id ${id} n'existe pas`);
    if (await this.isInChannel(user.id)) return channel.messages;
    throw new NotFoundException(`le user ${id} n'appartient pas a ce channel`);
  }

  // UTILS :

  isOwner(objet: any, user: UserEntity): boolean {
    return objet.user && user.id === objet.user.id;
  }

  isChanOwner(user: UserEntity, channel: ChannelEntity): boolean {
    return channel.owner.id == user.id;
  }

  isChanAdmin(user: UserEntity, channel: ChannelEntity): boolean {
    if (!channel.admins) return false;
    // Vérifiez si l'utilisateur existe dans la liste des administrateurs
    return channel.admins.some((adminUser) => adminUser.id === user.id);
  }

  async updatePicture(user: UserEntity, file: Express.Multer.File) {
    if (
      user.urlImg != '' &&
      !user.urlImg.startsWith('https://cdn.intra.42.fr') &&
      user.urlImg !== API_URL + '/public/default.png'
    ) {
      fs.rm(user.urlImg.replace(API_URL + '/', ''), (err) => {
        if (err) console.error('remove old: ', err);
      });
    }
    user.urlImg = API_URL + '/' + file.path;
    await this.UserRepository.save(user);
    return user;
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.UserRepository.findOne({
      where: { id },
    });
    if (!user) return;
    return user;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.UserRepository.findOne({
      where: { username },
    });
    if (!user)
      throw new NotFoundException(`No User found for username ${username}`);
    return user;
  }

  async generateTwoFactorSecret(user: UserEntity) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.username,
      'Transcendence',
      secret,
    );
    user.secret2fa = secret;
    await this.UserRepository.save(user);
    return { secret, otpauthUrl };
  }

  // Game Invites Management ---------------------------------------------------------------------------------------- //
  async setUserSendInvitationTo(
    user: UserEntity,
    otherUserId: number | undefined,
  ) {
    user.gameInvitationTo = otherUserId ? otherUserId : -1;
    return await this.UserRepository.save(user);
  }

  async setUserReceivedInvitationFrom(
    user: UserEntity,
    otherUserId: number | undefined,
  ) {
    user.gameInvitationFrom = otherUserId ? otherUserId : -1;
    return await this.UserRepository.save(user);
  }

  async setUserInvitationType(
    user: UserEntity,
    gameType: 'none' | 'normal' | 'special',
  ) {
    user.gameInvitationType = gameType;
    return await this.UserRepository.save(user);
  }

  async getGameStatusWithId(id: number): Promise<UserGameStatus> {
    const user = await this.getUserById(id);
    return {
      gameInvitationFrom: user.gameInvitationFrom,
      gameInvitationTo: user.gameInvitationTo,
      gameInviteType: user.gameInvitationType,
    };
  }

  // GAME SAVING 
  async endOfGameUpdatingProfile(gameId:number, user:UserEntity, won:boolean){
  
    user.gamesPlayed += 1;
    if (user.gamesId === undefined)
      user.gamesId = [];
    user.gamesId.push(gameId);
    if(won)
    {
      user.gamesWon += 1;
      user.elo += 15;
    }
    else
    {
      user.gamesLost += 1;
      user.elo -= 15;
      if (user.elo < 0)
        user.elo = 0;
    }
    user.winrate = user.gamesWon / user.gamesPlayed * 100;
    return await this.UserRepository.save(user);
  }
}
