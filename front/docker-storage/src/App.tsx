import React, {useEffect, useState} from 'react';
import {color, useEffectViewport, Viewport} from './utils';
import {AuthGuard, Game, GameScore, Login, MainPage, NotFoundPage} from './components';
import {Route, Routes} from 'react-router-dom';
import {Contexts} from './contexts';
import {AnimatedBackground} from './components/ComponentBase/AnimatedBackground';


function App() {
  const mobile = window.innerWidth < 500;
  const SIZE = mobile ? 350 : 500;
  const start: Viewport = {
    isLandscape:
      window.innerWidth >= SIZE * 2 &&
      window.innerWidth / window.innerHeight > 0.9,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [viewport, setViewport] = useState<Viewport>(start);
  useEffectViewport(viewport, SIZE, setViewport);
  const [theme, setTheme] = useState<'RGB' | 'R/B Gradient' | 'WHITE' | 'BLACK'>('RGB');

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      changeTheme(e);
    });
  }, []);

  function changeTheme(e: KeyboardEvent) {
    if (e.key === '1') {
      setTheme('RGB');
    } else if (e.key === '2') {
      setTheme('R/B Gradient');
    } else if (e.key === '3') {
      setTheme('WHITE');
    } else if (e.key === '4') {
      setTheme('BLACK');
    }
  }


  const appStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    color: color.white,

    overflow: 'hidden',
  };

  return (
    <Contexts>
      <div
        className={'cursor_perso'}
        style={appStyle}
      >
        <AnimatedBackground viewport={viewport} ballNumber={10} style={{zIndex: '-1'}} theme={theme}/>
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
              <Game viewport={viewport} theme={theme}/>
            </AuthGuard>}>
          </Route>
          <Route path="/game/score" element={
            <AuthGuard isAuthenticated>
              <GameScore viewport={viewport}></GameScore>
            </AuthGuard>}>
          </Route>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
      </div>
    </Contexts>
  );
}

export default App;
