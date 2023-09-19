import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { State } from './Game';

interface Props {
    state:State
}

export function DrawGame({state}: Props) {

    let size:{
        height:number,
        width:number,
        ball:number,
        bar:{x:number, y:number},
        halfBar:number,
        halfBall:number
    } = {
        height: 720,
        width: 1280,
        ball: 50,
        bar: {x:25, y:144},
        halfBar: 72,
        halfBall: 25
    };
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        size = {
        height: 720,
        width: 1280,
        ball: 50,
        bar: p5.createVector(25, 144),
        halfBar: 72,
        halfBall: 25
    };
        p5.createCanvas(size.width, size.height);
        p5.background(0);
        p5.ellipse(state.ball.x, state.ball.y, size.ball);
        p5.rect(state.p1.x - size.bar.x, state.p1.y - size.halfBar, size.bar.x, size.bar.y);
        p5.rect(state.p2.x, state.p2.y - size.halfBar, size.bar.x, size.bar.y);
    };

    const draw = (p5: p5Types) => {
        p5.background(0);
        p5.textSize(32);
        p5.text(state.score.p1 + ' / ' + state.score.p2, size.width/2,  25);
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.fill(255);
        p5.ellipse(state.ball.x, state.ball.y, size.ball);
        p5.rect(state.p1.x - size.bar.x, state.p1.y - size.halfBar, size.bar.x, size.bar.y);
        p5.rect(state.p2.x, state.p2.y - size.halfBar, size.bar.x, size.bar.y);
    };

    return <Sketch setup={setup} draw={draw} />;
}