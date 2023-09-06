import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { MessageEntity } from 'src/database/entities/message.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor (
        private UserService: UserService
    ) {
    }

    // get img

    // post img

    // change 2fa active

    // change pwd

    // change pseudo


    @Get('/msg/:id_chan')
    @UseGuards(JwtAuthGuard) 
    async getMessage(
        @User() user: UserEntity,
        @Param('id_chan', ParseIntPipe) id: number,
        channel: ChannelEntity[]
    ): Promise<MessageEntity[]> {
        return await this.UserService.getMsgByChannel(user, channel, id)
    }

    // async is_in_channel(user: UserEntity) {
    //     // for ()
    // }

    // @Get('channels') // peut etre que les nom ou status
    // @UseGuards(JwtAuthGuard)
    // async get_channel(user: UserEntity)  { // get param = user: UserEntity
    //     const userChannels = new Set();
    //     // for (all channel)
    //     //      if (this.is_in_channel(channel, user))
    //     //          mySet.add(channel);
    //     return mySet;
    // }
}