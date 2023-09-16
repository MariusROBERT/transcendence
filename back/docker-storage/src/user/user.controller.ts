import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { ChannelEntity } from '../database/entities/channel.entity';
import { MessageEntity } from '../database/entities/message.entity';
import { UserEntity } from '../database/entities/user.entity';
import { User } from '../utils/decorators/user.decorator';
import { UserService } from './user.service';
import {
  PublicProfileDto,
  UpdatePwdDto,
  UpdateUserDto,
} from '../user/dto/user.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // --------- PROFILE --------- :
  // -- PRIVATE -- :

  // get_his_own_profile
  @Get()
  @UseGuards(JwtAuthGuard)
  async GetOwnProfile(@User() user: UserEntity) {
    console.log('usr: ', user);
    return user;
  }

  // update_profile
  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('urlImg'))
  async UpdateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
    // @UploadedFile() file
  ): Promise<UserEntity> {
    return await this.userService.updateProfile(updateUserDto, user); //, file);
  }

  @Patch('update_password')
  @UseGuards(JwtAuthGuard)
  async UpdatePassword(
    @Body() updatePwdDto: UpdatePwdDto,
    @User() user: UserEntity,
  ) {
    return this.userService.updatePassword(updatePwdDto, user);
  }

  // -- PUBLIC -- :

  // get_all_public_profile => pour le leaderboard donc seulement les infos public
  @Get('get_all_public_profile')
  @UseGuards(JwtAuthGuard)
  async GetAllPublicProfile(
    @User() user: UserEntity,
    @Req() request: Request,
  ): Promise<PublicProfileDto[]> {
    return await this.userService.getAllProfile(user);
  }

  // get_a_public_profile_by_id
  @Get('get_public_profile_by_id/:id')
  @UseGuards(JwtAuthGuard)
  async GetProfile(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PublicProfileDto> {
    return await this.userService.getPublicProfile(id, user);
  }

  // --------- MSG & CHANNEL --------- :

  // get_message_from_channel
  @Get('/get_msg/:id_chan')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @User() user: UserEntity,
    @Param('id_chan', ParseIntPipe) id: number,
    channels: ChannelEntity[],
  ): Promise<MessageEntity[]> {
    return await this.userService.getMsgsByChannel(user, channels, id);
  }

  // get last message
  @Get('get_last_msg')
  @UseGuards(JwtAuthGuard)
  async GetLastMsg(@User() user: UserEntity) {
    return await this.userService.getLastMsg(user);
  }

  // get_channels_of_user
  @Get('get_channels')
  @UseGuards(JwtAuthGuard)
  async GetChannels(@User() user: UserEntity) {
    return await this.userService.getChannels(user);
  }

  // ask_friend
  @Patch('demand/:id') // id of friend
  @UseGuards(JwtAuthGuard)
  async FriendsDemand(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity> {
    return await this.userService.askFriend(user, id);
  }

  // accept_or_denied_aks
  @Patch('handle_ask/:id/:bool') // bool envoyé en param : 0 invite refusé, 1 invite accepté
  @UseGuards(JwtAuthGuard)
  async responseAsks(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Param('bool', ParseIntPipe) bool: number,
  ) {
    if (bool >= 0 && bool <= 1)
      return await this.userService.handleAsk(user, id, bool);
    else
      throw new HttpException(
        'Le nombre doit être 0 ou 1',
        HttpStatus.BAD_REQUEST,
      );
  }

  // logout
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async Delog(@User() user: UserEntity) {
    return await this.userService.logout(user);
  }
}
