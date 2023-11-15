import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards,} from '@nestjs/common';
import {ChannelService} from './channel.service';
import {CreateChannelDto, EditChannelDto, PublicChannelDto,} from './dto/channel.dto';
import {UserChanDto} from 'src/user/dto/user.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guards';
import {ChannelEntity, MessageEntity,} from '../database/entities/channel.entity';
import {User} from '../utils/decorators/user.decorator';
import {UserEntity} from '../database/entities/user.entity';
import {AdminGuard, OwnerGuard, TargetIsAdminGuard,} from './guards/chan-admin.guards';
import {
  InChannelGuard,
  IsBannedGuard,
  IsNotBannedGuard,
  IsProtected,
  IsValidChannel,
  PrivateGuard,
  SelfBannedGuard,
  SelfCommand,
  SelfInChannelGuard,
} from './guards/chan-basic.guards';
import {ChanStateEnum} from "../utils/enums/channel.enum";

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {
  }

  @Get('/public/:id')
  @UseGuards(JwtAuthGuard)
  async GetPublicChannelById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PublicChannelDto> {
    return await this.channelService.getPublicChannelById(id);
  }

  @Get('/public_all')
  @UseGuards(JwtAuthGuard)
  async GetPublicChannelsData(@User() user: UserEntity): Promise<{
    id: number,
    channel_name: string,
    chan_status: ChanStateEnum,
    priv_msg: boolean,
    has_password: boolean,
  }[]> {
    return await this.channelService.getPublicChannelsData(user);
  }

  @Get('/name/:chan_name')
  //@UseGuards(JwtAuthGuard)
  async GetChannelIdByName(@Param('chan_name') chan_name: string) : Promise<{channel_id: number}> {
    return await this.channelService.getChannelIdByName(chan_name);
  }

  @Get('/msgs/:id')
  @UseGuards(SelfInChannelGuard)
  @UseGuards(JwtAuthGuard)
  async GetChannelMessages(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageEntity[]> {
    return await this.channelService.getChannelMessages(id);
  }

  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  async GetChannelUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserChanDto[]> {
    return await this.channelService.getChannelUsers(id);
  }

  @Get('/rights/:id')
  @UseGuards(JwtAuthGuard)
  async GetChannelUsersRights(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ) {
    return await this.channelService.getChannelUserRights(id, user);
  }

  @Get('/of_user')
  @UseGuards(JwtAuthGuard)
  async GetChannelOfUser(@User() user: UserEntity): Promise<PublicChannelDto[]> {
    return await this.channelService.getChannelOfUser(user.id);
  }

  @Post()
  @UseGuards(IsValidChannel)
  @UseGuards(JwtAuthGuard)
  async CreateChannel(
    @Body() createChannelDto: CreateChannelDto,
    @User() user: UserEntity,
  ): Promise<PublicChannelDto> {
    return await this.channelService.createChannel(createChannelDto, user);
  }

  //  Join private channel if exist, else create it
  @Post('/join_private')
  @UseGuards(JwtAuthGuard)
  async JoinPrivate(
    @Body() second_user: any, // Create private user dto
    @User() user: UserEntity,
  ): Promise<{ channel_id: number, channel_name: string }> {
    return await this.channelService.joinPrivate(second_user, user);
  }

  @Patch('/edit/:id')
  @UseGuards(AdminGuard, PrivateGuard)
  @UseGuards(JwtAuthGuard)
  async EditChannel(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() editChannelDto: EditChannelDto,
  ) {
    return this.channelService.editChannel(editChannelDto, id);
  }

  @Post('/add_user/:id')
  @UseGuards(PrivateGuard, SelfBannedGuard, IsProtected)
  @UseGuards(JwtAuthGuard)
  async addUserInChannel(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.channelService.addUserInChannel(user.id, id);
  }

  //  Quit channel
  @Patch('leave/:id')
  @UseGuards(PrivateGuard, SelfInChannelGuard)
  @UseGuards(JwtAuthGuard)
  async leaveChannel(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.channelService.leaveChannel(user.id, id);
  }

  @Post('/add_admin/:id')
  @UseGuards(
    AdminGuard,
    PrivateGuard,
    InChannelGuard,
    IsNotBannedGuard,
    SelfCommand,
    TargetIsAdminGuard,
  )
  @UseGuards(JwtAuthGuard)
  async AddAdminInChannel(
    @Body() uDto: UserChanDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.channelService.addAdminInChannel(uDto.id, id);
  }

  @Post('/rem_admin/:id')
  @UseGuards(
    OwnerGuard,
    PrivateGuard,
    InChannelGuard,
    IsNotBannedGuard,
    SelfCommand,
  )
  @UseGuards(JwtAuthGuard)
  async RemAdminInChannel(
    @Body() uDto: UserChanDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.channelService.remAdminInChannel(uDto.id, id);
  }

  @Post('/kick/:id') // id_chan
  @UseGuards(
    AdminGuard,
    PrivateGuard,
    InChannelGuard,
    SelfCommand,
    TargetIsAdminGuard,
  )
  @UseGuards(JwtAuthGuard)
  async KickUserFromChannel(
    @Body() uDto: UserChanDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.channelService.KickUserFromChannel(uDto.id, id);
  }

  @Post('mute/:id') // id_chan
  @UseGuards(
    AdminGuard,
    PrivateGuard,
    InChannelGuard,
    IsNotBannedGuard,
    SelfCommand,
    TargetIsAdminGuard,
  )
  @UseGuards(JwtAuthGuard)
  async MuteUserFromChannel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.channelService.MuteUserFromChannel(body.id, id, body.time);
  }

  @Post('unmute/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async UnMuteUserFromChannel(
    @Body() uDto: UserChanDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.channelService.UnMuteUserFromChannel(uDto.id, id);
  }

  @Post('ban/:id') // id_chan
  @UseGuards(
    AdminGuard,
    PrivateGuard,
    InChannelGuard,
    IsNotBannedGuard,
    SelfCommand,
    TargetIsAdminGuard,
  )
  @UseGuards(JwtAuthGuard)
  async BanUserFromChannel(
    @Body() uDto: UserChanDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.channelService.BanUserFromChannel(uDto.id, id);
  }

  @Post('unban/:id') // id_chan
  @UseGuards(
    AdminGuard,
    PrivateGuard,
    IsBannedGuard,
    SelfCommand,
    TargetIsAdminGuard,
  )
  @UseGuards(JwtAuthGuard)
  async UnBanUserFromChannel(
    @Body() uDto: UserChanDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.channelService.UnBanUserFromChannel(uDto.id, id);
  }
}
