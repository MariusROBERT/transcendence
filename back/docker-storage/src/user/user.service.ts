import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from '../database/entities/channel.entity';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import {
  OwnProfileDto,
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
import {PublicChannelDto} from "../channel/dto/channel.dto";

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

  async updatePseudo(profile: UpdateUserDto, user: UserEntity) {
    const id: number = user.id;
    const errors = await validate(profile);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    if (profile.pseudo.endsWith('_42') && profile.pseudo !== user.username)
      throw new BadRequestException('New pseudo can\'t end with "_42"');

    if (!profile.pseudo.match(/^[a-zA-Z0-9\-_+.]{1,11}$/))
      return new BadRequestException('Pseudo must contains only alphanums characters');
    if (await this.UserRepository.findOne({ where: { pseudo: profile.pseudo } }))
      return new BadRequestException('Pseudo already exists');
    const newProfile = await this.UserRepository.preload({
      id, // search user == id
      ...profile, // modif seulement les differences
    });
    if (!newProfile) {
      throw new BadRequestException(`Utilisateur avec l'ID ${id} non trouvé.`);
    }
    return (await this.UserRepository.save(newProfile));
  }

  async update2Fa(profile: UpdateUserDto, user: UserEntity) {
    
    const id: number = user.id;
    const errors = await validate(profile);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const newProfile = await this.UserRepository.preload({
      id, // search user == id
      ...profile, // modif seulement les differences
    });
    if (profile.is2fa_active) {
      const { otpauthUrl } = await this.generateTwoFactorSecret(newProfile);
      const secret = /secret=(.+?)&/.exec(otpauthUrl);

      return {
        ...(await this.UserRepository.save(newProfile)),
        qrCode: await toDataURL(otpauthUrl),
        code2fa: secret ? secret[1] : '',
      };
    }
    await this.UserRepository.save(newProfile);
    const publicUser: OwnProfileDto = {
      id: user.id,
      username: user.username,
      pseudo: user.pseudo,
      urlImg: user.urlImg,
      is2fa_active: user.is2fa_active,
      user_status: user.user_status,
      winrate: user.winrate,
      gamesPlayed: user.gamesPlayed,
      elo: user.elo,
      rank: user.rank,
      gamesId: user.gamesId,
      friends: user.friends,
      recvInvitesFrom: user.recvInvitesFrom,
      sentInvitesTo: user.sentInvitesTo,
      blocked: user.blocked
    };

    return publicUser;
  }

  async updatePassword(updatePwdDto: UpdatePwdDto, user: UserEntity) {
    // NEW_PASSWORD

    const id = user.id;
    const name = user.username;
    try {
      const currentUser = await this.UserRepository.createQueryBuilder('user')
        .where('user.username = :name', { name })
        .getOne();
      if (currentUser.username.endsWith('_42'))
        throw new UnauthorizedException('Oauth42 user can\'t change password');
      const oldHash = await bcrypt.hash(
        updatePwdDto.oldPassword,
        currentUser.salt,
      );
      if (oldHash !== currentUser.password) {
        throw new BadRequestException('Wrong password');
      }

      if (!/^((?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#+=`'";:?.,<>~\-\\]).{8,50})$/.test(updatePwdDto.newPassword))
        return new BadRequestException('Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character');

      const newPassword = await bcrypt.hash(
        updatePwdDto.newPassword,
        currentUser.salt,
      );
      const newProfil = await this.UserRepository.preload({
        id, // search user == id
        password: newPassword, // modif seulement password
      });
      return (await this.UserRepository.save(newProfil));
    } catch (e) {
      throw new BadRequestException('Wrong password');
    }
  }

  // Log IN / OUT -------------------------------------------------------------------------------- //
  async login(user: UserEntity) {
    user.user_status = UserStateEnum.ON;
    await this.UserRepository.save(user);
  }

  async logout(user: UserEntity) {
    user.user_status = UserStateEnum.OFF;
    user.gameInvitationTo = -1;
    user.gameInvitationFrom = -1;
    await this.UserRepository.save(user);
  }

  // -- Public -- :

  async getPublicProfile(
    id: number,
  ): Promise<PublicProfileDto> {
    let profile;
    try {
      profile = await this.UserRepository.findOne({ where: { id } });
    }
    catch { }
    if (!profile) throw new BadRequestException(`le user ${id} n'existe pas`);

    const PublicProfile = new PublicProfileDto();
    PublicProfile.id = profile.id;
    PublicProfile.pseudo = profile.pseudo;
    PublicProfile.urlImg = profile.urlImg;
    PublicProfile.user_status = profile.user_status;
    PublicProfile.winrate = profile.winrate;
    PublicProfile.gamesPlayed = profile.gamesPlayed;
    PublicProfile.elo = profile.elo;
    PublicProfile.gamesId = profile.gamesId;
    PublicProfile.rank = profile.rank;


    return PublicProfile;
  }

  async getAllProfile(): Promise<PublicProfileDto[]> {
    const users = await this.UserRepository.find();
    // Créez un tableau pour stocker les profils
    const PublicProfiles: PublicProfileDto[] = [];
    for (const profile of users) {
      const PublicProfile = await this.getPublicProfile(profile.id);
      PublicProfiles.push(PublicProfile);
    }
    return PublicProfiles;
  }

  // FRIEND'S DEMAND :

  async askFriend(user: UserEntity, id: number) {
    const userAsked = await this.UserRepository.findOne({ where: { id } });
    if (!userAsked) {
      throw new BadRequestException(`le user d'id ${id} n'existe pas`);
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

  async getUsersInChannels(channelId: number) {
    const users = await this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.channels', 'channel')
      .where('channel.id = :channelId', { channelId })
      .select(['user.id', 'user.pseudo', 'user.urlImg'])
      .getMany();
    const admin = await this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.admin', 'admin')
      .where('admin.id = :channelId', { channelId })
      .select(['user.id', 'user.pseudo', 'user.urlImg'])
      .getMany();
    const owner = await this.UserRepository.createQueryBuilder('user')
      .innerJoin('user.own', 'own')
      .where('own.id = :channelId', { channelId })
      .select(['user.id', 'user.pseudo', 'user.urlImg'])
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

  async removeLastMsg(id: number) {
    const user = await this.UserRepository.findOne({ where: { id } })
    if (user.last_msg_date)
      user.last_msg_date = null;
    await this.UserRepository.save(user)
  }

  // UTILS :

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
  }

  async getUserById(id: number): Promise<UserEntity> {
    let user;
    try {
      user = await this.UserRepository.findOne({ where: { id } });
    } catch { }
    if (!user) return;
    return user;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.UserRepository.findOne({
      where: { username },
    });
    if (!user)
      throw new BadRequestException(`No User found for username ${username}`);
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
    user.is2fa_active = false;
    await this.UserRepository.save(user);
    return { secret, otpauthUrl };
  }

  async confirm2Fa(code: number, user: UserEntity) {
    if (user.is2fa_active || !user.secret2fa || user.secret2fa === '') {
      throw new BadRequestException('You don\' have to validate 2fa');
    }
    if (
      !authenticator.verify({
        token: String(code),
        secret: user.secret2fa,
      })
    ) {
      throw new BadRequestException('Invalid 2fa code');
    }
    user.is2fa_active = true;
    await this.UserRepository.save(user);
    return ([]);
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
    if (!user)
      throw new BadRequestException('User not found');
    return {
      gameInvitationFrom: user.gameInvitationFrom,
      gameInvitationTo: user.gameInvitationTo,
      gameInviteType: user.gameInvitationType,
    };
  }

  // GAME SAVING 
  async endOfGameUpdatingProfile(gameId: number, user1: UserEntity, user2: UserEntity, won: boolean) {

    user1.gamesPlayed += 1;
    user2.gamesPlayed += 1;
    let winner = won ? user1 : user2;
    let loser = won ? user2 : user1;
    winner.gamesWon += 1;
    loser.gamesLost += 1;
    const K = 50; // ponderation factor
    const expectedOutcomeWinner = 1 / (1 + 10 ** ((loser.elo - winner.elo) / 400));
    const expectedOutcomeLoser = 1 - expectedOutcomeWinner;

    const newEloWinner = winner.elo + K * (1 - expectedOutcomeWinner);
    const newEloLoser = loser.elo + K * (0 - expectedOutcomeLoser);

    winner.elo = Math.round(newEloWinner);
    loser.elo = Math.round(newEloLoser);
    if (!loser.gamesId)
      loser.gamesId = [];
    loser.gamesId.push(gameId);
    if (!winner.gamesId)
      winner.gamesId = [];
    winner.gamesId.push(gameId)
    loser.winrate = loser.gamesWon / loser.gamesPlayed * 100;
    winner.winrate = winner.gamesWon / winner.gamesPlayed * 100;
    await this.UserRepository.save(loser);
    await this.UserRepository.save(winner);
    return;
  }


  async rankUpdate() {
    let users = await this.UserRepository.find({ order: { elo: 'DESC' } });
    users = users.filter(user => (user.gamesPlayed !== 0));
    let length = users.length;
    let position = 0;
    while (position < length) {
      users[position].rank = position + 1;
      this.UserRepository.save(users[position]);
      position += 1;
    }
  }
}
