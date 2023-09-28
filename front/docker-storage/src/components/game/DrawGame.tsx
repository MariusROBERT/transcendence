import React, { useState } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import { useUserContext } from '../../contexts';
import { basesize, State } from './game.utils';

interface Props {
  state: State;
}

export function DrawGame({ state }: Props) {
  let size = basesize;
  const [started, setStarted] = useState<boolean>(false);
  const [upPressed, setUpPressed] = useState<boolean>(false);
  const [downPressed, setDownPressed] = useState<boolean>(false);
  const { id, socket } = useUserContext();

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    size = {
      height: 720,
      width: 1280,
      ball: 50,
      bar: p5.createVector(25, 144),
      halfBar: 72,
      halfBall: 25,
    };
    p5.createCanvas(size.width, size.height);
    p5.background(0);
    p5.ellipse(state.ball.x, state.ball.y, size.ball);
    p5.rect(
      state.p1.x - size.bar.x,
      state.p1.y - size.halfBar,
      size.bar.x,
      size.bar.y,
    );
    p5.rect(state.p2.x, state.p2.y - size.halfBar, size.bar.x, size.bar.y);
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.textSize(32);
    p5.text(state.score.p1 + ' / ' + state.score.p2, size.width / 2, 25);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.fill(255);
    p5.ellipse(state.ball.x, state.ball.y, size.ball);
    p5.rect(
      state.p1.x - size.bar.x,
      state.p1.y - size.halfBar,
      size.bar.x,
      size.bar.y,
    );
    p5.rect(state.p2.x, state.p2.y - size.halfBar, size.bar.x, size.bar.y);
  };

  function onKeyPressed(moveUp: boolean) {
    if (!started) {
      console.log('start !');
      setStarted(true);
      socket?.emit('start_game', { id: id });
    }
    if (moveUp) setUpPressed(true);
    else setDownPressed(true);
    if (downPressed && upPressed) stop();
    else move(moveUp);
  }

  function onKeyReleased(moveUp: boolean) {
    if (moveUp) setUpPressed(false);
    else setDownPressed(false);
    if (!downPressed && !upPressed) stop();
    else if (downPressed) move(false);
    else if (upPressed) move(true);
  }

  function move(moveUp: boolean) {
    socket?.emit('move_player', { id: id, isMoving: true, moveUp: moveUp });
  }

  function stop() {
    socket?.emit('move_player', { id: id, isMoving: false, moveUp: false });
  }

  function keyDown(p5: p5Types) {
    if (p5.keyCode === p5.UP_ARROW) onKeyPressed(true);
    if (p5.keyCode === p5.DOWN_ARROW) onKeyPressed(false);
  }

  function keyUp(p5: p5Types) {
    if (p5.keyCode === p5.UP_ARROW) onKeyReleased(true);
    if (p5.keyCode === p5.DOWN_ARROW) onKeyReleased(false);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
      }}
    >
      <Sketch
        setup={setup}
        draw={draw}
        keyPressed={keyDown}
        keyReleased={keyUp}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
