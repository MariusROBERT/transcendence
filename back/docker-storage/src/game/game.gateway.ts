import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameController } from './game.controller';
import { Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { State } from './game.interfaces';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UseGuards } from "@nestjs/common";

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
  async handleUpdateUserSocket(
    @MessageBody() message: { id: number; socketId: string },
  ): Promise<void> {
    await this.UserService.setUserSocketId(message.id, message.socketId);
    this.clients.find(s => s.id == message.socketId)?.join('user'+ message.id);
  }

  @SubscribeMessage('reset_user_socket_id')
  @UseGuards(JwtAuthGuard)
  async handleResetUserSocket(
    @MessageBody() message: { id: number },
  ): Promise<void> {
    await this.UserService.setUserSocketId(message.id, '');
  }

  // Invites Management --------------------------------------------------------------------------------------------- //
  @SubscribeMessage('send_invite')
  @UseGuards(JwtAuthGuard)
  async sendInvite(@MessageBody() msg: { sender: number, receiver: number, gameType: 'normal' | 'special' }) {
    // console.log('send_invite', msg);

    // Update Database
    const sender = (await this.UserService.getUserById(msg.sender));
    await this.UserService.setUserSendInvitationTo(sender, msg.receiver);
    await this.UserService.setUserInvitationType(sender, msg.gameType);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('send_invite', { sender: msg.sender, receiver: msg.receiver, gameType: msg.gameType });
  }

  @SubscribeMessage('accept_invite')
  @UseGuards(JwtAuthGuard)
  async acceptInvite(@MessageBody() msg: { sender: number, receiver: number, gameType: 'normal' | 'special' }) {
    // console.log('accept_invite', msg);
    // Update Database
    //TODO: group the call to call only 1 time save
    const sender = (await this.UserService.getUserById(msg.sender));
    await this.UserService.setUserSendInvitationTo(sender, undefined);
    await this.UserService.setUserReceivedInvitationFrom(sender, undefined);
    await this.UserService.setUserInvitationType(sender, 'none');
    await this.UserService.setUserInGameStatus(sender, undefined);

    const receiver = (await this.UserService.getUserById(msg.receiver));
    await this.UserService.setUserSendInvitationTo(receiver, undefined);
    await this.UserService.setUserReceivedInvitationFrom(receiver, undefined);
    await this.UserService.setUserInvitationType(receiver, 'none');
    await this.UserService.setUserInGameStatus(receiver, undefined);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('accept_invite', { sender: msg.sender, receiver: msg.receiver });

    if (!this.controller.matchmaking.getGame(msg.sender, msg.receiver))
      await this.controller.matchmaking.createGame(msg.sender, msg.receiver, msg.gameType === 'special');
  }

  @SubscribeMessage('decline_invite')
  @UseGuards(JwtAuthGuard)
  async declineInvite(@MessageBody() msg: { sender: number, receiver: number }) {
    // console.log('decline_invite', msg);
    // Update Database
    const sender = (await this.UserService.getUserById(msg.sender));
    const receiver = (await this.UserService.getUserById(msg.receiver));
    await this.UserService.setUserSendInvitationTo(receiver, undefined);
    await this.UserService.setUserReceivedInvitationFrom(sender, undefined);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('decline_invite', { sender: msg.sender, receiver: msg.receiver });
  }

  @SubscribeMessage('cancel_invite')
  @UseGuards(JwtAuthGuard)
  async cancelInvite(@MessageBody() msg: { sender: number, receiver: number }) {
    // console.log('cancel_invite', msg);
    // Update Database
    const sender = (await this.UserService.getUserById(msg.sender));
    const receiver = (await this.UserService.getUserById(msg.receiver));
    await this.UserService.setUserSendInvitationTo(sender, undefined);
    await this.UserService.setUserReceivedInvitationFrom(receiver, undefined);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('cancel_invite', { sender: msg.sender, receiver: msg.receiver });
  }

  // Queue Management ----------------------------------------------------------------------------------------------- //
  @SubscribeMessage('join_queue')
  @UseGuards(JwtAuthGuard)
  async joinQueue(@MessageBody() msg: { sender: number, gameType: 'normal' | 'special' }) {
    // console.log('join_queue', msg);
    if (msg.gameType === 'normal')
      return this.controller.matchmaking.joinQueue(msg.sender, false);
    if (msg.gameType === 'special')
      return this.controller.matchmaking.joinQueue(msg.sender, true);
  }

  @SubscribeMessage('leave_queue')
  @UseGuards(JwtAuthGuard)
  leaveQueue(@MessageBody() msg: { sender: number }) {
    // console.log('leave_queue', msg);
    this.controller.queue = this.controller.queue.filter(id => id != msg.sender);
    this.controller.queueSpecial = this.controller.queueSpecial.filter(id => id != msg.sender);

    // console.log('after leave: \nSpecial  ', this.controller.queueSpecial, '\nNormal  ', this.controller.queue);
  }

  // Game Start / End Management ------------------------------------------------------------------------------------ //
  openGame(playerIds: number[]) {
    this.server.to('user'+playerIds[0]).to('user'+playerIds[1]).emit('open_game', { p1: playerIds[0], p2: playerIds[1] });
  }

  async endGame(playerIds: number[]) {
    for (let i = 0; i < 2; i++) {
      const user = await this.UserService.getUserById(playerIds[i]);
      await this.UserService.setUserInGameStatus(user, undefined);
    }
    this.server.to('user' + playerIds[0]).to('user' + playerIds[1]).emit('end_game');
  }

  @SubscribeMessage('start_game')
  @UseGuards(JwtAuthGuard)
  async starts(@MessageBody() msg: { id: number }) {
    // console.log('start_game', msg);
    const user = await this.UserService.getUserById(msg.id);
    const otherId = this.controller.matchmaking.getGame(msg.id)?.playerIds.find(i => i !== msg.id);
    await this.UserService.setUserInGameStatus(user, otherId);
    return this.controller.matchmaking.startGame(msg.id);
  }

  @SubscribeMessage('leave_game')
  @UseGuards(JwtAuthGuard)
  async quitGame(@MessageBody() msg: { sender: number }) {
    // console.log('leave_game', msg);
    return this.controller.matchmaking.leaveGame(msg.sender);
  }

  // InGame Events -------------------------------------------------------------------------------------------------- //
  @SubscribeMessage('move_player')
  @UseGuards(JwtAuthGuard)
  movePlayer(
    @MessageBody() msg: { id: number; isMoving: boolean; moveUp: boolean },
  ) {
    let game = this.controller.matchmaking.getGame(msg.id);
    if (game === undefined || !game.state.running) return;
    return this.controller.service.movePlayer(
      game.state,
      game.playerIds.indexOf(msg.id),
      msg.isMoving,
      msg.moveUp,
    );
  }

  sendState(game: { playerIds: number[], state: State, ready:number[] }) {
    this.server
      .to('user'+game.playerIds[0])
      .to('user'+game.playerIds[1])
      .emit('update_game_state',
        {
          ball: game.state.ball,
          p1: game.state.p1,
          p2: game.state.p2,
          score: game.state.score
        });
  }

}
