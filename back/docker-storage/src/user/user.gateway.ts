import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Socket } from 'socket.io';
import { UserEntity } from "src/database/entities/channel.entity";
import { User } from "src/utils/decorators/user.decorator";

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] } })
export class UserGateway {
	@WebSocketServer() server;
	controller: UserController;
	constructor(private userService: UserService) { }

	@SubscribeMessage('send_friend_request')
	async handleSendFriendRequest(
		@MessageBody() msg: { sender: number, receiver: number },
	) {
		const sender = await this.userService.getUserById(msg.sender);
		await this.userService.askFriend(sender, msg.receiver);
		this.server.to('user' + msg.receiver).emit('send_friend_request', { sender: msg.sender, receiver: msg.receiver });
	}

	@SubscribeMessage('accept_friend_request')
	async handleAcceptFriendRequest(
		@MessageBody() msg: { sender: number, receiver: number },
	) {
		const sender = await this.userService.getUserById(msg.sender);
		const receiver = await this.userService.getUserById(msg.receiver);
		await this.userService.handleAsk(receiver, sender.id, true);
		this.server.to('user' + msg.sender).emit('accept_friend_request', { sender: msg.sender, receiver: msg.receiver });
	}

	@SubscribeMessage('decline_friend_request')
	async handleDeclineFriendRequest(
		@MessageBody() msg: { sender: number, receiver: number },
	) {
		const receiver = await this.userService.getUserById(msg.receiver);
		const sender = await this.userService.getUserById(msg.sender);
		return await this.userService.handleAsk(receiver, sender.id, false);
	}

	@SubscribeMessage('block_user')
	async blockAUser(
		@MessageBody() msg: { to: number, from: number },
	) {
		console.log("GATEWAY BLOCK USER");
		console.log("TO : ", msg.to);

		const sender = await this.userService.getUserById(msg.from);
		return await this.userService.blockAUser(msg.to, sender);
	}
	
}
