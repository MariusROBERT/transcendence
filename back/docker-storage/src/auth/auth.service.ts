import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    const user = this.userRepository.create({
      ...userData,
    });
    user.salt = await bcrypt.genSalt(); // genere le salt
    user.password = await bcrypt.hash(user.password, user.salt);
    user.user_status = UserStateEnum.ON;
    user.urlImg = 'http://localhost:3001/public/default.png';
    user.friends = [];
    user.invited = [];
    user.invites = [];
    try {
      //console.log(user.salt);
      await this.userRepository.save(user); // save user in DB
    } catch (e) {
      throw new ConflictException(`username or password already used`);
    }
    return {
      id: user.id,
      username: user.username,
      password: user.password,
    };
  }

  async login(creditentials: LoginCreditDto) {
    const { username, password } = creditentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
    if (!user) {
      throw new NotFoundException(`username not found`);
    }

    console.log('2fa active : ' + user.is2fa_active);
    if (user.is2fa_active) {
      console.log('2fa active');
      if (creditentials.twoFactorCode) {
        console.log('2fa code : ' + creditentials.twoFactorCode);
        if (!authenticator.verify(
          {
            token: creditentials.twoFactorCode,
            secret: user.secret2fa,
          })) {
          throw new UnauthorizedException(`Invalid 2fa code`);
        } else {
          console.log('2fa code OK');
        }
      } else {
        console.log('no 2fa code');
        throw new UnauthorizedException(`Missing 2fa code`);
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
      const jwt = this.jwtService.sign(payload);
      user.user_status = UserStateEnum.ON;
      return { 'access-token': jwt };
    } else {
      throw new NotFoundException(`wrong password`);
    }
  }

  async ftLogin(userData: ftLoginDto) {
    //console.log(userData.username);

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
      user2.user_status = UserStateEnum.ON;
      user2.friends = [];
      user2.invited = [];
      user2.invites = [];
      user2.urlImg = urlImg;
      user2.id42 = userData.id42;
      try {
        await this.userRepository.save(user2); // save user in DB
      } catch (e) {
        throw new ConflictException(`username already used`); // should not happen, will probably be removed
      }
    }
    const user2 = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
    // JWT
    if (user2.is2fa_active) {
      console.log('2fa active');
      return '';
    }
    const payload = {
      username,
      role: user2.role,
    };
    return this.jwtService.sign(payload);
  }

  async ftLogin2fa(ftToken: string, code2fa: string) {
    const id42: number = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + ftToken,
      },
    })
      .then(res => res.json())
      .then(json => parseInt(json.id));
    console.log(id42);
    if (!id42) {
      throw new NotFoundException(`Invalid intra token`);
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id42 = :id42', { id42 })
      .getOne();
    console.log(user);
    if (!user) {
      throw new NotFoundException(`user not found`);
    }
    if (user.is2fa_active) {
      if (!authenticator.verify(
        {
          token: code2fa,
          secret: user.secret2fa,
        })) {
        console.log('2fa code KO');
        throw new UnauthorizedException(`Invalid 2fa code`);
      }
      const payload = {
        username: user.username,
        role: user.role,
      }
      console.log('2fa code OK');
      const jwt = this.jwtService.sign(payload);
      console.log('jwt: ', jwt);
      return { 'access-token': jwt };
      // return this.jwtService.sign(payload);
    } else {
      console.log('2fa not active');
      throw new UnauthorizedException(`2fa not active`);
    }
  }
}
