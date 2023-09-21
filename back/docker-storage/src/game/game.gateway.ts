import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { GameController, State } from './game.controller';
import { Socket } from 'socket.io';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';

@WebSocketGateway(8001, { cors: '*' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect{
  // Socket in the back side
  @WebSocketServer() server;

  controller: GameController;

  // list of all the clients Sockets, the socket_id can be found in database
  clients: Socket[] = [];

  setController(controller: GameController) {
    this.controller = controller;
  }

  async handleConnection(client: Socket) {
    this.clients.push(client);
    console.log('client CONNECTION: ', client.id);
  }

  async handleDisconnect(client: Socket) {
    this.clients = this.clients.filter(s => s !== client);
    console.log('client DISCONNECTION: ', client.id);
  }

  @SubscribeMessage('movePlayer')
  handleMessage(@MessageBody() message: any): void {
    console.log(message);
    this.controller.movePlayer(message as {playerId: number, moveUp: boolean})
  }

  sendState(game: { playerIds: number[], state: State, ready:boolean }) {
    this.server.emit('sendState', game);
  }
}
