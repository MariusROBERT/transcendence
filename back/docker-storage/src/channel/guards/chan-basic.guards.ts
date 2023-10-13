import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ChannelService } from '../channel.service';
import { UserChanDto } from 'src/user/dto/user.dto';
import {
  ChannelEntity,
  UserEntity,
} from 'src/database/entities/channel.entity';
import { UserService } from 'src/user/user.service';
import { CreateChannelDto, PassChannelDto } from '../dto/channel.dto';
import * as bcrypt from 'bcrypt';

/*function findPerm(
  usernameToFind: string,
  list: any[],
  typesToCheck: string[],
): UserEntity | undefined {
  return list.find(
    (user) =>
      user.username === usernameToFind && typesToCheck.includes(user.type),
  );
}*/

//  Check For private message
@Injectable()
export class PrivateGuard implements CanActivate {
  constructor(private channelService: ChannelService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    const channel: ChannelEntity = await this.channelService.getChannelById(
      params.id,
    );
    if (!channel.priv_msg) return true;
    throw new BadRequestException('This Channel is private');
  }
}

//  Check if user is in channel
@Injectable()
export class SelfInChannelGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    const users = await this.userService.getUsersInChannels(params.id);
    const is_here = users.some((user) => user.id === user.id);
    if (is_here) return true;
    throw new BadRequestException('User is not In Channel');
  }
}

//  Check if target user is in channel
@Injectable()
export class InChannelGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body: UserChanDto = request.body;
    const params = request.params;

    const users = await this.userService.getUsersInChannels(params.id);
    const is_here = users.some((user) => user.id === body.id);
    if (is_here) return true;
    throw new BadRequestException('User is not In Channel');
  }
}

//  Check if target user is not banned
@Injectable()
export class IsNotBannedGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body: UserChanDto = request.body;
    const params = request.params;

    const users = await this.userService.getBannedInChannels(params.id);
    const is_here = users.some((user) => user.id === body.id);
    if (is_here) throw new BadRequestException('User is banned from Channel');
    return true;
  }
}

//  Check if target user is not banned
@Injectable()
export class IsBannedGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body: UserChanDto = request.body;
    const params = request.params;

    const users = await this.userService.getBannedInChannels(params.id);
    const is_here = users.some((user) => user.id === body.id);
    if (is_here) return true;
    throw new BadRequestException('User is not banned from Channel');
  }
}

//  Check if user is banned
//  TODO: try to use only one function
@Injectable()
export class SelfBannedGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body: UserChanDto = request.user;
    const params = request.params;

    const users = await this.userService.getBannedInChannels(params.id);
    const is_here = users.some((user) => user.id === body.id);
    if (is_here)
      throw new BadRequestException('You are banned from this channel');
    return true;
  }
}

//  Check if user try to use command on him
@Injectable()
export class SelfCommand implements CanActivate {
  constructor() {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body: UserChanDto = request.body;
    const user: UserEntity = request.user;

    if (user.id === body.id)
      throw new BadRequestException('User cannot use command on himself');
    return true;
  }
}

//  Check if channel name is valid for creation
@Injectable()
export class IsValidChannel implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body: CreateChannelDto = request.body;
    const regex = /^[a-zA-Z]+$/;

    if (body.channel_name.length > 20)
      throw new BadRequestException('Channel name is too large');
    if (!regex.test(body.channel_name))
      throw new BadRequestException(
        'Channel name should only contains [a-zA-Z]',
      );
    return true;
  }
}

//  Check if channel is protected by password
@Injectable()
export class IsProtected implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const body: PassChannelDto = request.body;
    const u: UserEntity = request.user;

    //  If user is in channel, skip password checking
    const users = await this.userService.getUsersInChannels(params.id);
    const is_here = users.some((user) => user.id === u.id);
    if (is_here) return true;
    const channel: ChannelEntity = await this.channelService.getChannelById(
      params.id,
    );
    if (channel?.password === null) return true;
    if (body.password && channel.salt)
      if (await bcrypt.compare(body?.password, channel.password)) return true;
    else
      throw new BadRequestException('No password given');
    throw new BadRequestException('This channel is protected by a password');
  }
}
