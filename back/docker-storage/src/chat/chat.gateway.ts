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
import { AddMsgDto } from 'src/messages/dto/add-msg.dto';
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

    console.log(
      `Server co id:${client.id} | clients: ${this.clients.length}\n`,
    );
    this.server.emit('connect_ok');
  }

  async handleDisconnect(client: Socket) {
    const id = this.clients.indexOf(client);
    this.clients.splice(id);
    console.log(
      `Server deco id:${client.id} | clients: ${this.clients.length}\n`,
    );
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
    const { message, user, channel } = body;
    var chanE;
    //var userE;

    //try {
    //  chanE = await this.chanService.getChannelById(channel);
    //} catch (error) {
    //  console.log(error);
    //}
    //try {
    //  userE = await this.userService.getUserById(user);
    //} catch (error) {
    //  console.log(error);
    //}

    //  Todo: Exit if error

    //console.log('===');
    //console.log(userE + ' ' + chanE);
    console.log("=======here=====");
    const token = client.handshake.query.token.toString();
    const payload = this.jwtService.verify(
      token,
      {secret: process.env.JWT_SECRET}
    );
    //  FINALY GET THE USER DATA
    console.log(payload);
    //  We should add un function that get User form username
    //const userE = await this.usersService.findOne(payload.userId);
    //this.chanService.AddMessageToChannel({"content": message, "sender": user, "channel": channel});
    this.messages.push({ msg: message, sock_id: client.id });
    //console.log(`Client:${client} message chat ${message}`);
    this.server.emit('message', this.messages[this.messages.length - 1]);
    //console.log(this.messages);
  }
}
