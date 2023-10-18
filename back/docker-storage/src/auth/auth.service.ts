import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {JwtService} from '@nestjs/jwt';
import {UserEntity} from '../database/entities/user.entity';
import {Repository} from 'typeorm';
import {UserSubDto} from './dtos/user-sub.dto';
import * as bcrypt from 'bcrypt';
import {LoginCreditDto} from './dtos/login-credit.dto';
import {UserStateEnum} from '../utils/enums/user.enum';
import {ftLoginDto} from './dtos/ft-login.dto';
import {authenticator} from 'otplib';
import {API_URL} from '../utils/Globals';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {
  }

  async register(userData: UserSubDto): Promise<Partial<UserEntity>> {
    // on veut crypter le pwd avec la bibliotheque bcrypt
    // Create User
    //DEV: comment these 2 lines for dev
    if (!/^((?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#+=`'";:?.,<>~\-\\]).{8,50})$/.test(userData.password))
      throw new BadRequestException('Password must contain between 8 and 50 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character');
    if (!/[a-zA-Z0-9\-_+.]{1,10}/.test(userData.username))
      throw new BadRequestException('Username must contain between 1 and 10 characters, only letters, numbers and -_+. are allowed');
    const user = this.userRepository.create({
      ...userData,
    });
    user.salt = await bcrypt.genSalt(); // genere le salt
    user.password = await bcrypt.hash(user.password, user.salt);
    user.user_status = UserStateEnum.ON;
    user.urlImg = API_URL + '/public/default.png';
    user.friends = [];
    user.sentInvitesTo = [];
    user.recvInvitesFrom = [];
    user.blocked = [];
    try {
      await this.userRepository.save(user); // save user in DB
    } catch (e) {
      throw new ConflictException('Username already used');
    }
    return {
      id: user.id,
      username: user.username,
      password: user.password,
    };
  }

  async login(creditentials: LoginCreditDto) {
    const {username, password} = creditentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', {username})
      .getOne();
    if (!user) {
      throw new NotFoundException('username not found');
    }

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

    const hashedPwd = await bcrypt.hash(password, user.salt);
    //console.log(hashedPwd);

    if (hashedPwd === user.password) {
      // JWT
      const payload = {
        username,
        role: user.role,
      };
      user.user_status = UserStateEnum.ON;
      await this.userRepository.save(user);
      const jwt = this.jwtService.sign(payload);
      return {'access-token': jwt};
    }
    throw new NotFoundException('wrong password');
  }

  async ftLogin(userData: ftLoginDto) {
    //console.log(userData.username);

    userData.username = userData.username + '_42';
    const {username, urlImg} = userData;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', {username})
      .getOne();
    if (!user) {
      const user2 = this.userRepository.create({
        ...userData,
      });
      user2.salt = '42'; // = await bcrypt.genSalt();
      user2.password = '42'; // = await bcrypt.hash(user.password, user.salt);
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
      .where('user.username = :username', {username})
      .getOne();
    // JWT
    if (user2.is2fa_active) {
      return 'missing 2fa code';
    }
    const payload = {
      username,
      role: user2.role,
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
      .where('user.username = :ftLogin', {ftLogin})
      .getOne();
    if (!user) {
      throw new NotFoundException('user not found');
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
        role: user.role,
      };
      const jwt = this.jwtService.sign(payload);
      return {'access-token': jwt};
      // return this.jwtService.sign(payload);
    }
    throw new UnauthorizedException('2fa not active');
  }
}
