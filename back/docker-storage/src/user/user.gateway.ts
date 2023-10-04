import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guards";
import { UseGuards } from "@nestjs/common";

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
		await this.userService.handleAsk(receiver, sender.id, false);
		this.server.to('user' + msg.sender).emit('decline_friend_request', { sender: msg.sender, receiver: msg.receiver });
	}

	@SubscribeMessage('block_user')
	async blockAUser(
		@MessageBody() msg: { receiver: number, sender: number },
	) {
		const sender = await this.userService.getUserById(msg.sender);
		await this.userService.blockAUser(msg.receiver, sender);
		this.server.to('user' + msg.sender).emit('block_user', { sender: msg.sender, receiver: msg.receiver });
	}

	@SubscribeMessage('unblock_user')
	async unblockAUser(
		@MessageBody() msg: { receiver: number, sender: number },
	) {
		const sender = await this.userService.getUserById(msg.sender);
		const receiver = await this.userService.getUserById(msg.receiver);
		await this.userService.unblockAUser(msg.sender, receiver);
		this.server.to('user' + msg.sender).emit('unblock_user', { sender: msg.sender, receiver: msg.receiver });
	}

}
