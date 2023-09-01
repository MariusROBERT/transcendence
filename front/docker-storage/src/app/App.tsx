import React from 'react';
import Background from "../components/Background/Background";
import {color} from "../Global";
import {backgroundImage} from "../Global";
import './App.css';

import {Login} from "../components/Login/Login";

function App() {
    return (
        <div className={'cursor_perso'} style={{height:'100vh', color:color.white}}>
            <Background image={backgroundImage} flex_direction={'row'} flex_justifyContent={'space-around'}>
                <Login></Login>
            </Background>
        </div>
    );
}

export default App;
