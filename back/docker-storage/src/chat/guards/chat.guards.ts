import { Injectable, CanActivate, ExecutionContext, BadGatewayException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class ChatCheckGuard implements CanActivate {
    constructor(private userService: UserService,
                private jwtService: JwtService,
                private channelService: ChannelService) {}
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
    const is_here = users.some(user => user.id === userE.id);
    if (is_here)
        return true;
    throw new Error("You cannot write here");
  }
}