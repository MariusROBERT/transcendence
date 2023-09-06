import { Controller, Get, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';

@Controller('channel')
export class ChannelController {
    constructor (
        private ChannelService: ChannelService
    ) {
    }

    @Get()
    @UseGuards(JwtAuthGuard) 
    async getChannel(
        @User() user: UserEntity
    ): Promise<ChannelEntity[]> {
        return await this.ChannelService.getAllChannel(user);
    }
}
