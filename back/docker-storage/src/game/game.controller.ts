import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {GameService} from "./game.service";
import { GameGateway } from './game.gateway';
export const delay = (ms: number | undefined) => new Promise(res => ms ? setTimeout(res, ms) : setTimeout(res, 0));
export const clamp = (val, valmin, valmax) => Math.min(Math.max(val, valmin), valmax);

export interface State{
    running: boolean,
    isSpecial: boolean,
    ball: {x: number, y: number},
    speed: number,
    dir: {x: number, y: number},
    p1: {x: number, y: number},
    p2: {x: number, y: number},
    score: {p1: number, p2: number}
}

const size:{
    height:number,
    width:number,
    ball:number,
    bar:{x: number, y: number},
    halfBar:number,
    halfBall:number
} = {
    height:720,
    width:1280,
    ball:50,
    bar:{x: 25, y: 144},
    halfBar:72,
    halfBall:25
};

@Controller('game')
export class GameController {
    games: {playerIds:number[], state:State, ready:boolean}[] = [];
    queue: number[] = [];
    queueSpecial: number[] = [];

    constructor(private gameService: GameService, private gameGateway: GameGateway) {
        this.gameGateway.setController(this);
    }
    //returns a Game with 1 given or the 2 given player
    getGame(p1:number, p2:number | undefined = null){
        if (p2 == null)
            return this.games.find(g => g.playerIds[0] == p1 || g.playerIds[1] == p1);
        return this.games.find(g =>
            (g.playerIds[0] == p1 && g.playerIds[1] == p2)
            || (g.playerIds[0] == p2 && g.playerIds[1] == p1))
    }

    @Patch('join/special/:id')
    joinSpecial(@Param('id') id: number){
        this.queueSpecial.push(id);
        this.tryLaunchGames(this.queueSpecial, true);
    }

    @Patch('join/:id')
    join(@Param('id') id: number){
        this.queue.push(id);
        this.tryLaunchGames(this.queue, false);
    }

    @Patch('quit/queue:id')
    quitQueue(@Param('id') id: number){
        this.queue = this.queue.filter(i => i != id);
    }

    @Patch('quit/queue/special:id')
    quitSpecialQueue(@Param('id') id: number){
        this.queueSpecial = this.queueSpecial.filter(i => i != id);
    }

    @Patch('quit/game:id')
    async quitGame(@Param('id') id: number){
        const game = this.getGame(id);
        if (!game) return;
        const playerNumber = game.playerIds.indexOf(id);
        if (playerNumber === 0)
            game.state.score.p1 = 0;
        else
            game.state.score.p2 = 0;
        return this.ends(id);
    }

    // add a new game in the games lists
    async createGame(p1: number, p2:number, isSpecial){
        //check if the two players are free and stops there games
        let game = this.getGame(p1, p2);
        if (game !== undefined) {
            await this.ends(p1);
            await this.ends(p2);
        }
        game = {
            playerIds: [p1, p2],
            state: {
                running: true,
                isSpecial: isSpecial,
                ball: {x:size.width / 2, y:size.height / 2},
                dir: this.gameService.normalize({x:Math.random() * 2 - 1, y:Math.random() * 2 - 1}),
                p1: {x:size.ball / 2, y:size.height / 2},
                p2: {x:size.width - size.ball / 2, y:size.height / 2},
                score: {p1: 0, p2: 0},
                speed: 5,
            },
            ready:false
        };
        this.games.push(game);
    }

    // try launch games as long as there is more than 2 players in the queue
    tryLaunchGames(queue: number[], isSpecial: boolean){
        while (queue.length >= 2){
            queue = queue.filter(id => this.getGame(id) === undefined);
            this.createGame(queue[0], queue[1], isSpecial);
            queue.slice(2);
        }
    }

    //Called from each player before starting
    @Patch('start/:id')
    async starts(@Param('id') id: number){
        //check if the two players are free and stops there games
        let game = this.getGame(id);
        if (game === undefined) return;

        //first call set ready to true and second start the update function
        if (!game.ready)
            game.ready = true;
        else
            this.update(game);
    }

    //called at the start of the game and then every frame till the game ends
    async update(game: {playerIds:number[], state:State, ready:boolean}){
        //check for the end game conditions
        if (game.state.score.p1 >= 10 || game.state.score.p2 >= 10 || !game.state.running) {
            return this.ends(game.playerIds[0]);
        }
        //call the logic in async function
        this.updateLogic(game.state);

        //await for a 30hz frame
        await delay(33);

        //send the new state to the gateway
        this.gameGateway.sendState(game);

        //and call itself again
        return this.update(game);
    }

    // called every frame to update the state of the game
    async updateLogic(game: State) {
        //move the ball to the current direction
        game.ball = this.gameService.add(game.ball, (this.gameService.scale(game.dir, game.speed)));

        //check if the ball enter a 'GOAL'
        if (game.ball.x < 0 || game.ball.x > size.width)
        {
            // Update Score
            if (game.ball.x < 0)
                game.score.p2 += 1;
            if (game.ball.x > size.width)
                game.score.p1 += 1;

            // Start the new Round
            game.ball = {x:size.width/2, y:size.height/2};
            game.dir.x *= -1;
            game.speed = Math.max(game.speed - 5, 2.5);
        }

        //manage the 'physics' of the game
        else
            this.bounce(game);

        //increase progressively the speed
        game.speed = Math.min(game.speed + 0.008, 30)
    }

    //manage the 'physics' of the game
    bounce(game:State)
    {
        //up and down collision
        if (game.ball.y > size.height - size.halfBall || game.ball.y < size.halfBall)
            game.dir.y *= -1

        //collision with the left player
        if ((game.ball.x - size.ball / 2) < (game.p1.x)
            && (game.ball.y - size.halfBall) < (game.p1.y + size.halfBar)
            && (game.ball.y + size.halfBall) > (game.p1.y - size.halfBar))
            game.dir = {x:game.ball.x - (game.p1.x - size.ball), y: game.ball.y - game.p1.y}

        //collision with the right player
        if (game.ball.x + size.halfBall > game.p2.x
            && game.ball.y - size.halfBall < game.p2.y + size.halfBar
            && game.ball.y + size.halfBall > game.p2.y - size.halfBar)
            game.dir = {x: game.ball.x - (game.p2.x + size.ball), y: game.ball.y - game.p2.y}
    }

    @Get('ends/:id')
    async ends(@Param('id') p1: number){
        //find game
        let game = this.getGame(p1);
        if (game === undefined || !game.state.running)
            return 'game not found';

        //stop the game
        game.state.running = false;

        //wait 1 frame
        await delay(35);

        //TODO: Save game score and update dataBase here

        // delete the game from games
        this.games = this.games.filter(g => g.playerIds[0] != p1 || g.playerIds[1] != p1);

        // dev msg
        return 'game end';

        //TODO: Send front event to show the GameOverPanel
    }

    //TODO: socketCall
    movePlayer({playerId, moveUp} : {playerId:number, moveUp:boolean})
    {
        let game = this.getGame(playerId);
        if (game === undefined || !game.state.running) return;
        if (game.playerIds[0] == playerId) {
            game.state.p1.y += moveUp ? -game.state.speed : game.state.speed;
            game.state.p1.y = clamp(game.state.p1.y, size.ball * 1.5 + size.halfBar, size.height - size.ball * 1.5 - size.halfBar);
        }
        else if (game.playerIds[1] == playerId) {
            game.state.p2.y += moveUp ? -game.state.speed : game.state.speed;
            game.state.p2.y = clamp(game.state.p2.y, size.ball * 1.5 + size.halfBar, size.height - size.ball * 1.5 - size.halfBar);
        }
    }
}
