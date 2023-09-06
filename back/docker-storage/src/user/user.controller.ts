import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { MessageEntity } from 'src/database/entities/message.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/user/dto/user.dto';

@Controller('user')
export class UserController {
    constructor (
        private UserService: UserService
    ) {
    }

// get_profile
    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async GetProfile(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.UserService.getProfile(id, user)
    }

// update_profile
    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    async UpdateProfile(
        @Body() updateUserDto: UpdateUserDto,
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserEntity
    ): Promise<UserEntity> {
        return await this.UserService.updateProfile(id, updateUserDto, user);
    }

// get_message_from_channel 
    @Get('/get_msg/:id_chan')
    @UseGuards(JwtAuthGuard) 
    async getMessages(
        @User() user: UserEntity,
        @Param('id_chan', ParseIntPipe) id: number,
        channels: ChannelEntity[]
    ): Promise<MessageEntity[]> {
        return await this.UserService.getMsgsByChannel(user, channels, id)
    }

// get_channels_from_user
    @Get('get_channels_user/:id_user')
    @UseGuards(JwtAuthGuard) 
    async GetChannels(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        channel: ChannelEntity[]
    ) {
        return await this.UserService.getChannels(user, channel)
    }
        
}