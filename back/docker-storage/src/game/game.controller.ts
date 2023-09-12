import {Controller, Get, Param, Post} from '@nestjs/common';
import {GameService} from "./game.service";
export const delay = (ms: number | undefined) => new Promise(res => ms ? setTimeout(res, ms) : setTimeout(res, 0));
export const clamp = (val, valmin, valmax) => Math.min(Math.max(val, valmin), valmax);
export class Vector2D {
    x: number;
    y: number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    static scale(vect: Vector2D, factor: number){
        return new Vector2D(vect.x * factor, vect.y * factor);
    }
    scale(a: number): Vector2D {
        this.x *= a;
        this.y *= a;
        return this;
    }

    add(vect:Vector2D): Vector2D{
        this.x += vect.x;
        this.y += vect.y;
        return this;
    }

    normalized(): Vector2D {
        const len = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x /= len;
        this.y /= len;
        return this;
    }
}

export interface State{
    running: boolean,
    ball: Vector2D,
    speed: number,
    dir: Vector2D,
    p1: Vector2D,
    p2: Vector2D,
    score: {p1: number, p2: number}
}

const size:{
    height:number,
    width:number,
    ball:number,
    bar:Vector2D,
    halfBar:number,
    halfBall:number
} = {
    height:720,
    width:1280,
    ball:50,
    bar:new Vector2D(25, 144),
    halfBar:72,
    halfBall:25
};
@Controller('game')
export class GameController {
    games: {playerIds:number[], state:State}[] = [];
    constructor(private gameService: GameService) {}

    //returns a Game with 1 given or the 2 given player
    getGame(p1:number, p2:number | undefined = null){
        if (p2 == null)
            return this.games.find(g => g.playerIds[0] == p1 || g.playerIds[1] == p1);
        return this.games.find(g =>
            (g.playerIds[0] == p1 && g.playerIds[1] == p2)
            || (g.playerIds[0] == p2 && g.playerIds[1] == p1))
    }

    //Called when the two players are ready
    @Get('start/:p1/:p2')
    async starts(@Param('p1') p1: number, @Param('p2') p2: number){
        //check if the two players are free and stops there games
        let game = this.getGame(p1, p2);
        if (game != undefined) {
            await this.ends(p1);
            await this.ends(p2);
        }

        // create a new game
        else {
            game = {
                playerIds: [p1, p2],
                state: {
                    running: true,
                    ball: new Vector2D(size.width / 2, size.height / 2),
                    dir: new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1).normalized(),
                    p1: new Vector2D(size.ball / 2, size.height / 2),
                    p2: new Vector2D(size.width - size.ball / 2, size.height / 2),
                    score: {p1: 0, p2: 0},
                    speed: 5,
                }
            };
            this.games.push(game);
            this.update(game);
        }
        return game;
    }

    //called at the start of the game and then every frame till the game ends
    async update(game: {playerIds:number[], state:State}){
        //check for the end game conditions
        if (game.state.score.p1 >= 10 || game.state.score.p2 >= 10 || !game.state.running) {
            return this.ends(game.playerIds[0]);
        }
        //call the logic in async function
        this.updateLogic(game.state);

        //await for a 30hz frame
        await delay(33);

        //and call itself again
        return this.update(game);
    }

    // called every frame to update the state of the game
    async updateLogic(game: State) {
        //move the ball to the current direction
        game.ball.add(Vector2D.scale(game.dir, game.speed));

        //check if the ball enter a 'GOAL'
        if (game.ball.x < 0 || game.ball.x > size.width)
        {
            // Update Score
            if (game.ball.x < 0)
                game.score.p2 += 1;
            if (game.ball.x > size.width)
                game.score.p1 += 1;

            // Start the new Round
            game.ball = new Vector2D(size.width/2, size.height/2);
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
            game.dir = new Vector2D(game.ball.x - (game.p1.x - size.ball), game.ball.y - game.p1.y)

        //collision with the right player
        if (game.ball.x + size.halfBall > game.p2.x
            && game.ball.y - size.halfBall < game.p2.y + size.halfBar
            && game.ball.y + size.halfBall > game.p2.y - size.halfBar)
            game.dir = new Vector2D(game.ball.x - (game.p2.x + size.ball), game.ball.y - game.p2.y)
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
    movePlayer(@Param('id') id:number, @Param('keyUp') key:boolean)
    {
        let game = this.getGame(id);
        if (game === undefined || !game.state.running) return 'game not found';
        if (game.playerIds[0] == id) {
            game.state.p1.y += key ? -game.state.speed : game.state.speed;
            game.state.p1.y = clamp(game.state.p1.y, size.ball * 1.5 + size.halfBar, size.height - size.ball * 1.5 - size.halfBar);
        }
        else if (game.playerIds[1] == id) {
            game.state.p2.y += key ? -game.state.speed : game.state.speed;
            game.state.p2.y = clamp(game.state.p2.y, size.ball * 1.5 + size.halfBar, size.height - size.ball * 1.5 - size.halfBar);
        }
    }
}
