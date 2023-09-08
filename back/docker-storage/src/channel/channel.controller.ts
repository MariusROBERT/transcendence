import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { ChannelDto, CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';

@Controller('channel')
export class ChannelController {
    constructor (
        private ChannelService: ChannelService
    ) {
    }

    @Get('/:id')
    async GetChannelById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ChannelEntity> {
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

    @Patch('/:id')
    @UseGuards(JwtAuthGuard) 
    async UpdateChannel(
        @Body() updateChannelDto: UpdateChannelDto,
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserEntity
    ): Promise<ChannelEntity> {
        return await this.ChannelService.updateChannel(id, updateChannelDto, user);
    }

    @Post('add_user/:id_chan')
    @UseGuards(JwtAuthGuard)
    async AddUserInChannel(
        @User() user: UserEntity,
        @Param('id_chan', ParseIntPipe) id: number,
    )
    {
        const chan = await this.ChannelService.addUserInChannel(user, id);
        console.log(chan.users);
        return chan;
    }

}
