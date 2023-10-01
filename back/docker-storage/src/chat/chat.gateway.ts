import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { ChannelService } from 'src/channel/channel.service';
import { MessagesService } from 'src/messages/messages.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ChatCheckGuard } from './guards/chat.guards';

@Injectable()
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: ['http://localhost:3000'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chanService: ChannelService,
    private messService: MessagesService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;
  clients: Socket[] = [];
  messages: { msg: string; sock_id: string }[] = [];

  async handleConnection(client: Socket) {
    this.clients.push(client);
    this.server.emit('connect_ok');
  }

  async handleDisconnect(client: Socket) {
    const id = this.clients.indexOf(client);
    this.clients.splice(id);
    this.server.emit('disconnect_ok');
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, body: any) {
    const { channel } = body; //  channel is the room
    console.log('YOU HAVE JOINED THIS CHANNEL: ' + channel);
    client.join(channel);
  }

  @UseGuards(ChatCheckGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, body: any) {
    const { message, channel } = body;
    var chanE;
    var userE;

    if (channel < 0) {
      console.log('error chan < 0');
      return;
    }
    try {
      chanE = await this.chanService.getChannelByName(channel);
    } catch (error) {
      console.log(error);
      return;
    }
    const token = String(client.handshake.query.token);
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    userE = await this.userService.getUserByUsername(payload.username);
    this.chanService.AddMessageToChannel(message, userE, chanE);
    this.messages.push({ msg: message, sock_id: client.id });
    const data = { id: chanE.id, name: chanE.channel_name };
    this.server.to(channel).emit('message', data);
  }
}
