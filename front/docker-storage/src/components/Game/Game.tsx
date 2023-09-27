import React, { useEffect, useState } from 'react';
import { basesize, Size, start, State } from './game.utils';
import { useUserContext } from '../../contexts';
import { Viewport } from '../../utils';
import Sketch from "react-p5";
import p5Types from "p5";

export function Game({ viewport }:{ viewport: Viewport }) {
  const [state, setState] = useState<State>(start);
  const { id, socket } = useUserContext();
  const [size, setSize] = useState<Size>(basesize);
  const [started, setStarted] = useState<boolean>(false);
  const [upPressed, setUpPressed] = useState<boolean>(false);
  const [downPressed, setDownPressed] = useState<boolean>(false);
  const [factor, setFactor] = useState<number>(1);

  useEffect(() => {
    function stateListener(state: {
      ball: { x:number, y:number },
      p1: number,
      p2: number,
      score: { p1:number, p2:number }
    }) {
      setState({
        ball: { x: state.ball.x * factor, y: state.ball.y * factor },
        p1: state.p1 * factor,
        p2: state.p2 * factor,
        score: { p1:state.score.p1, p2:state.score.p2 }
      });
    }

    socket?.on('sendState', stateListener);
    return () => {
      socket?.off('sendState', stateListener);
    };
  }, [socket, factor]);

  useEffect(() => {
    function getSize(){
      setFactor(basesize.width / viewport.width);
      setSize({
        height: basesize.height * factor,
        width: basesize.width * factor,
        ball: basesize.ball * factor,
        bar: {x:basesize.bar.x * factor, y:basesize.bar.y * factor},
        halfBar: basesize.halfBar * factor,
        halfBall: basesize.halfBall * factor,
        p1X: basesize.p1X * factor,
        p2X: basesize.p2X * factor,
      });
    }
    getSize();
  }, [viewport, factor]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const game = p5.createCanvas(viewport.width, viewport.height);
    game.parent('container')
    p5.background(0);
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.textSize(32);
    p5.text(state.score.p1 + ' / ' + state.score.p2, size.width/2,  25);
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.fill(255);
    p5.ellipse(state.ball.x, state.ball.y, size.ball);
    p5.rect(size.p1X - size.bar.x, state.p1 - size.halfBar, size.bar.x, size.bar.y);
    p5.rect(size.p2X, state.p2 - size.halfBar, size.bar.x, size.bar.y);
  };

  function windowResized(p5: p5Types) {
    p5.resizeCanvas(viewport.width, viewport.height);
  }

  function onKeyPressed(moveUp: boolean){
    if (!started){
      console.log('start !')
      setStarted(true);
      socket?.emit('start_game', {id : id});
    }
    if (moveUp)
      setUpPressed(true);
    else
      setDownPressed(true);
    if (downPressed && upPressed)
      stop();
    else
      move(moveUp);
  }

  function onKeyReleased(moveUp: boolean){
    if (moveUp)
      setUpPressed(false);
    else
      setDownPressed(false);
    if (!downPressed && !upPressed)
      stop();
    else if (downPressed)
      move(false);
    else if (upPressed)
      move(true);
  }

  function move(moveUp: boolean) {
    socket?.emit('move_player', { id: id, isMoving: true, moveUp: moveUp });
  }

  function stop() {
    socket?.emit('move_player', { id: id, isMoving: false, moveUp: false });
  }

  function keyDown(p5: p5Types){
    if (p5.keyCode === p5.UP_ARROW)
      onKeyPressed(true);
    if (p5.keyCode === p5.DOWN_ARROW)
      onKeyPressed(false);
  }

  function keyUp(p5: p5Types){
    if (p5.keyCode === p5.UP_ARROW)
      onKeyReleased(true);
    if (p5.keyCode === p5.DOWN_ARROW)
      onKeyReleased(false);
  }

  return(
    <div id={'container'} style={{
      minHeight: '100vh -webkit - fill - available',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute'
    }}>
      <Sketch setup={setup} draw={draw} keyPressed={keyDown} keyReleased={keyUp} style={{position:'relative', top:'0'}} windowResized={windowResized}></Sketch>
    </div>
  );
}