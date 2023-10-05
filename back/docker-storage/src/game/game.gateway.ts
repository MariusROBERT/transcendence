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
import { delay, State } from './game.interfaces';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // Socket in the back side
  @WebSocketServer() server;
  // game Controller
  controller: GameController;
  // list of clients connected
  clients: { id: number, sockets: Socket[] }[] = [];
  // list of sockets waiting for a user id
  sockets: Socket[] = [];

  constructor(private userService: UserService) {
  }

  setController(controller: GameController) {
    this.controller = controller;
  }

  // Connection / Disconnection ------------------------------------------------------------------------------------- //
  async handleConnection(userSocket: Socket) {
    this.sockets.push(userSocket);
  }

  @SubscribeMessage('update_user_socket_id')
  async handleUpdateUserSocket(
    @MessageBody() message: { id: number; socketId: string },
  ): Promise<void> {
    const socket = this.sockets.find(s => s.id === message.socketId);
    const client = this.clients.find(c => c.id === message.id);

    if (!client) {
      this.clients.push({ id: message.id, sockets: [socket] });
      await this.connect(message.id);
    }
    else
      client.sockets.push(socket);

    socket.join('user' + message.id);
    this.sockets = this.sockets.filter(s => s !== socket);
  }

  async handleDisconnect(userSocket: Socket) {
    const client = this.clients.find(c => c.sockets.includes(userSocket));
    userSocket.leave('user' + client.id);

    client.sockets = client.sockets.filter(s => s !== userSocket);
    if (client.sockets.length === 0) {
      this.clients = this.clients.filter(c => c !== client);
      await this.disconnect(client.id);
    }
  }

  async connect(clientId: number){
    const user = await this.userService.getUserById(clientId);
    if (!user)
      console.error('connect: no such User');
    await this.userService.login(user);
    this.server.emit('user_connection', clientId);
  }

  async disconnect(clientId: number){
    await delay(2000);
    if (this.clients.find(c => c.id === clientId))
      return; // the client reconnect in the 2 seconds.


    const user = await this.userService.getUserById(clientId);
    if (!user)
      console.error('disconnect: no such User');
    await this.userService.logout(user);
    this.server.emit('user_disconnection', clientId);
  }

  // Invites Management --------------------------------------------------------------------------------------------- //
  @SubscribeMessage('send_invite')
  async sendInvite(@MessageBody() msg: { sender: number, receiver: number, gameType: 'normal' | 'special' }) {
    // Update Database
    const sender = (await this.userService.getUserById(msg.sender));
    await this.userService.setUserSendInvitationTo(sender, msg.receiver);
    await this.userService.setUserInvitationType(sender, msg.gameType);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('send_invite', {
      sender: msg.sender,
      receiver: msg.receiver,
      gameType: msg.gameType,
    });
  }

  @SubscribeMessage('accept_invite')
  async acceptInvite(@MessageBody() msg: { sender: number, receiver: number, gameType: 'normal' | 'special' }) {
    // Update Database
    //TODO: group the call to call only 1 time save
    const sender = (await this.userService.getUserById(msg.sender));
    await this.userService.setUserSendInvitationTo(sender, undefined);
    await this.userService.setUserReceivedInvitationFrom(sender, undefined);
    await this.userService.setUserInvitationType(sender, 'none');
    await this.userService.setUserInGameStatus(sender, undefined);

    const receiver = (await this.userService.getUserById(msg.receiver));
    await this.userService.setUserSendInvitationTo(receiver, undefined);
    await this.userService.setUserReceivedInvitationFrom(receiver, undefined);
    await this.userService.setUserInvitationType(receiver, 'none');
    await this.userService.setUserInGameStatus(receiver, undefined);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('accept_invite', { sender: msg.sender, receiver: msg.receiver });

    if (!this.controller.matchmaking.getGame(msg.sender, msg.receiver))
      await this.controller.matchmaking.createGame(msg.sender, msg.receiver, msg.gameType === 'special');
  }

  @SubscribeMessage('decline_invite')
  async declineInvite(@MessageBody() msg: { sender: number, receiver: number }) {
    // Update Database
    const sender = (await this.userService.getUserById(msg.sender));
    const receiver = (await this.userService.getUserById(msg.receiver));
    await this.userService.setUserSendInvitationTo(receiver, undefined);
    await this.userService.setUserReceivedInvitationFrom(sender, undefined);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('decline_invite', { sender: msg.sender, receiver: msg.receiver });
  }

  @SubscribeMessage('cancel_invite')
  async cancelInvite(@MessageBody() msg: { sender: number, receiver: number }) {
    // Update Database
    const sender = (await this.userService.getUserById(msg.sender));
    const receiver = (await this.userService.getUserById(msg.receiver));
    await this.userService.setUserSendInvitationTo(sender, undefined);
    await this.userService.setUserReceivedInvitationFrom(receiver, undefined);

    // Transfer the message
    this.server.to('user' + msg.receiver).emit('cancel_invite', { sender: msg.sender, receiver: msg.receiver });
  }

  // Queue Management ----------------------------------------------------------------------------------------------- //
  @SubscribeMessage('join_queue')
  async joinQueue(@MessageBody() msg: { sender: number, gameType: 'normal' | 'special' }) {
    if (msg.gameType === 'normal')
      return this.controller.matchmaking.joinQueue(msg.sender, false);
    if (msg.gameType === 'special')
      return this.controller.matchmaking.joinQueue(msg.sender, true);
  }

  @SubscribeMessage('leave_queue')
  leaveQueue(@MessageBody() msg: { sender: number }) {
    this.controller.queue = this.controller.queue.filter(id => id != msg.sender);
    this.controller.queueSpecial = this.controller.queueSpecial.filter(id => id != msg.sender);
  }

  // Game Start / End Management ------------------------------------------------------------------------------------ //
  openGame(playerIds: number[]) {
    this.server.to('user' + playerIds[0]).to('user' + playerIds[1]).emit('open_game', {
      p1: playerIds[0],
      p2: playerIds[1],
    });
  }

  async endGame(playerIds: number[]) {
    for (let i = 0; i < 2; i++) {
      const user = await this.userService.getUserById(playerIds[i]);
      await this.userService.setUserInGameStatus(user, undefined);
    }
    this.server.to('user' + playerIds[0]).to('user' + playerIds[1]).emit('end_game');
  }

  @SubscribeMessage('start_game')
  async starts(@MessageBody() msg: { id: number }) {
    const user = await this.userService.getUserById(msg.id);
    const otherId = this.controller.matchmaking.getGame(msg.id)?.playerIds.find(i => i !== msg.id);
    await this.userService.setUserInGameStatus(user, otherId);
    return this.controller.matchmaking.startGame(msg.id);
  }

  @SubscribeMessage('leave_game')
  async quitGame(@MessageBody() msg: { sender: number }) {
    return this.controller.matchmaking.leaveGame(msg.sender);
  }

  // InGame Events -------------------------------------------------------------------------------------------------- //
  @SubscribeMessage('move_player')
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

  sendState(game: { playerIds: number[], state: State, ready: number[] }) {
    this.server
      .to('user' + game.playerIds[0])
      .to('user' + game.playerIds[1])
      .emit('update_game_state',
        {
          ball: game.state.ball,
          p1: game.state.p1,
          p2: game.state.p2,
          score: game.state.score,
        });
  }

}
