import React, { useState } from 'react';
import Background from "./components/Background/Background";
import { color, backgroundImage, Viewport, useEffectViewport } from "./utils";
import { AuthGuard, Login, MainPage } from "./components";
// import { socket } from './socket';
import { Route, Routes } from 'react-router-dom';
import { Contexts } from './contexts';

const SIZE: number = 500;

function App() {
  const view: Viewport = {
    isLandscape: window.innerWidth >= SIZE * 2 && window.innerWidth / window.innerHeight > 0.9,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [viewport, setViewport] = useState<Viewport>(view);
  useEffectViewport(viewport, SIZE, setViewport);

  //console.log('Client\n');
  // socket.emit('joinChat', 0);
  // socket.emit('message', [0, 'chokbar']);
  // socket.emit('leaveChat', 0);
  // socket.connect();

  return (
    <Contexts>
      <div className={'cursor_perso'}
        style={{ height: viewport.isLandscape ? Math.max(viewport.height, SIZE) : Math.max(viewport.height, SIZE * 2) + 'px', width: '100%', color: color.white, overflow: 'hidden' }}>
        <Background image={backgroundImage} fixed={true}>
          <Routes>
            <Route
              path="/"
              element={
                <AuthGuard isAuthenticated>
                  <MainPage panelWidth={SIZE} viewport={viewport}></MainPage>
                </AuthGuard>
              }
            />
            <Route path="/login" element={<Login
              viewport={viewport}
            ></Login>} />
          </Routes>
        </Background>
      </div>
    </Contexts>
  );
}

export default App;
