import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { ChannelEntity } from '../database/entities/channel.entity';
import { UserEntity } from '../database/entities/user.entity';
import { User } from '../utils/decorators/user.decorator';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';

@Controller('channel')
export class ChannelController {
    constructor (
        private ChannelService: ChannelService
    ) {
    }

    @Get('/:id')
    async GetChannelById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ChannelEntity> {                             // ==> renvoi toutes les infos channels 
        return await this.ChannelService.getChannelById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard) 
    async CreateChannel(
        @Body() createChannelDto: CreateChannelDto,
        @User() user: UserEntity,
    ): Promise<ChannelEntity> {
        const chan = await this.ChannelService.createChannel(createChannelDto, user);
        console.log("chan: ", chan);
        console.log("chan.admins: ", chan.admins);
        return chan;
    }

    @Patch('/:id') // id_chan
    @UseGuards(JwtAuthGuard) 
    async UpdateChannel(
        @Body() updateChannelDto: UpdateChannelDto,
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserEntity
    ): Promise<ChannelEntity> {
        return await this.ChannelService.updateChannel(id, updateChannelDto, user);
    }

    @Patch('add_user/:id') // id_chan
    @UseGuards(JwtAuthGuard)
    async AddUserInChannel(
        @User() user: UserEntity,
        @Param('id_chan', ParseIntPipe) id: number,
    ) {
        const chan = await this.ChannelService.addUserInChannel(user, id);
        console.log(chan.users);
        return chan;
    }

}
