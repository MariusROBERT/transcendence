import React, { useState } from 'react';
import { backgroundImage, color, useEffectViewport, Viewport } from './utils';
import { AuthGuard, Game, Login, MainPage, GameScore, Background, NotFoundPage } from './components';
import { Route, Routes } from 'react-router-dom';
import { Contexts } from './contexts';

const SIZE: number = 500;

function App() {
  const view: Viewport = {
    isLandscape:
      window.innerWidth >= SIZE * 2 &&
      window.innerWidth / window.innerHeight > 0.9,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [viewport, setViewport] = useState<Viewport>(view);
  useEffectViewport(viewport, SIZE, setViewport);

  return (
    <Contexts>
      <div
        className={'cursor_perso'}
        style={{
          height: viewport.isLandscape
            ? Math.max(viewport.height, SIZE)
            : Math.max(viewport.height, SIZE * 2) + 'px',
          width: '100%',
          color: color.white,
          overflow: 'hidden',
        }}
      >
        <Background image={backgroundImage} fixed={true}>
          <Routes>
            <Route path='/login' element={
              <Login viewport={viewport}></Login>}>
            </Route>
            <Route path='/' element={
              <AuthGuard isAuthenticated>
                <MainPage panelWidth={SIZE} viewport={viewport}></MainPage>
              </AuthGuard>}>
            </Route>
            <Route path='/game' element={
              <AuthGuard isAuthenticated>
                <Game viewport={viewport}></Game>
              </AuthGuard>}>
            </Route>
            <Route path='/game/score' element={
              <AuthGuard isAuthenticated>
                <GameScore viewport={viewport}></GameScore>
              </AuthGuard>}>
            </Route>
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Background>
      </div>
    </Contexts>
  );
}

export default App;
