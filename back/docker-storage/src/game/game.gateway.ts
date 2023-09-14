import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameController, State } from './game.controller';

@WebSocketGateway(8001, {cors: '*'})
export class GameGateway {
    controller: GameController;
    setController(controller:GameController) {
        this.controller = controller;
    }

    @WebSocketServer()
    server;

    @SubscribeMessage('movePlayer')
    handleMessage(@MessageBody() message: any): void {
        console.log(message);
        this.controller.movePlayer(message as {playerId: number, moveUp: boolean})
    }

    sendState(game: { playerIds: number[]; state: State }) {
        this.server.emit('sendState', game);
    }
}
