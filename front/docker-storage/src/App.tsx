import React, {useState} from 'react';
import {backgroundImage, color, useEffectViewport, Viewport} from './utils';
import {AuthGuard, Background, Game, GameScore, Login, MainPage, NotFoundPage} from './components';
import {Route, Routes} from 'react-router-dom';
import {Contexts} from './contexts';

const mobile = window.innerWidth < 500;

const SIZE = mobile ? 350 : 500;

function App() {
  const [viewport, setViewport] = useState<Viewport>(start);
  useEffectViewport(viewport, SIZE, setViewport);

  return (
    <Contexts>
      <div
        className={'cursor_perso'}
        style={appStyle}
      >
        <Background image={backgroundImage} fixed={true}>
          <Routes>
            <Route path="/login" element={
              <Login viewport={viewport}></Login>}>
            </Route>
            <Route path="/" element={
              <AuthGuard isAuthenticated>
                <MainPage panelWidth={SIZE} viewport={viewport}></MainPage>
              </AuthGuard>}>
            </Route>
            <Route path="/game" element={
              <AuthGuard isAuthenticated>
                <Game viewport={viewport}></Game>
              </AuthGuard>}>
            </Route>
            <Route path="/game/score" element={
              <AuthGuard isAuthenticated>
                <GameScore viewport={viewport}></GameScore>
              </AuthGuard>}>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
          </Routes>
        </Background>
      </div>
    </Contexts>
  );
}

const appStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  color: color.white,

  overflow: 'hidden',
};

const start: Viewport = {
  isLandscape:
    window.innerWidth >= SIZE * 2 &&
    window.innerWidth / window.innerHeight > 0.9,
  width: window.innerWidth,
  height: window.innerHeight,
};

export default App;
