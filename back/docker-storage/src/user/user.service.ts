import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from '../database/entities/channel.entity';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { GetUserIdFromSocketIdDto, PublicProfileDto, UpdatePwdDto, UpdateUserDto } from './dto/user.dto';
import { UserStateEnum } from '../utils/enums/user.enum';
import { MessageEntity } from '../database/entities/message.entity';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

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

  async updateProfile(
    profil: UpdateUserDto,
    user: UserEntity,
  ) {
    const id: number = user.id;
    const errors = await validate(profil);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //console.log('modifications apportées: ', profil);

    // NEW_IMAGE
    // if (profil.urlImg != '')
    // {
    //     console.log("IMAGE ALLLRIGHT");

    //     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    //         console.log("IMAGE ALLLRIGHT2222");
    //         throw new Error('Ce type de fichier n\'est pas autorisé.');
    //     }
    // }

    const newProfil = await this.UserRepository.preload({
      id, // search user == id
      ...profil, // modif seulement les differences
    });
    if (!newProfil) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé.`);
    }
    if (profil.is2fa_active) {
      const { otpauthUrl } = await this.generateTwoFactorSecret(newProfil);
      return {
        ...await this.UserRepository.save(newProfil),
        qrCode: await toDataURL(otpauthUrl),
      };
    }
    return await this.UserRepository.save(newProfil);
  }

  async updatePassword(updatePwdDto: UpdatePwdDto, user: UserEntity) {
    // NEW_PASSWORD

    const id = user.id;
    const name = user.username;
    const userForSalt = await this.UserRepository.createQueryBuilder('user') // honnetement je comprend pas pourquoi le salt n'est pas dans mon user du parametre...
      .where('user.username = :name', { name })
      .getOne();
    updatePwdDto.password = await bcrypt.hash(
      updatePwdDto.password,
      userForSalt.salt,
    );
    const newProfil = await this.UserRepository.preload({
      id, // search user == id
      ...updatePwdDto, // modif seulement les differences
    });
    return await this.UserRepository.save(newProfil);
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

    if (user && user.friends && Array.isArray(user.friends)) {
      PublicProfile.is_friend = user.friends.some(
        (friend) => friend === profile.id,
      );
    } else {
      PublicProfile.is_friend = false;
    }
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

  async askFriend(user: UserEntity, id: number): Promise<UserEntity> {
    // check si le user demandé est connecté
    const userAsked = await this.UserRepository.findOne({ where: { id } });
    if (!userAsked)
      throw new NotFoundException(`le user d'id ${id} n'existe pas`);
    // if (userAsked.user_status == UserStateEnum.ON)
    //     // passer par les socket
    // else {
    if (!user.invited) user.invited = [];
    if (!userAsked.invited) userAsked.invites = [];
    if (Array.isArray(user.invited) && Array.isArray(userAsked.invites)) {
      // secu en + :
      const invitedExist = user.invited.indexOf(userAsked.id);
      const invitesExist = userAsked.invites.indexOf(user.id);
      if (invitesExist != -1 || invitedExist != -1)
        throw new ConflictException(`Vous avez déjà demandé le user ${id}.`);
      user.invited.push(userAsked.id);
      userAsked.invites.push(user.id);
    }
    // }
    await this.UserRepository.save(user);
    await this.UserRepository.save(userAsked);
    return userAsked;
  }

  async handleAsk(
    user: UserEntity, // usr1
    id: number, // usr2
    bool: number,
  ) {
    const userInvites = await this.UserRepository.findOne({
      where: { id },
    }); // search le user d'id :id
    if (!userInvites)
      throw new NotFoundException(`le user d'id: ${id} n'existe pas`);
    if (!user.invites) {
      throw new NotFoundException(
        `le user d'id ${id} ne fait partit de la liste d'invites`,
      );
    }
    const friendsExist = user.friends.indexOf(userInvites.id);
    if (friendsExist != -1) {
      throw new ConflictException(
        `le user d'id ${id} est fait déjà de vos friends`,
      );
    }
    const indexToRemove = user.invites.indexOf(user.id); // get l'index du usr2 dans la liste d'invites de usr1
    if (indexToRemove !== -1) {
      throw new NotFoundException(
        `le user d'id ${id} ne fait partit de la liste d'invites du user d'id ${user.id}`,
      );
    }
    const indexToRemoveusr = userInvites.invited.indexOf(userInvites.id); // get l'index du usr2 dans la liste d'invites de usr1
    if (indexToRemoveusr !== -1) {
      throw new NotFoundException(
        `le user d'id ${user.id} ne fait partit de la liste d'invited du user d'id ${id}`,
      );
    }
    user.invites.splice(indexToRemove, 1); // remove usr1 dans liste d'invites de usr2
    userInvites.invited.splice(indexToRemoveusr, 1); // remove usr1 dans liste d'invited de usr2
    if (bool == 1) {
      // si il a été accepter, on ajoute dans la liste friends des deux cotés
      if (!user.friends) user.friends = [];
      user.friends = [...user.friends, userInvites.id]; // ajout usr2 dans list friends de usr1
      if (!userInvites.friends) userInvites.friends = [];
      userInvites.friends = [...userInvites.friends, user.id]; // ajout usr1 dans list friends de usr2
    }
    this.UserRepository.save(user);
    this.UserRepository.save(userInvites);
  }

  // CHANNEL & MESSAGE :

  async getChannels(user: UserEntity): Promise<ChannelEntity[]> {
    return await this.ChannelRepository.createQueryBuilder('channels')
      .leftJoinAndSelect('channels.users', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async isInChannel(id: number, channel: ChannelEntity) {
    const user = await this.ChannelRepository.findOne({ where: { id } });
    return !!user;
  }

  // des qu'il se log ==> return ChannelEntity[] (ou y'a des news msgs) ou null si aucun message
  async isNotifMsg(user: UserEntity): Promise<ChannelEntity[]> | null {
    // est ce quil a des new msg et si oui de quel cahnnel
    const userChannels = await this.getChannels(user);
    const lastMsg = await this.getLastMsg(user);
    let channelsWithNewMsg: ChannelEntity[];
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
    } else return null;
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
    if (this.isInChannel(user.id, channel)) return channel.messages;
    else
      throw new NotFoundException(
        `le user ${id} n'appartient pas a ce channel`,
      );
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
    return channel.admins.some(
      (adminUser) => adminUser.id === user.id,
    );
  }

  // logout
  async logout(user: UserEntity) {
    // pas testé
    const lastMsg = await this.getLastMsg(user);
    user.last_msg_date = lastMsg.createdAt;

    user.user_status = UserStateEnum.OFF;
    user.socketId = '';

    await this.UserRepository.save(user);
    return { message: 'Deconnexion reussie' };
  }

  async getUserFromSocketId(socketId: GetUserIdFromSocketIdDto) {
    return await this.UserRepository.findOne({ where: { socketId: socketId.socketId } });
  }

  async setUserSocketId(id: number, socketId: string) {
    const user = await this.UserRepository.findOne({ where: { id: id } });
    if (!user) {
      console.error('user not found in setUserSocketId');
      return;
    }
    user.socketId = socketId;
    user.user_status = UserStateEnum.ON;

    return await this.UserRepository.save(user);
  }

  async getSocketIdFromUser(id: number) {
    const user = await this.UserRepository.findOne({ where: { id: id } });
    if (!user) {
      console.error('user not found in setUserSocketId');
      return;
    }
    return user.socketId;
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.UserRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException(`No User found for id ${id}`);
    return user;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.UserRepository.findOne({
      where: { username },
    });
    if (!user) throw new NotFoundException(`No User found for username ${username}`);
    return user;
  }

  async generateTwoFactorSecret(user: UserEntity) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.username, 'Transcendence', secret);
    user.secret2fa = secret;
    await this.UserRepository.save(user);
    return { secret, otpauthUrl };
  }
}
