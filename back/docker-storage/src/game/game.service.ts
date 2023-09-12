import {Injectable} from '@nestjs/common';
import type {State} from "./game.controller";
import {Vector2D} from "./game.controller";

@Injectable()
export class GameService {

    // create a new game and return the index of the game.
    // starts(user_id: number,
    //        games: {
    //             playerId: number;
    //             states: State }[],
    //        size: {
    //             height: number;
    //             width: number;
    //             ball: number;
    //             bar: Vector2D
    //         }): number {
    //     games = games.filter(item => item.playerId != user_id); // remove other games played by the owner
    //
    //     games.push({
    //         playerId: user_id,
    //         states: {
    //             ball: new Vector2D(size.width/2, size.height/2),
    //             p1: new Vector2D(size.ball/2, size.height/2),
    //             p2: new Vector2D(size.width - size.ball/2, size.height/2),
    //             score: {p1: 0, p2: 0},
    //             speed: 5,
    //         }
    //     })
    //     return user_id;
    // }

    ends(){
        return 'the game ended';
    }
}
