import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  async handleConnection() {
    console.log("Server co\n");
  }

  async handleDisconnect() {
    console.log("Server deco\n");
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log("kk");
    return 'Hello world!';
  }
}
