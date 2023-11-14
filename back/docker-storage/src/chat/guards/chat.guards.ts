import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ChannelService } from 'src/channel/channel.service';
import { MutedService } from 'src/muted/muted.service';

@Injectable()
export class ChatCheckGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private muteService: MutedService,
    private channelService: ChannelService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Mettez en œuvre votre logique pour vérifier si l'utilisateur est banni
    const client = context.switchToWs().getClient();
    const data = context.switchToWs().getData();

    const token = String(client.handshake.query.token);
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const userE = await this.userService.getUserByUsername(payload.username);
    const chanE = await this.channelService.getChannelByName(data.channel);
    const users = await this.userService.getUsersInChannels(chanE.id);
    const is_here = users.some((user) => user.id === userE.id);
    if (is_here) {
      if (
        (await this.muteService.getMutedInChannel(chanE.id, userE.id))
          ?.endDate > new Date()
      )
        // throw new Error('You are muted');
        return;
      return true;
    }
    // throw new Error('You are not in channel');
    return ;
  }
}

@Injectable()
export class BlockGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToWs().getData();
    const channel = await this.channelService.getChannelByName(data.channel);
    if (!channel.priv_msg) return true;
    const users = await this.userService.getFullUsersInChannels(channel.id);
    if (users.at(0)?.blocked.includes(users.at(1).id))
      return false;
      //throw new Error('Blocked by ' + users.at(0).username);
    if (users.at(1)?.blocked.includes(users.at(0).id))
      return false;
      //throw new Error('Blocked by ' + users.at(1).username);
    return true;
  }
}
