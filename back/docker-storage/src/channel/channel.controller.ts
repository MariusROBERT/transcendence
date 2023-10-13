import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import {
  CreateChannelDto,
  EditChannelDto,
  UpdateChannelDto,
} from './dto/channel.dto';
import { UserChanDto } from 'src/user/dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import {
  ChannelEntity,
  MessageEntity,
} from '../database/entities/channel.entity';
import { User } from '../utils/decorators/user.decorator';
import { UserEntity } from '../database/entities/channel.entity';
import {
  AdminGuard,
  OwnerGuard,
  TargetIsAdminGuard,
} from './guards/chan-admin.guards';
import {
  IsValidChannel,
  InChannelGuard,
  IsBannedGuard,
  IsNotBannedGuard,
  PrivateGuard,
  SelfBannedGuard,
  SelfCommand,
  IsProtected,
  SelfInChannelGuard,
} from './guards/chan-basic.guards';
import path from 'path';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {
  }

  //  Only get the public data
  @Get('/public/:id')
  @UseGuards(JwtAuthGuard)
  async GetPublicChannelById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChannelEntity> {
    // ==> Send all public info
    return await this.channelService.getPublicChannelById(id);
  }

  //  Only get the public data for all public channels
  @Get('/public_all')
  @UseGuards(JwtAuthGuard)
  async GetPublicChannelsData(@User() user: UserEntity) {
    return await this.channelService.getPublicChannelsData(user);
  }

  @Get('/name/:id')
  //@UseGuards(JwtAuthGuard)
  async GetChannelIdByName(@Param('id') id: string) {
    return await this.channelService.getChannelIdByName(id);
  }

  @Get('/msg/:id')
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
  ): Promise<UserEntity[]> {
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

  //  TODO CHANGE TO GET
  @Post('/of_user')
  @UseGuards(JwtAuthGuard)
  async GetChannelOfUser(@User() user: UserEntity): Promise<ChannelEntity[]> {
    return await this.channelService.getChannelOfUser(user.id);
  }

  @Post()
  @UseGuards(IsValidChannel)
  @UseGuards(JwtAuthGuard)
  async CreateChannel(
    @Body() createChannelDto: CreateChannelDto,
    @User() user: UserEntity,
  ): Promise<ChannelEntity> {
    return await this.channelService.createChannel(createChannelDto, user);
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
    const chat = this.channelService.addUserInChannel(user.id, id);
    return chat;
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
    const chan = await this.channelService.addAdminInChannel(uDto.id, id);
    return chan;
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
    const chan = await this.channelService.remAdminInChannel(uDto.id, id);
    return chan;
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

  //  TODO: Add dto
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

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async GetChannelById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChannelEntity> {
    // ==> renvoi toutes les infos channels
    return await this.channelService.getChannelById(id);
  }

  @Patch('/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async UpdateChannel(
    @Body() updateChannelDto: UpdateChannelDto,
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserChanDto,
  ): Promise<ChannelEntity> {
    return await this.channelService.updateChannel(
      id,
      updateChannelDto,
      user.id,
    );
  }
}
