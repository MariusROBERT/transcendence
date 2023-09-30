import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { ChannelService } from '../channel.service';
import { UserChanDto } from 'src/user/dto/user.dto';
import { ChannelEntity, UserEntity } from 'src/database/entities/channel.entity';
import { UserService } from 'src/user/user.service';

function findPerm(usernameToFind: string, list: any[], typesToCheck: string[]): UserEntity | undefined {
    return list.find((user) => user.username === usernameToFind && typesToCheck.includes(user.type));
}

//  Check For private message
@Injectable()
export class PrivateGuard implements CanActivate {
    constructor(private channelService: ChannelService,
                private readonly userService: UserService) {}
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;

        const channel: ChannelEntity = await this.channelService.getChannelById(params.id);
        if (channel.priv_msg === false)
            return true;
        else
            throw new BadRequestException("This Channel is private");
  }
}

//  Check if target user is in channel
@Injectable()
export class InChannelGuard implements CanActivate {
    constructor(private channelService: ChannelService,
                private readonly userService: UserService) {}
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body: UserChanDto = request.body;
        const params = request.params;

        const users = await this.userService.getUsersInChannels(params.id);
        const is_here = users.some(user => user.id === body.id);
        if (is_here)
            return true;
        throw new BadRequestException("User is not In Channel");
  }
}

//  Check if target user is not banned
@Injectable()
export class IsNotBannedGuard implements CanActivate {
    constructor(private channelService: ChannelService,
                private readonly userService: UserService) {}
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body: UserChanDto = request.body;
        const params = request.params;

        const users = await this.userService.getBannedInChannels(params.id);
        const is_here = users.some(user => user.id === body.id);
        if (is_here)
            throw new BadRequestException("User is banned from Channel");
        return true;
  }
}

//  Check if target user is not banned
@Injectable()
export class IsBannedGuard implements CanActivate {
    constructor(private channelService: ChannelService,
                private readonly userService: UserService) {}
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body: UserChanDto = request.body;
        const params = request.params;

        const users = await this.userService.getBannedInChannels(params.id);
        const is_here = users.some(user => user.id === body.id);
        if (is_here)
            return true;
        throw new BadRequestException("User is not banned from Channel");
  }
}

//  Check if user is banned
//  TODO: try to use only one function
@Injectable()
export class SelfBannedGuard implements CanActivate {
    constructor(private channelService: ChannelService,
                private readonly userService: UserService) {}
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body: UserChanDto = request.user;
        const params = request.params;

        const users = await this.userService.getBannedInChannels(params.id);
        const is_here = users.some(user => user.id === body.id);
        if (is_here)
            throw new BadRequestException("You are banned from this channel");
        return true;
  }
}

//  Check if user try to use command on him
@Injectable()
export class SelfCommand implements CanActivate {
    constructor(private channelService: ChannelService,
                private readonly userService: UserService) {}
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body: UserChanDto = request.body;
        const user: UserEntity = request.user;

        if (user.id === body.id)
            throw new BadRequestException("User cannot use command on himself");
        return true;
  }
}