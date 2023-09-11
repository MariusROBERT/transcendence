import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({
  cors: {
      origin: ['http://localhost:3000']
  }
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  async handleConnection() {
    console.log("Server Chokbar\n");
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
