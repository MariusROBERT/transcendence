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
          throw new UnauthorizedException(`Wrong 2fa code`);
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
    const payload = {
      username,
      role: user2.role,
    };
    return this.jwtService.sign(payload);
  }
}
