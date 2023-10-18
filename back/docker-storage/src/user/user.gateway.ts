import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FRONT_URL } from '../utils/Globals';

@WebSocketGateway({ cors: { origin: [FRONT_URL] } })
export class UserGateway {
  @WebSocketServer() server;
  controller: UserController;

  constructor(private userService: UserService) {}

  @SubscribeMessage('send_friend_request')
  async handleSendFriendRequest(
    @MessageBody() msg: { sender: number; receiver: number },
  ) {
    const sender = await this.userService.getUserById(msg.sender);
    if (!sender) return;
    await this.userService.askFriend(sender, msg.receiver);
    this.server.to('user' + msg.receiver).emit('send_friend_request', {
      sender: msg.sender,
      receiver: msg.receiver,
    });
  }

  @SubscribeMessage('accept_friend_request')
  async handleAcceptFriendRequest(
    @MessageBody() msg: { sender: number; receiver: number },
  ) {
    const sender = await this.userService.getUserById(msg.sender);
    const receiver = await this.userService.getUserById(msg.receiver);
    if (!sender || !receiver) return;
    await this.userService.handleAsk(receiver, sender, true);
    this.server.to('user' + receiver.id).emit('accept_friend_request', {
      sender: msg.sender,
      receiver: msg.receiver,
    });
  }

  @SubscribeMessage('decline_friend_request')
  async handleDeclineFriendRequest(
    @MessageBody() msg: { sender: number; receiver: number },
  ) {
    const receiver = await this.userService.getUserById(msg.receiver);
    const sender = await this.userService.getUserById(msg.sender);
    if (!sender || !receiver) return;
    await this.userService.handleAsk(receiver, sender, false);
    this.server.to('user' + receiver.id).emit('decline_friend_request', {
      sender: msg.sender,
      receiver: msg.receiver,
    });
  }

  @SubscribeMessage('block_user')
  async blockAUser(@MessageBody() msg: { receiver: number; sender: number }) {
    const sender =  await this.userService.getUserById(msg.sender);
    const receiver = await this.userService.getUserById(msg.receiver);
    if (!sender || !receiver) return;
    await this.userService.blockAUser(sender, receiver);
    this.server.to('user' + msg.receiver).emit('block_user', { sender: msg.sender, receiver: msg.receiver });
  }

  @SubscribeMessage('unblock_user')
  async unblockAUser(@MessageBody() msg: { receiver: number; sender: number }) {
    const sender =  await this.userService.getUserById(msg.sender);
    if (!sender) return;
    await this.userService.unblockAUser(sender, msg.receiver);
  }

  @SubscribeMessage('cancel_friend_request')
  async cancelInvite(@MessageBody() msg: { sender: number; receiver: number }) {
    const sender = await this.userService.getUserById(msg.sender);
    const receiver = await this.userService.getUserById(msg.receiver);
    if (!sender || !receiver) return;
    await this.userService.cancelFriendRequest(sender, receiver);
    this.server.to('user' + msg.receiver).emit('cancel_friend_request', {
      sender: msg.sender,
      receiver: msg.receiver,
    });
  }
}
