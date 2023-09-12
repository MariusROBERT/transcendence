import {
  Body,
  Controller,
  Delete,
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
  async newChannel(@Body() chanDto: CreateChannelDto) {
    return this.channelService.newChannel(chanDto);
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
}
