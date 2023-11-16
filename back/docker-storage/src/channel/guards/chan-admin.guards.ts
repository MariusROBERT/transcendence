import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ChannelService } from '../channel.service';
import { UserEntity } from 'src/database/entities/channel.entity';
import { UserService } from 'src/user/user.service';

function findPerm(
  usernameToFind: string,
  list: any[],
  typesToCheck: string[],
): UserEntity | undefined {
  return list.find(
    (user) =>
      user.pseudo === usernameToFind && typesToCheck.includes(user.type),
  );
}

//      TODO: CHANGE ERROR

//      Check for admin or owner perms
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    const channel = await this.channelService.getChannelById(params.id);
    const users_of_chan = await this.userService.getUsersInChannels(channel.id);
    const has_perm = findPerm(user.pseudo, users_of_chan, ['owner', 'admin']);
    if (has_perm) return true;
    throw new BadRequestException('User is not Owner or Admin');
  }
}

//  This one check if the target is admin or owner
@Injectable()
export class TargetIsAdminGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    const params = request.params;

    const channel = await this.channelService.getChannelById(params.id);
    const users_of_chan = await this.userService.getUsersInChannels(channel.id);
    const user = await this.userService.getUserById(body.id);
    const has_perm = findPerm(user.pseudo, users_of_chan, ['owner', 'admin']);
    if (has_perm === undefined) return true;
    throw new BadRequestException('User is Admin or Owner');
  }
}

//      Check Only for owner perm
@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    const params = request.params;

    const channel = await this.channelService.getChannelById(params.id);
    const users_of_chan = await this.userService.getUsersInChannels(channel.id);
    const has_perm = findPerm(user.pseudo, users_of_chan, ['owner']);
    if (has_perm) return true;
    throw new BadRequestException('User is Owner');
  }
}
