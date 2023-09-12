import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';

@Controller('channel')
export class ChannelController {
    constructor (
        private ChannelService: ChannelService
    ) {
    }

    @Post('new')
    //@UseGuards(JwtAuthGuard)
    async newChannel( @Body() chanDto: CreateChannelDto)
    {
        return this.ChannelService.newChannel(chanDto);
    }

    @Post('test')
    async test(@Body() b)
    {
        console.log("test");
    }
//
    @Get('Ali')
    async Ali()
    {
        return "hello";
    }
    // @Post()
    // @UseGuards(JwtAuthGuard) 
    // async CreateChannel(
    //     @Body() createChannelDto: CreateChannelDto,
    //     @User() user: UserEntity,
    // ): Promise<ChannelEntity> {
    //     return await this.ChannelService.createChannel(createChannelDto, user)
    // }

    // @Patch('/:id')
    // @UseGuards(JwtAuthGuard) 
    // async UpdateChannel(
    //     @Body() updateChannelDto: UpdateChannelDto,
    //     @Param('id', ParseIntPipe) id: number,
    //     @User() user: UserEntity,
    // ): Promise<ChannelEntity> {
    //     return await this.ChannelService.updateChannel(id, updateChannelDto, user)
    // }

    // @Delete('/:id')
    // @UseGuards(JwtAuthGuard)
    // async RemoveChannel(
    //     @Param('id', ParseIntPipe) id: number,
    //     @User() user: UserEntity
    // ): Promise<ChannelEntity> {
    //     return await this.ChannelService.removeChannel(id, user) // check si admin ou owner
    // }

}
