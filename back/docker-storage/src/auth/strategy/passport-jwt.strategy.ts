import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadInterface } from '../interfaces/payload-interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      // prend un tableau d'option  qui vont indentifier la facon avec laquelle
      //  passport va authentifier les requetes qui vont venir
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // recup le jwt de la requet en utilisant tel requet
      ignoreExpiration: false, // verifie la date d'expiration
      secretOrKey: process.env.JWT_SECRET, // get la secret key pr jwt
    });
  }

  async validate(payload: PayloadInterface) {
    // a chaque fois que la requette arrive, voila comment tu va valider mon token !
    const user = await this.userRepository.findOne({
      where: { username: payload.username },
    }); // recup user
    // if exist => return et balancer dans le request
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, salt, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }
}
