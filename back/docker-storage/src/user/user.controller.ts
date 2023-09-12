import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { MessageEntity } from 'src/database/entities/message.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { UserService } from './user.service';
import { PublicProfileDto, UpdateUserDto } from 'src/user/dto/user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor (
        private readonly UserService: UserService
    ) {}

// --------- PROFILE --------- :
// -- PRIVATE -- :

// get_his_own_profile
    // @Get()
    // @UseGuards(JwtAuthGuard)
    // async GetOwnProfile(
    //     @User() user: UserEntity,
    // ) {
    //     return user
    // }

// update_profile
    @Patch()
    @UseGuards(JwtAuthGuard)
    async UpdateProfile(
        @Body() updateUserDto: UpdateUserDto,
        @User() user: UserEntity
    ): Promise<UserEntity> {
        return await this.UserService.updateProfile(updateUserDto, user);
    }

// -- PUBLIC -- :

// get_all_public_profile => pour le leaderboard donc seulement les infos public
    @Get('get_all_public_profile')
    @UseGuards(JwtAuthGuard)
    async GetAllPublicProfile(
        @User() user: UserEntity,
        @Req() request: Request
    ): Promise<PublicProfileDto[]> {
        console.log("coucoucou");
        
        return await this.UserService.getAllProfile(user)
    }

// get_a_public_profile_by_id
    @Get('get_public_profile_by_id/:id')
    @UseGuards(JwtAuthGuard)
    async GetProfile(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PublicProfileDto> {
        return await this.UserService.getPublicProfile(id, user)
    }


// --------- MSG & CHANNEL --------- :

// get_message_from_channel 
    @Get('/get_msg/:id_chan')
    @UseGuards(JwtAuthGuard) 
    async getMessages(
        @User() user: UserEntity,
        @Param('id_chan', ParseIntPipe) id: number,
        channels: ChannelEntity[]
    ): Promise<MessageEntity[]> {
        return await this.UserService.getMsgsByChannel(user, channels, id);
    }

// get last message 
    @Get('get_last_msg')
    @UseGuards(JwtAuthGuard) 
    async GetLastMsg(
        @User() user: UserEntity,
    ) {
        return await this.UserService.getLastMsg(user);
    }

// get_channels_of_user
    @Get('get_channels')
    @UseGuards(JwtAuthGuard) 
    async GetChannels(
        @User() user: UserEntity,
    ) {
        return await this.UserService.getChannels(user)
    }
        
// ask_friend
    @Post('demand/:id')
    @UseGuards(JwtAuthGuard) 
    async FriendsDemand(
        @User() user: UserEntity,
        users: UserEntity[],
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return await this.UserService.askFriend(user, id, users);
    }

// accept_or_denied_aks
    @Delete('delete_ask/:id/:bool') // bool envoyé en param : 0 invite refusé, 1 invite accepté
    @UseGuards(JwtAuthGuard) 
    async responseAsks(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        users: UserEntity[],
        @Param('bool', ParseIntPipe) bool: number,
    ) {
        if (bool >= 0 && bool <= 1)
            return await this.UserService.handleAsk(user, id, users, bool)
        else
            throw new HttpException('Le nombre doit être 0 ou 1', HttpStatus.BAD_REQUEST); 
    }

    // logout
    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    async Delog(
        @User() user: UserEntity,
    ) {
        return await this.UserService.logout(user);
    }


}