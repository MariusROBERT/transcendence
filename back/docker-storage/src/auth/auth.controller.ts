import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSubDto } from './dtos/user-sub.dto';
import { UserEntity } from '../database/entities/user.entity';
import { LoginCreditDto } from './dtos/login-credit.dto';
import { FtOAuthGuard } from './guards/ft-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async Register(@Body() userData: UserSubDto): Promise<Partial<UserEntity>> {
    console.log('allé ca va');
    return await this.authService.register(userData);
  }

  @Post('/login')
  async Login(
    @Body() credentials: LoginCreditDto,
    // @Res() res: Response
  ) {
    console.log('Uuuuuuuuuuuuu');
    return await this.authService.login(credentials); // return acces_token
  }

  @Get('login/42')
  @UseGuards(FtOAuthGuard)
  auth42() {
    return 'login';
  }

  @Get('callback/42')
  @UseGuards(FtOAuthGuard)
  auth42callback(@Request() req) {
    return { username: req.user.username, image: req.user?._json.image.link };
    // return req.user;
  }
}
