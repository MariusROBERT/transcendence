import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadInterface } from '../interfaces/payload-interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';

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
      const { password, salt, ...result } = user; // on envoi tout sauf passport et salt
      // reviens au meme que :
      // delete user.salt
      // delete user.password
      // return user
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }
}
