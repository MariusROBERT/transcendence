import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ChannelService } from 'src/channel/channel.service';
import { MessagesService } from 'src/messages/messages.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

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
    private jwtService: JwtService
  ) {}

  @WebSocketServer()
  server: Server;
  clients: Socket[] = [];
  messages: { msg: string; sock_id: string }[] = [];

  async handleConnection(client: Socket) {
    this.clients.push(client);

    // console.log(
    //   `Server co id:${client.id} | clients: ${this.clients.length}\n`,
    // );
    this.server.emit('connect_ok');
  }

  async handleDisconnect(client: Socket) {
    const id = this.clients.indexOf(client);
    this.clients.splice(id);
    // console.log(
    //   `Server deco id:${client.id} | clients: ${this.clients.length}\n`,
    // );
    //console.log(client.handshake);
    this.server.emit('disconnect_ok');
  }

  //  @SubscribeMessage('JoinChat')
  //  async joinChatRoom(client: Socket, room_id: number) {
  //    console.log(`Client:${client} join chat room id ${room_id}`);
  //    try {
  //      const chatEnt = this.chanService.getChannelById(room_id);
  //      //  Find a way to get UserEntity
  //      this.chanService.addUserInChannel(null, room_id);
  //      this.server.emit('joinChat');
  //    } catch {
  //      console.log('Channel does not exist');
  //      this.server.emit('joinNewChat');
  //    }
  //  }
  //
  //  @SubscribeMessage('leaveChat')
  //  async leaveChatRoom(client: Socket, room_id: number) {
  //    console.log(`Client:${client} leave chat room id ${room_id}`);
  //    this.server.emit('leaveChat');
  //  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, body: any) {
    const { message, channel } = body;
    var chanE;
    var userE;

    if (channel < 0) {
      console.log("error chan < 0");
      return ;
    }
    try {
      chanE = await this.chanService.getChannelByName(channel);
    } catch (error) {
      console.log(error);
      return ;
    }
    const token = String(client.handshake.query.token);
    const payload = this.jwtService.verify(
      token,
      {secret: process.env.JWT_SECRET}
    );
    userE = await this.userService.getUserByUsername(payload.username);
    this.chanService.AddMessageToChannel(message, userE, chanE);
    this.messages.push({ msg: message, sock_id: client.id });
    const data = {id: chanE.id, name: chanE.channel_name}
    this.server.emit('message', data);
  }
}
