import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] }})
export class UserGateway {
    @WebSocketServer() server;
    controller: UserController;
    clients: Socket[] = [];
    constructor(private userService: UserService) {}

    @SubscribeMessage('onSendFriendRequest')
    async handleSendFriendRequest(
        @MessageBody() msg: { receiver: number, sender: number },
    ) {
        const receiver = await this.userService.getUserById(msg.receiver);
        return await this.userService.askFriend(receiver, msg.receiver);
    }

    @SubscribeMessage('accept_friend_request')
    async handleAcceptFriendRequest(
        @MessageBody() msg: { receiver: number, sender: number },
    ) {
        const receiver = await this.userService.getUserById(msg.receiver);
        return await this.userService.handleAsk(receiver, msg.sender, true);
    }

    @SubscribeMessage('decline_friend_request')
    async handleDeclineFriendRequest(
        @MessageBody() msg: { receiver: number, sender: number },
    ) {
        const receiver = await this.userService.getUserById(msg.receiver);
        return await this.userService.handleAsk(receiver, msg.sender, false);
    }
}
