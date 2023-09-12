import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { AddMsgDto } from 'src/messages/dto/add-msg.dto';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  clients: Socket[] = [];
  chanService: ChannelService;
  messService: MessagesService;

  async handleConnection(client: Socket) {
    this.clients.push(client);

    console.log(
      `Server co id:${client.id} | clients: ${this.clients.length}\n`,
    );
    this.server.emit('connect_ok');
  }

  async handleDisconnect(client: Socket) {
    var id = this.clients.indexOf(client);
    this.clients.splice(id);
    console.log(
      `Server deco id:${client.id} | clients: ${this.clients.length}\n`,
    );
    console.log(client.handshake);
    this.server.emit('disconnect_ok');
  }

  @SubscribeMessage('JoinChat')
  async joinChatRoom(client: Socket, room_id: number) {
    console.log(`Client:${client} join chat room id ${room_id}`);
    try {
      const chatEnt = this.chanService.getChannelById(room_id);
      //  Find a way to get UserEntity
      this.chanService.addUserInChannel(null, room_id);
      this.server.emit('joinChat');
    } catch {
      console.log('Channel does not exist');
      this.server.emit('joinNewChat');
    }
  }

  @SubscribeMessage('leaveChat')
  async leaveChatRoom(client: Socket, room_id: number) {
    console.log(`Client:${client} leave chat room id ${room_id}`);
    this.server.emit('leaveChat');
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, room_id: number, message: string) {
    var msgDto: AddMsgDto;
    msgDto.channel = await this.chanService.getChannelById(room_id);
    msgDto.content = message;
    msgDto.sender = null;

    this.messService.addMsg(msgDto, null, msgDto.channel);
    console.log(
      `Client:${client} message chat room id ${room_id} with ${message}`,
    );
    this.server.emit('message');
  }
}
