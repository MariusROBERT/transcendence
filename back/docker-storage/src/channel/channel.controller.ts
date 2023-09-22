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
  ChannelDto,
  CreateChannelDto,
  UpdateChannelDto,
} from './dto/channel.dto';
import { UserAddChanDto, UserChanDto } from 'src/user/dto/user.dto';
import { AddMsgDto } from 'src/messages/dto/add-msg.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { ChannelEntity } from '../database/entities/channel.entity';
import { MessageEntity } from '../database/entities/channel.entity';
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

  @Get('/:id/msg')
  async GetChannelMessages(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageEntity[]> {
    return await this.channelService.getChannelMessages(id);
  }

  @Post()
  //@UseGuards(JwtAuthGuard)
  async CreateChannel(
    @Body() createChannelDto: CreateChannelDto,
    //@User() user: UserChanDto,
  ): Promise<ChannelEntity> {
    console.log("caca");
    const chan = await this.channelService.createChannel(
      createChannelDto,
    );
    console.log('chan: ', chan);
    //console.log('chan.admins: ', chan.admins);
    return null;
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

  //@Patch('add_user/:id') // id_chan
  @Patch('add_user/:id') // id_chan
  //@UseGuards(JwtAuthGuard)
  async AddUserInChannel(
    @Body() user: UserAddChanDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log("here");
    const chan = await this.channelService.addUserInChannel(user, id);
    console.log(chan.users);
    return chan;
  }

  @Patch('add_admin/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async AddAdminInChannel(
    @User() user: UserChanDto,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    const chan = await this.channelService.addAdminInChannel(user, id);
    console.log(chan.users);
    return chan;
  }

  @Patch('kick/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async KickUserFromChannel(
    @User() user: UserChanDto,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    return this.channelService.KickUserFromChannel(user, id);
  }

  @Patch('mute/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async MuteUserFromChannel(
    @User() user: UserChanDto,
    @Param('id_chan', ParseIntPipe) id: number,
    @Param('time_sec', ParseIntPipe) time_sec: number,
  ) {
    return this.channelService.MuteUserFromChannel(user.id, id, time_sec);
  }

  @Patch('mute/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async UnMuteUserFromChannel(
    @User() user: UserChanDto,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    return this.channelService.UnMuteUserFromChannel(user.id, id);
  }

  @Patch('ban/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async BanUserFromChannel(
    @User() user: UserChanDto,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    return this.channelService.BanUserFromChannel(user.id, id);
  }

  @Patch('ban/:id') // id_chan
  @UseGuards(JwtAuthGuard)
  async UnBanUserFromChannel(
    @User() user: UserChanDto,
    @Param('id_chan', ParseIntPipe) id: number,
  ) {
    return this.channelService.UnBanUserFromChannel(user.id, id);
  }

  @Post('add_msg')
  //@UseGuards(JwtAuthGuard)
  async AddMessageToChannel(@Body() addmsgDto: AddMsgDto) {
    return this.channelService.AddMessageToChannel(addmsgDto);
  }
}
