import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server;
	controller: UserController;
	client: Socket;
	constructor(private userService: UserService) { }

	handleConnection(client: Socket, ...args: any[]) {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('connected');
		})
	}

	handleDisconnect(client: Socket) {
		
	}
	
	@SubscribeMessage('send_friend_request')
	async handleSendFriendRequest(
		@MessageBody() msg: { sender: number, receiver: number },
	) {
		const sender = await this.userService.getUserById(msg.sender);
		return await this.userService.askFriend(sender, msg.receiver);
	}

	@SubscribeMessage('accept_friend_request')
	async handleAcceptFriendRequest(
		@MessageBody() msg: { sender: number, receiver: number },
	) {
		console.log("KIKOU");

		const receiver = await this.userService.getUserById(msg.receiver);
		const sender = await this.userService.getUserById(msg.sender);
		return await this.userService.handleAsk(sender, receiver.id, true);
	}

	@SubscribeMessage('decline_friend_request')
	async handleDeclineFriendRequest(
		@MessageBody() msg: { sender: number, receiver: number },
	) {
		const receiver = await this.userService.getUserById(msg.receiver);
		const sender = await this.userService.getUserById(msg.sender);
		return await this.userService.handleAsk(sender, receiver.id, false);
	}
}
