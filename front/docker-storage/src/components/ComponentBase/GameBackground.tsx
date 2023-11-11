import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import { AutonomousBall, baseSize, Rainbow, Size } from '../Game/game.utils';
import { Viewport } from '../../utils';

interface Props {
  viewport: Viewport;
  style?: React.CSSProperties;
  ballNumber?: number;
  theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN';
}

export function GameBackground(props: Props) {
  const [size, setSize] = useState<Size>({ ...baseSize, ball: 30 });
  const [balls] = useState<AutonomousBall[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    setSize({
      ...size,
      width: props.viewport.width,
      height: props.viewport.height,
    });
  }, [props.viewport.width, props.viewport.height]);

  function setup(p5: p5Types, canvasParentRef: Element) {
    const canvas = p5.createCanvas(size.width, size.height);
    try {
      canvas.parent(canvasParentRef);
    } catch (e) {
      canvas.parent('container');
    }

    for (let i = 0; i < (props.ballNumber || 15); i++) {
      balls.push(new AutonomousBall(p5, {
          x: Math.random() * (props.viewport.width - (size.ball * 3)) + (size.ball * 1.5),
          y: Math.random() * (props.viewport.height - (size.ball * 3)) + (size.ball * 1.5),
        },
        {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5,
        }));
    }
    createBlocks(0.3, p5);
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
    let restBlocks = blocks.filter(block => block.hp > 0);
    if (restBlocks.length === 0) {
      createBlocks(0.3, p5);
      restBlocks = blocks;
    }
    restBlocks.forEach(block => {
      block.update(balls, size);
      block.draw(p5, size, props.theme);
    });
    setBlocks(restBlocks);
  }

  function createBlocks(probability: number, p5: p5Types) {
    for (let y = 60; y < window.innerHeight - 60; y += 80) {
      for (let x = 60; x < window.innerWidth - 160; x += 130) {
        if (Math.random() > 1 - probability) {
          const posX = ((y - 60) / 80) % 2 === 0 ? x : x + 70;
          blocks.push(new Block(p5, p5.createVector(posX, y), 5));
        }
      }
    }
  }

  return (
    <Sketch draw={draw} setup={setup}
            style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', ...props.style }} />
  );
}

const aura = 3;
class Block{
  center: p5Types.Vector;
  size: p5Types.Vector;
  pos: p5Types.Vector;
  hp: number;
  rainbow: Rainbow;
  constructor(p5: p5Types, pos: p5Types.Vector, hp: number) {
    this.pos = pos;
    this.size = p5.createVector(100, 50);
    this.hp = hp;
    this.center = p5.createVector(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
    this.rainbow = new Rainbow();
  }

  draw(
    p5: p5Types,
    size: Size,
    theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN',
  ) {
    // Neon
    p5.noStroke();
    p5.fill(...this.getColor(size, theme), 25);
    for (let i = 0; i < 30; i += aura) {
      p5.rect(this.pos.x - i/aura, this.pos.y - i/aura, this.size.x + 2 * i/aura, this.size.y + 2 * i/aura);
    }
    p5.fill(255,255,255, this.hp * 51);
    p5.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }

  getColor(
    size: Size,
    theme: 'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK' | 'R/B' | 'GREEN',
  ): [number, number, number] {
    if (theme === 'R/B Gradient') {
      const red = 255 - (this.pos.x * 255) / size.width;
      const blue = (this.pos.x * 255) / size.width;
      return [red, 0, blue];
    }
    if (theme === 'RGB') {
      return this.rainbow.next();
    }
    if (theme === 'WHITE') {
      return [200, 200, 200];
    }
    if (theme === 'GREEN') {
      return [0, 255, 0];
    }
    return [0, 0, 0];
  }

  isBallInContact(ball: AutonomousBall, size: Size): boolean {
    return ball.pos.x + size.ball / 2 > this.pos.x
      && ball.pos.x - size.ball / 2 < this.pos.x + this.size.x
      && ball.pos.y + size.ball / 2 > this.pos.y
      && ball.pos.y - size.ball / 2 < this.pos.y + this.size.y;
  }

  contactDirection(ball: AutonomousBall): 'X' | 'Y' {
    return ball.pos.x > this.pos.x && ball.pos.x < this.pos.x + this.size.x ? 'Y' : 'X';
  }

  update(balls: AutonomousBall[], size: Size) {
    balls.filter((ball) => this.isBallInContact(ball, size))
      .forEach(ball => {
        if (this.contactDirection(ball) === 'X') {
          ball.dir.x *= -1;
        } else {
          ball.dir.y *= -1;
        }
        this.hp--;
      });
  }
}