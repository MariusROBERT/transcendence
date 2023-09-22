import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { GameController } from './game.controller';
import { Socket } from 'socket.io';
import { UserService } from '../user/user.service'
import { State } from './game.interfaces';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] }})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect{
  // Socket in the back side
  @WebSocketServer() server;

  controller: GameController;

  // list of all the clients Sockets, the socket_id can be found in database
  clients: Socket[] = [];

  constructor(
    private UserService: UserService
  ) {}

  setController(controller: GameController) {
    this.controller = controller;
  }

  async handleConnection(client: Socket) {
    this.clients.push(client);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.UserService.getUserFromSocketId({ socketId: client.id })
    console.log('DISCONNECTION: socket: ', client.id, ' username: ', user?.username, ' index: ', this.clients.indexOf(client));
    this.clients = this.clients.filter(s => s !== client);
  }

  @SubscribeMessage('update_user_socket_id')
  async handleUpdateUserSocket(@MessageBody() message: {id:number, socketId:string}): Promise<void>{
    await this.UserService.setUserSocketId(message.id, message.socketId);

    const user = await this.UserService.getUserFromSocketId({ socketId: message.socketId })
    console.log('CONNECTION: socket: ', message.socketId, ' username: ', user?.username, ' index: ', this.clients.indexOf(this.clients.find(s => s.id == message.socketId)), ' total_clients: ', this.clients.length);
  }

  @SubscribeMessage('reset_user_socket_id')
  async handleResetUserSocket(@MessageBody() message: {id:number}): Promise<void>{
    await this.UserService.setUserSocketId(message.id, '');
  }

  @SubscribeMessage('join_queue')
  async joinQueue(@MessageBody() msg: { id: number }) {
    return this.controller.matchmaking.joinQueue(this.controller.queue, msg.id);
  }

  @SubscribeMessage('join_queue_special')
  async joinQueueSpecial(@MessageBody() msg: { id: number }) {
    return this.controller.matchmaking.joinQueue(this.controller.queueSpecial, msg.id, true);
  }

  @SubscribeMessage('quit_queue')
  quitQueue(@MessageBody() msg: { id: number }) {
    this.controller.queue = this.controller.queue.filter(i => i != msg.id);
  }

  @SubscribeMessage('quit_queue_special')
  quitQueueSpecial(@MessageBody() msg: { id: number }) {
    this.controller.queueSpecial = this.controller.queueSpecial.filter(i => i != msg.id);
  }

  @SubscribeMessage('quit_game')
  async quitGame(@MessageBody() msg: { id: number }) {
    return this.controller.matchmaking.quitGame(msg.id);
  }

  @SubscribeMessage('start_game')
  async starts(@MessageBody() msg: { id: number }) {
    return this.controller.matchmaking.startGame(msg.id);
  }

  @SubscribeMessage('move_player')
  movePlayer(@MessageBody() msg: { id: number, isMoving: boolean, moveUp: boolean }) {
    let game = this.controller.matchmaking.getGame(msg.id);
    if (game === undefined || !game.state.running) return;
    return this.controller.service.movePlayer(game.state, game.playerIds.indexOf(msg.id), msg.isMoving, msg.moveUp)
  }

  sendState(game: { playerIds: number[], state: State, ready:boolean }) {
    this.server.emit('sendState', game);
  }

  async getSocketFromUser(id: number){
    const socketId:string = await this.UserService.getSocketIdFromUser(id);
    return this.clients.find(s => s.id == socketId);
  }

  async createRoom(p1: number, p2: number): Promise<string | undefined> {
    const socketP1:Socket = await this.getSocketFromUser(p1);
    const socketP2:Socket = await this.getSocketFromUser(p2);
    if (socketP1 === undefined || socketP2 === undefined)
      return undefined;
    const room_name = 'room' + p1 + 'vs' + p2;
    socketP1.join(room_name);
    socketP2.join(room_name);
    return room_name;
  }

  openGame(room: string) {
    this.server.to(room).emit('open_game');
  }
}
