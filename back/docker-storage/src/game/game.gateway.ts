import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { GameController } from './game.controller';
import { Socket } from 'socket.io';
import { UserService } from '../user/user.service'
import { State } from './game.interfaces';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] }})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect{
  // Socket in the back side
  @WebSocketServer() server;
  // game Controller
  controller: GameController;
  // list of all the clients Sockets, the socket_id can be found in database
  clients: Socket[] = [];

  constructor(private UserService: UserService) {}

  setController(controller: GameController) {
    this.controller = controller;
  }

  // Socket Refresh ------------------------------------------------------------------------------------------------- //
  async handleConnection(client: Socket) {
    this.clients.push(client);
  }

  async handleDisconnect(client: Socket) {
    const room = 'user' + (await this.UserService.getUserFromSocketId({ socketId:client.id }));
    client.leave(room);
    this.clients = this.clients.filter(s => s !== client);
  }

  async getSocketFromUser(id: number){
    const socketId:string = await this.UserService.getSocketIdFromUser(id);
    return this.clients.find(s => s.id == socketId);
  }

  @SubscribeMessage('update_user_socket_id')
  async handleUpdateUserSocket(@MessageBody() message: {id:number, socketId:string}): Promise<void>{
    await this.UserService.setUserSocketId(message.id, message.socketId);
    this.clients.find(s => s.id == message.socketId).join('user'+ message.id);
  }

  @SubscribeMessage('reset_user_socket_id')
  async handleResetUserSocket(@MessageBody() message: {id:number}): Promise<void>{
    await this.UserService.setUserSocketId(message.id, '');
  }

  // Queue System --------------------------------------------------------------------------------------------------- //
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

  // InGame Events -------------------------------------------------------------------------------------------------- //
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
    this.server
      .to('user'+game.playerIds[0])
      .to('user'+game.playerIds[1])
      .emit('sendState',
        {
          ball: game.state.ball,
          p1: game.state.p1,
          p2: game.state.p2,
          score: game.state.score
        });
  }

  openGame(playerIds: number[]) {
    this.server.to('user'+playerIds[0]).to('user'+playerIds[1]).emit('open_game');
  }

  // Invites Management --------------------------------------------------------------------------------------------- //
  @SubscribeMessage('send_invite')
  async sendInvite(@MessageBody() msg: { sender: number, receiver: number }) {
    // Update Database
    const sender = (await this.UserService.getUserById(msg.sender));
    await this.UserService.setUserSendInvitationTo(sender, msg.receiver);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('send_invite', { sender: msg.sender, receiver: msg.receiver });
  }

  @SubscribeMessage('accept_invite')
  async acceptInvite(@MessageBody() msg: { sender: number, receiver: number }) {
    // Update Database
    const sender = (await this.UserService.getUserById(msg.sender));
    const receiver = (await this.UserService.getUserById(msg.receiver));
    await this.UserService.setUserSendInvitationTo(sender, undefined);
    await this.UserService.setUserReceivedInvitationFrom(sender, undefined);
    await this.UserService.setUserInGameStatus(sender, msg.receiver);
    await this.UserService.setUserSendInvitationTo(receiver, undefined);
    await this.UserService.setUserReceivedInvitationFrom(receiver, undefined);
    await this.UserService.setUserInGameStatus(receiver, msg.sender);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('accept_invite', { sender: msg.sender, receiver: msg.receiver });
  }

  @SubscribeMessage('decline_invite')
  async declineInvite(@MessageBody() msg: { sender: number, receiver: number }) {
    // Update Database
    const sender = (await this.UserService.getUserById(msg.sender));
    const receiver = (await this.UserService.getUserById(msg.receiver));
    await this.UserService.setUserSendInvitationTo(receiver, undefined);
    await this.UserService.setUserReceivedInvitationFrom(sender, undefined);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('decline_invite', { sender: msg.sender, receiver: msg.receiver });
  }

  @SubscribeMessage('cancel_invite')
  async cancelInvite(@MessageBody() msg: { sender: number, receiver: number }) {
    // Update Database
    const sender = (await this.UserService.getUserById(msg.sender));
    const receiver = (await this.UserService.getUserById(msg.receiver));
    await this.UserService.setUserSendInvitationTo(sender, undefined);
    await this.UserService.setUserReceivedInvitationFrom(receiver, undefined);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('cancel_invite', { sender: msg.sender, receiver: msg.receiver });
  }
}
