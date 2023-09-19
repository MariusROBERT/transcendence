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
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { ChannelEntity } from '../database/entities/channel.entity';
import { UserEntity } from '../database/entities/user.entity';
import { User } from '../utils/decorators/user.decorator';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('/:id')
  async GetChannelById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChannelEntity> {
    // ==> renvoi toutes les infos channels
    return await this.channelService.getChannelById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async CreateChannel(
    @Body() createChannelDto: CreateChannelDto,
    @User() user: UserEntity,
  ): Promise<ChannelEntity> {
    const chan = await this.channelService.createChannel(
      createChannelDto,
      user,
    );
    console.log('chan: ', chan);
    console.log('chan.admins: ', chan.admins);
    return chan;
  }

  @Post('new')
  //@UseGuards(JwtAuthGuard)
  async newChannel(
    @Body() createChannelDto: CreateChannelDto,
    @User() user: UserEntity,
  ): Promise<ChannelEntity> {
    const chan = await this.channelService.createChannel(
      createChannelDto,
      user,
    );
    console.log('chan: ', chan);
    console.log('chan.admins: ', chan.admins);
    return chan;
  }

  @Patch('/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async UpdateChannel(
    @Body() updateChannelDto: UpdateChannelDto,
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<ChannelEntity> {
    return await this.channelService.updateChannel(id, updateChannelDto, user);
  }

  @Patch('add_user/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async AddUserInChannel(
    @User() user: UserEntity,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    const chan = await this.channelService.addUserInChannel(user, id);
    console.log(chan.users);
    return chan;
  }

  @Patch('add_admin/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async AddAdminInChannel(
    @User() user: UserEntity,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    const chan = await this.channelService.addAdminInChannel(user, id);
    console.log(chan.users);
    return chan;
  }

  @Patch('kick/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async KickUserFromChannel(
    @User() user: UserEntity,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    return this.channelService.KickUserFromChannel(user, id);
  }

  @Patch('mute/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async MuteUserFromChannel(
    @User() user: UserEntity,
    @Param('id_chan', ParseIntPipe) id: number,
    @Param('time_sec', ParseIntPipe) time_sec: number,
  ) {
    return this.channelService.MuteUserFromChannel(user, id, time_sec);
  }

  @Patch('ban/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async BanUserFromChannel(
    @User() user: UserEntity,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    return this.channelService.BanUserFromChannel(user, id);
  }
}
