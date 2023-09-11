import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { MessageEntity } from 'src/database/entities/message.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { UserService } from './user.service';
import { PublicProfileDto, UpdateUserDto } from 'src/user/dto/user.dto';

@Controller('user')
export class UserController {
    constructor (
        private UserService: UserService
    ) {}

// --------- PROFILE --------- :
// -- PRIVATE -- :

get_his_own_profile
    @Get()
    @UseGuards(JwtAuthGuard)
    async GetOwnProfile(
        @User() user: UserEntity,
    ): Promise<UserEntity> {
        return user;
    }

// update_profile 
    @Patch()
    @UseGuards(JwtAuthGuard)
    async UpdateProfileUser(
        @Body() updateUserDto: UpdateUserDto,
        @User() user: UserEntity
    ): Promise<UserEntity> {
        // si le gars modifie son username il faut refaire un jwt car le token se base sur le username donc ca sera plus le meme
        return await this.UserService.updateProfile(updateUserDto, user);
    }

// -- PUBLIC -- :

// get_all_public_user => pour le leaderboard donc seulement les infos public
    @Get('get_all_public_user')
    @UseGuards(JwtAuthGuard)
    async GetAllPublicProfile(
        @User() user: UserEntity
    ): Promise<PublicProfileDto[]> {
        return await this.UserService.getAllProfile(user)
    }

// get_public_user_by_id
    @Get('get_public_user_by_id/:id')
    @UseGuards(JwtAuthGuard)
    async GetProfileUserById(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PublicProfileDto> {
        return await this.UserService.getPublicProfileById(id, user)
    }

// --------- MSG & CHANNEL --------- :

// get_message_from_channel 
    @Get('/get_msg/:id') // id_chan
    @UseGuards(JwtAuthGuard) 
    async getMessagesByChannel(
        @User() user: UserEntity,
        @Param('id_chan', ParseIntPipe) id: number,
        channels: ChannelEntity[]
    ): Promise<MessageEntity[]> {
        return await this.UserService.getMsgsByChannel(user, channels, id)
    }

// get_channels_of_user
    @Get('get_channels/:id') // id_user
    @UseGuards(JwtAuthGuard) 
    async GetChannelsByUserId(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        channel: ChannelEntity[]
    ) {
        return await this.UserService.getChannels(user, channel)
    }

// --------- FRIENDS --------- : a tester

// ask_friend
    @Post('demand_friend/:id') // id_user du friend
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

    // @Patch('add_friend/:id') // id_user
    // @UseGuards(JwtAuthGuard) 
    // async AddFriend(
    //     @User() user: UserEntity,
    //     @Param('id', ParseIntPipe) id: number,
    // ): Promise<UserEntity> {
    //     return await this.UserService.addFriend(user, id);;
    // }

}