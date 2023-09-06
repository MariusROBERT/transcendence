import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSubDto } from './dtos/user-sub.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { LoginCreditDto } from './dtos/login-credit.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}


    @Post('/signup')
    async register(
        @Body() userData: UserSubDto
    ): Promise<Partial<UserEntity>> {
        console.log("allé ca va");
        return await this.authService.register(userData)
    }

    @Post('/signin')
    async login(
        @Body() credentials: LoginCreditDto,
        // @Res() res: Response
    ) {
        console.log("Uuuuuuuuuuuuu");
        //
        return await this.authService.login(credentials);// return acces_token
    }
}
