import React, { useState } from 'react';
import Background from '../components/Background/Background';
import { backgroundImage, color } from '../Global';
import { Login } from '../components/Login/Login';
import { useEffectViewport, Viewport } from './Viewport';
import { MainPage } from '../components/MainPage/MainPage';
import { socket } from '../socket';

const SIZE = 350;

function App() {
  const view: Viewport = {
    isLandscape: window.innerWidth >= SIZE * 2 && window.innerWidth / window.innerHeight > 0.9,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [viewport, setViewport] = useState<Viewport>(view);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  useEffectViewport(viewport, SIZE, setViewport);

  console.log('Client\n');
  socket.emit('joinChat', 0);
  socket.emit('message', [0, 'chokbar']);
  socket.emit('leaveChat', 0);
  socket.connect();

  return (
    <div className={'cursor_perso'}
         style={{ height: viewport.isLandscape ? Math.max(viewport.height, SIZE) : Math.max(viewport.height, SIZE * 2) + 'px', width: '100%', color: color.white, overflow: 'hidden' }}>
      <Background image={backgroundImage} fixed={true}>
        <Login
          viewport={viewport}
          isConnected={isConnected}
          setIsConnected={setIsConnected}
        ></Login>
        {isConnected && (
          <MainPage panelWidth={SIZE} viewport={viewport}></MainPage>
        )}
      </Background>
    </div>
  );
}

export default App;
