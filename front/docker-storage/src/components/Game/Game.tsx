import React, { useEffect, useState } from 'react';
import { baseSize, GuidedBall, Size, start, GameState, Ball } from './game.utils';
import { useGameContext, useUserContext } from '../../contexts';
import { Viewport } from '../../utils';
import Sketch from 'react-p5';
import p5Types from 'p5';
import { RoundButton } from '..';
import { useNavigate } from 'react-router-dom';

// const ball = new Ball({x: 0, y: 0}, 20)

export function Game({ viewport }: { viewport: Viewport }) {
  const navigate = useNavigate();
  const { id, socket } = useUserContext();
  const { leaveGame, isInGameWith } = useGameContext();
  const [gameState, setGameState] = useState<GameState>(start);
  const [size, setSize] = useState<Size>(baseSize);
  let upPressed = false;
  let downPressed = false;
  const [factor, setFactor] = useState<number>(1);
  const [usernames, setUsernames] = useState<string[]>(['', '']);
  const [balls, setBalls] = useState<GuidedBall[]>([]);

  // On Component Creation ------------------------------------------------------------------------------------------ //
  useEffect(() => {
    if (!isInGameWith)
      return navigate('/');
    // console.log('[', id, '] emit start_game', { id: id });
    socket?.emit('start_game', { id: id });
    socket?.on('get_usernames', (body: { p1: string, p2: string }) => {
      setUsernames([body.p1, body.p2]);
    });
    // eslint-disable-next-line
  }, [id, socket, isInGameWith, navigate]);

  // In Game Management --------------------------------------------------------------------------------------------- //
  // In Game -- Key Hook -------------------------------------------------------------------------------------------- //
  function keyPressed(p5: p5Types) {
    switch (p5.keyCode) {
      case 38:
        upPressed = true;
        break;
      case 40:
        downPressed = true;
        break;
    }
    move();
  }

  function keyReleased(p5: p5Types) {
    switch (p5.keyCode) {
      case 38:
        upPressed = false;
        break;
      case 40:
        downPressed = false;
        break;
    }
    move();
  }

  // In Game -- Event emission -------------------------------------------------------------------------------------- //
  function move() {
    const isMoving = (upPressed && !downPressed) || (!upPressed && downPressed);
    socket?.emit('move_player', { id: id, isMoving: isMoving, moveUp: upPressed });
  }

  // In Game -- Event reception ------------------------------------------------------------------------------------- //
  // In Game -- Connection Socket ----------------------------------------------------------------------------------- //
  useEffect(() => {
    function onGameStateUpdate(body: {
      gameState: {
        balls: { id: number, pos: { x: number, y: number } }[],
        p1: number,
        p2: number,
        score: { p1: number, p2: number }
      }
    }) {
      const updatedState = body.gameState;

      setGameState({
        balls: updatedState.balls.map(ball =>
        {return {id: ball.id, pos: {x: ball.pos.x * factor, y: ball.pos.y * factor}}}),
        p1: updatedState.p1 * factor,
        p2: updatedState.p2 * factor,
        score: { p1: updatedState.score.p1, p2: updatedState.score.p2 },
      });
    }

    // console.log('[', id, '] subscribed to update_game_state');
    socket?.on('update_game_state', onGameStateUpdate);
    return () => {
      socket?.off('update_game_state', onGameStateUpdate);
    };
    // eslint-disable-next-line
  }, [socket, factor]);

  // Resize Window Management --------------------------------------------------------------------------------------- //

  useEffect(() => {
    const newFactor = Math.min(viewport.width / baseSize.width, viewport.height / baseSize.height);
    setFactor(newFactor);
    setSize({
      height: baseSize.height * newFactor,
      width: baseSize.width * newFactor,
      ball: baseSize.ball * newFactor,
      bar: { x: baseSize.bar.x * newFactor, y: baseSize.bar.y * newFactor },
      halfBar: baseSize.halfBar * newFactor,
      halfBall: baseSize.halfBall * newFactor,
      p1X: baseSize.p1X * newFactor,
      p2X: baseSize.p2X * newFactor,
    });
  }, [viewport.width, viewport.height]);

  // Display Game Management ---------------------------------------------------------------------------------------- //
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(size.width, size.height);
    try {
      canvas.parent(canvasParentRef);
    } catch (e) {
      canvas.parent('container');
    }
    p5.strokeWeight(0);
    p5.background(0);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(32);
  };

  const draw = (p5: p5Types) => {
    p5.resizeCanvas(size.width, size.height);
    p5.background(15);
    {
      p5.fill(60);
      p5.ellipse(size.width / 2, size.height / 2, size.ball * 3);
      p5.fill(15);
      p5.ellipse(size.width / 2, size.height / 2, size.ball * 3 - 20);
      p5.fill(60);
      p5.rect(size.width / 2 - 5, 0, 10, size.height);
      p5.ellipse(size.width / 2, size.height / 2, size.ball * 0.5);
      p5.fill(255);
      p5.text(gameState.score.p1 + ' / ' + gameState.score.p2, size.width / 2, 25);
    }

    if (balls.length !== gameState.balls.length)
      setBalls(balls.filter(b => gameState.balls.some((bState) => bState.id === b.id)));

    if (balls.length !== gameState.balls.length) {
      const newBalls: GuidedBall[] = balls;
      for (let i = 0; i < gameState.balls.length; i++) {
        const ballState = gameState.balls[i];
        if (newBalls.some(b => b.id === ballState.id))
          continue;
        newBalls.push(new GuidedBall(ballState.id, ballState.pos));
      }
      setBalls(newBalls);
    }

    for (let i = 0; i < gameState.balls.length; i++) {
      const ballState = gameState.balls[i];
      const ball = balls.find(b => b.id === ballState.id);
      ball?.update(ballState.pos, size);
      ball?.draw(p5, size);
    }

    p5.rect(size.p1X - size.bar.x, gameState.p1 - size.halfBar, size.bar.x, size.bar.y);
    p5.rect(size.p2X, gameState.p2 - size.halfBar, size.bar.x, size.bar.y);
  };

  return (
    <div id={'container'} style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
        <p>{usernames[0]}</p>
        <p>{usernames[1]}</p>
      </div>
      {id && socket && isInGameWith &&
        <Sketch setup={setup} draw={draw} keyPressed={keyPressed} keyReleased={keyReleased}
                style={{ position: 'relative', top: '0' }}></Sketch>}
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <RoundButton icon={require('../../assets/imgs/icon_close.png')} onClick={() => {
          leaveGame();
        }}></RoundButton>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: '100%',
  minWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
};