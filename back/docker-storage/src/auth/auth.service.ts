import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserSubDto } from './dtos/user-sub.dto';
import * as bcrypt from 'bcrypt';
import { LoginCreditDto } from './dtos/login-credit.dto';
import { UserStateEnum } from '../utils/enums/user.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

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
      console.log(user.salt);
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
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.username = :username', { username })
        .getOne();
      console.log(user.salt);
      const hashedPwd = await bcrypt.hash(password, user.salt);
      console.log('hashed: ', hashedPwd);
      console.log('user.password: ', user.password);
      if (hashedPwd === user.password) {
        const payload = {
          username,
          role: user.role,
        };
        const jwt = this.jwtService.sign(payload);
        user.user_status = UserStateEnum.ON;
        console.log('connecté');
        return { 'access-token': jwt };
      }
    } catch (e) {
      throw new NotFoundException(`Username not found`);
    }
    throw new NotFoundException(`Wrong password`);
  }
}
