import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
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
  UserGameStatus,
} from './dto/user.dto';
import { Express } from 'express';
import { userPictureFileInterception } from './utils/user.picture.fileInterceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // --------- PROFILE --------- :
  // -- PRIVATE -- :

  // get_his_own_profile
  @Get()
  @UseGuards(JwtAuthGuard)
  async GetOwnProfile(@User() user: UserEntity) {
    return user;
  }

  // update_profile
  @Patch()
  @UseGuards(JwtAuthGuard)
  async UpdateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ) {
    return await this.userService.updateProfile(updateUserDto, user);
  }

  @Post('update_picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(userPictureFileInterception)
  async UpdatePicture(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: true,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    return await this.userService.updatePicture(user, file);
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

  @Get('/:id')
  async GetUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity> {
    // ==> renvoi toutes les infos channels
    return await this.userService.getUserById(id);
  }

  // Game ----------------------------------------------------------------------------------------------------------- //
  @Get('/game_status/:id')
  @UseGuards(JwtAuthGuard)
  async GetGameStatusWithId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserGameStatus> {
    //console.log('fetch user game infos')
    return await this.userService.getGameStatusWithId(id);
  }
}
