import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserSubDto } from './dtos/user-sub.dto';
import * as bcrypt from 'bcrypt';
import { LoginCreditDto } from './dtos/login-credit.dto';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
    ) {}
    
      
    async register(userData: UserSubDto): Promise<Partial<UserEntity>> { // on veut crypter le pwd avec la bibliotheque bcrypt
        // Create User
        const user = this.userRepository.create({
            ...userData
        });
        user.salt = await bcrypt.genSalt() // genere le salt
        user.password = await bcrypt.hash(user.password, user.salt) // la on change le pwd, voila pourquoi le username: unique fonctionne mais pas celui du pwd
        try {
            await this.userRepository.save(user) // save user in DB
        } catch (e) {
            throw new ConflictException(`username or password already used`)
        }
// METTRE UNE IMG PAR DEFAULT
        return {
            id: user.id,
            username: user.username,
            password: user.password,
        };
    }

    async login(creditentials: LoginCreditDto) {
        
        const {username, password} = creditentials
        const user = await this.userRepository.createQueryBuilder("user")
        .where("user.username = :username", {username} )
        .getOne();
        if (!user) {
            throw new NotFoundException(`username not found`)
        }

        const hashedPwd = await bcrypt.hash(password, user.salt)
        console.log(hashedPwd);
        
        if (hashedPwd === user.password) {
// JWT
            const payload = {
                username,
                role: user.role
            }
            console.log("coucou");
            const jwt = await this.jwtService.sign(payload)
            console.log(jwt);
            return { 'access-token': jwt }
        } else {
            throw new NotFoundException(`wrong password`)
        }
    }



}
