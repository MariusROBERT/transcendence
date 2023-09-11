import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io-client';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  clients: Socket[] = [];

  async handleConnection(client: Socket) {
    this.clients.push(client);

    console.log(`Server co id:${client.id} | clients: ${this.clients.length}\n`);
    this.server.emit('connect_ok');
  }

  async handleDisconnect(client: Socket) {
    var id = this.clients.indexOf(client);
    this.clients.splice(id);
    console.log(`Server deco id:${client.id} | clients: ${this.clients.length}\n`);
    this.server.emit('disconnect_ok');
  }

  @SubscribeMessage('JoinChat')
  async joinChatRoom(client: Socket, room_id: number) {
    console.log(`Client:${client} join chat room id ${room_id}`);
    this.server.emit('joinChat');
  }

  @SubscribeMessage('leaveChat')
  async leaveChatRoom(client: Socket, room_id: number) {
    console.log(`Client:${client} leave chat room id ${room_id}`);
    this.server.emit('leaveChat');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, room_id: number, message: string) {
    console.log(
      `Client:${client} message chat room id ${room_id} with ${message}`,
    );
    this.server.emit('message');
  }
}
