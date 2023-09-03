import React, {useEffect, useState} from 'react';
import Background from "../components/Background/Background";
import {color} from "../Global";
import {backgroundImage} from "../Global";
import styleSheet from './App.css';

import {Login} from "../components/Login/Login";
import {Border} from "../components/Border/Border";
import {Button} from "../components/Button/Button";
import {Viewport, useEffectViewport} from "./Viewport";
import {SidePanel} from "../components/SidePanel/SidePanel";

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
                { isConnected &&
                    <Background bg_color={color.clear} flex_direction={'row'} flex_justifyContent={"space-between"} flex_alignItems={'stretch'}>
                        <SidePanel viewport={viewport} width={SIZE} isLeftPanel={true} duration_ms={1500}>
                            <Background>
                                <p>contact pannel</p>
                            </Background>
                        </SidePanel>
                        <Background bg_color={color.clear} flex_justifyContent={'space-around'}>
                            <input/>
                            <Button onClick={() => console.log('play clicked')}>
                                Play
                            </Button>
                            <br/>
                        </Background>
                        <SidePanel viewport={viewport} width={SIZE} isLeftPanel={false} duration_ms={1500}>
                            <Background>
                                <p>chat pannel</p>
                            </Background>
                        </SidePanel>
                    </Background>
                }
            </Background>
        </div>
    );
}

export default App;
