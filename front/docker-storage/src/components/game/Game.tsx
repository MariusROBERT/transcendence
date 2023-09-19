import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client'
import p5Types from "p5";
import { DrawGame } from './DrawGame';

export interface State{
    running: boolean,
    ball: {x:number, y:number},
    speed: number,
    dir: {x:number, y:number},
    p1: {x:number, y:number},
    p2: {x:number, y:number},
    score: {p1: number, p2: number}
}

export function Game(id:number){

    const [socket, setSocket] = useState<Socket>();
    const [state, setState] = useState<State>({
        running: false,
        ball: {x:0, y:0},
        speed: 0,
        dir: {x:0, y:0},
        p1: {x:0, y:0},
        p2: {x:0, y:0},
        score: {p1: 0, p2: 0}
    });

    useEffect(() => {
        const newSocket = io('http://localhost:8001');
        setSocket(newSocket);
    }, [setSocket]);

    const movePlayer = (moveUp: boolean) => {
        const value: any = {playerId: id, moveUp: moveUp}
        socket?.emit('movePlayer', value);
    }

    const stateListener = (game: {playerIds:number[], state:State}) => {
        if (game.playerIds[0] !== id && game.playerIds[1] !== id) return;
        setState(game.state);
    }
    useEffect(() => {
        socket?.on('sendState', stateListener);
        return () => {socket?.off('sendState', stateListener)}
    }, [stateListener]);

    return (
        <>
            <DrawGame state={state} ></DrawGame>
        </>
    );
}