import React, {useEffect, useState} from 'react';
import Background from "../components/Background/Background";
import {color} from "../Global";
import {backgroundImage} from "../Global";
import styleSheet from './App.css';

import {Login} from "../components/Login/Login";
import {Viewport, useEffectViewport} from "./Viewport";
import {MainPage} from "../components/MainPage/MainPage"
import { socket } from '../socket';

const SIZE = 350;

function App(){
    const view: Viewport = {
        isLandscape:window.innerWidth >= SIZE * 2 && window.innerWidth / window.innerHeight > 0.9,
        width:window.innerWidth,
        height:window.innerHeight
    }
    const [viewport, setViewport] = useState<Viewport>(view);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    useEffectViewport(viewport, SIZE, setViewport);

    return (
        <div className={'cursor_perso'} style={{height:viewport.isLandscape ? Math.max(viewport.height, SIZE) : Math.max(viewport.height, SIZE*2) + 'px', width:'100%', color:color.white, overflow:'hidden'}}>
            <Background image={backgroundImage} fixed={true}>
                <Login viewport={viewport} isConnected={isConnected} setIsConnected={setIsConnected}></Login>
                { isConnected && <MainPage panelWidth={SIZE} viewport={viewport}></MainPage>}
            </Background>
        </div>
    );
}

export default App;
