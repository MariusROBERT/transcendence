import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSubDto } from './dtos/user-sub.dto';
import { UserEntity } from '../database/entities/user.entity';
import { LoginCreditDto } from './dtos/login-credit.dto';
import { FtOAuthGuard } from './guards/ft-auth.guards';
import { ftLoginDto } from './dtos/ft-login.dto';
import { FtAuthFilter } from './filters/ftAuth.filter';
import { FRONT_URL } from '../utils/Globals';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/register')
  async Register(@Body() userData: UserSubDto): Promise<Partial<UserEntity>> {
    return await this.authService.register(userData);
  }

  @Post('/login')
  async Login(@Body() credentials: LoginCreditDto) {
    return await this.authService.login(credentials); // return acces_token
  }

  @Get('login/42')
  @UseGuards(FtOAuthGuard)
  auth42() {
    return 'How did you get here ?';
  }

  @Get('callback/42')
  @UseGuards(FtOAuthGuard)
  @UseFilters(FtAuthFilter)
  async auth42callback(@Req() req, @Res() res) {
    const token = await this.authService.ftLogin({
      username: req.user.username,
      urlImg: req.user._json.image.link,
      id42: req.user.id,
    } as ftLoginDto);

    return res.redirect(
      FRONT_URL + '?' + new URLSearchParams({ 'access-token': token }),
    );
  }

  @Post('2fa/42')
  async twoFa42(@Body() body, @Req() req) {
    return await this.authService.ftLogin2fa(req, body.code2fa);
  }
}
