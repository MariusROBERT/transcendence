import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSubDto } from './dtos/user-sub.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { LoginCreditDto } from './dtos/login-credit.dto';
// import { Response } from 'express'; 

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('/register')
    async Register(
        @Body() userData: UserSubDto
    ): Promise<Partial<UserEntity>> {
        console.log("allé ca va");
        return await this.authService.register(userData)
    }

    @Post('/login')
    async Login(
        @Body() credentials: LoginCreditDto,
        // @Res() res: Response
    ) {
        console.log("Connecté");
        return await this.authService.login(credentials);// return acces_token
        // const token = await this.authService.login(credentials);
        // res.cookie('token', token, { httpOnly: true, secure: true });
        // return { message: 'Connecté avec succès' };
    }

    // @Post('/delog')
    // @UseGuards(JwtAuthGuard)
    // async Delog(
    //     @User() user: UserEntity,
    //     @Body() credentials: LoginCreditDto,
    //     // @Res() res: Response
    // ) {
    //     return await this.authService.delog(user);
    // }
}
