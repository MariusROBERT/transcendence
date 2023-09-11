import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({
  cors: {
      origin: ['http://localhost:3000']
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  async handleConnection() {
    console.log("Server Chokbar co\n");
  }

  async handleDisconnect() {
    console.log("Server Chokbar deco\n");
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log("kk");
    return 'Hello world!';
  }
}
