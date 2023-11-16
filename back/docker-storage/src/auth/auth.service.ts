import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserSubDto } from './dtos/user-sub.dto';
import * as bcrypt from 'bcrypt';
import { LoginCreditDto } from './dtos/login-credit.dto';
import { UserStateEnum } from '../utils/enums/user.enum';
import { ftLoginDto } from './dtos/ft-login.dto';
import { authenticator } from 'otplib';
import { API_URL } from '../utils/Globals';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {
  }

  async register(userData: UserSubDto): Promise<{id: number, username: string }>{
    // on veut crypter le pwd avec la bibliotheque bcrypt
    // Create User
    if (!/^((?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#+=`'";:?*.,<>~\-\\]).{8,50})$/.test(userData.password))
      throw new BadRequestException('Password must contain between 8 and 50 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character');
    if (!/[a-zA-Z0-9\-_+.]{1,11}/.test(userData.username))
      throw new BadRequestException('Username must contain between 1 and 11 characters, only letters, numbers and -_+. are allowed');
    const user = this.userRepository.create({
      ...userData,
    });
    user.salt = await bcrypt.genSalt(); // genere le salt
    user.password = await bcrypt.hash(user.password, user.salt);
    user.pseudo = user.username;
    user.user_status = UserStateEnum.ON;
    user.urlImg = API_URL + '/public/default.png';
    user.friends = [];
    user.sentInvitesTo = [];
    user.recvInvitesFrom = [];
    user.blocked = [];
    user.gamesId = [];
    user.rank = 0;
    try {
      await this.userRepository.save(user); // save user in DB
    } catch (e) {
      throw new ConflictException('Username already used');
    }
    return {
      id: user.id,
      username: user.username,
    };
  }

  async login(creditentials: LoginCreditDto) {
    const { username, password } = creditentials;
    if (username.endsWith('_42'))
      throw new UnauthorizedException('Click in the 42 button to connect with intra');
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
    if (!user) {
      throw new BadRequestException('username not found');
    }

    const hashedPwd = await bcrypt.hash(password, user.salt);

    if (hashedPwd === user.password) {
      if (user.is2fa_active) {
        if (creditentials.twoFactorCode) {
          if (
              !authenticator.verify({
                token: creditentials.twoFactorCode,
                secret: user.secret2fa,
              })
          ) {
            throw new UnauthorizedException('Invalid 2fa code');
          }
        } else {
          throw new UnauthorizedException('Missing 2fa code');
        }
      }
      // JWT
      // TODO : change payload: put only user.id
      const payload = {
        username,
      };
      user.user_status = UserStateEnum.ON;

      // secu for friendsRequest
      user.sentInvitesTo.forEach(id => {
        if (user.friends.includes(id)) {
          user.sentInvitesTo.filter((el) => el !== id);
        }
      });

      await this.userRepository.save(user);
      const jwt = this.jwtService.sign(payload);
      return { 'access-token': jwt };
    }
    throw new BadRequestException('wrong password');

  }

  async ftLogin(userData: ftLoginDto) {

    userData.username = userData.username + '_42';
    const { username, urlImg } = userData;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
    if (!user) {
      const user2 = this.userRepository.create({
        ...userData,
      });
      user2.salt = '42'; // = await bcrypt.genSalt();
      user2.password = '42'; // = await bcrypt.hash(user.password, user.salt);
      user2.pseudo = username;
      user2.user_status = UserStateEnum.ON;
      user2.friends = [];
      user2.sentInvitesTo = [];
      user2.recvInvitesFrom = [];
      user2.blocked = [];
      user2.urlImg = urlImg;
      try {
        await this.userRepository.save(user2); // save user in DB
      } catch (e) {
        throw new ConflictException('username already used'); // should not happen, will probably be removed
      }
    }
    const user2 = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
    // JWT
    if (user2.is2fa_active) {
      return 'missing 2fa code';
    }
    const payload = {
      username,
    };
    return this.jwtService.sign(payload);
  }

  async ftLogin2fa(req: any, code2fa: string) {
    let ftLogin = '';
    for (const rawSession in req.sessionStore.sessions) {
      const session = JSON.parse(req.sessionStore.sessions[rawSession]);
      if (session.passport.user.username)
        ftLogin = session.passport.user.username + '_42';
    }
    if (ftLogin === '') {
      throw new UnauthorizedException('no session found');
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :ftLogin', { ftLogin })
      .getOne();
    if (!user) {
      throw new BadRequestException('user not found');
    }
    if (user.is2fa_active) {
      if (
        !authenticator.verify({
          token: code2fa,
          secret: user.secret2fa,
        })
      ) {
        throw new UnauthorizedException('Invalid 2fa code');
      }
      const payload = {
        username: user.username,
      };
      const jwt = this.jwtService.sign(payload);
      return { 'access-token': jwt };
      // return this.jwtService.sign(payload);
    }
    throw new UnauthorizedException('2fa not active');
  }
}
