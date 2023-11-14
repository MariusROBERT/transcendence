import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import { AutonomousBall, baseSize, MouseBall, Size } from '../Game/game.utils';
import { Viewport } from '../../utils';
import {useUIContext} from '../../contexts';

interface Props {
  viewport: Viewport;
  style?: React.CSSProperties;
  ballNumber?: number;
  theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN';
}

export function AnimatedBackground(props: Props) {
  const { paused } = useUIContext();
  const [size, setSize] = useState<Size>(baseSize);
  const [balls] = useState<AutonomousBall[]>([]);

  useEffect(() => {
    setSize({
      ...size,
      width: props.viewport.width,
      height: props.viewport.height,
    });
  }, [props.viewport.width, props.viewport.height]);

  let mouseBall;

  function magnetballs(p5: p5Types) {
    balls.forEach(ball => {
      ball.dir.x += (p5.mouseX - ball.pos.x) / 10;
      ball.dir.y += (p5.mouseY - ball.pos.y) / 10;
      ball.speed += 10;
    });
  }

  function setup(p5: p5Types, canvasParentRef: Element) {
    const canvas = p5.createCanvas(size.width, size.height);
    try {
      canvas.parent(canvasParentRef);
    } catch (e) {
      canvas.parent('container');
    }
    while (balls.length < (props.ballNumber || 1)) {
      balls.push(new AutonomousBall(p5, {
          x: Math.random() * (props.viewport.width - (size.ball * 3)) + (size.ball * 1.5),
          y: Math.random() * (props.viewport.height - (size.ball * 3)) + (size.ball * 1.5),
        },
        {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5,
        }));
    }

    if (balls.length <= (props.ballNumber || 1)) {
      mouseBall = new MouseBall(p5, {x: p5.mouseX, y: p5.mouseY}, {x: 0, y: 0});
      balls.push(mouseBall);
    }
  }

  function draw(p5: p5Types) {
    p5.resizeCanvas(size.width, size.height);
    p5.background(60);
    p5.fill(20);
    p5.rect(5, 5, size.width - 10, size.height - 10);
    p5.fill(60);
    p5.circle(size.width / 2, size.height / 2, size.ball * 8);
    p5.fill(20);
    p5.circle(size.width / 2, size.height / 2, size.ball * 8 - 20);
    p5.fill(60);
    p5.rect(size.width / 2 - 5, 0, 10, size.height);
    p5.circle(size.width / 2, size.height / 2, size.ball);
    p5.fill(255, 0, 255);
    for (let i = 0; i < balls.length; i++) {
      if (i < balls.length - 1) {
        balls[i].update(size, balls.slice(i + 1, balls.length), p5, props.theme);
      } else {
        balls[i].update(size, [], p5, props.theme);
      }
      balls[i].draw(p5, size, props.theme);
    }
  }

  return (
    <>
      {!paused &&
      <Sketch draw={draw} setup={setup} mouseClicked={magnetballs}
            style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', ...props.style }} />
      }
    </>
  );
}
