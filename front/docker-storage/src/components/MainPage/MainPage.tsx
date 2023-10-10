import {color, useIsWindowFocused, Viewport} from '../../utils';
import {Background, ChatPanel, ContactPanel, Navbar, PlayButton, SidePanel} from '..';
import React, {useEffect, useState} from 'react';
import {Search} from '../Search/Search';
import {useFriendsRequestContext, useUserContext} from '../../contexts';
import Sketch from 'react-p5';
import p5Types from 'p5';
import {AutonomousBall, basesize, Size} from '../Game/game.utils';

interface Props {
  panelWidth: number;
  viewport: Viewport;
}

export function MainPage({panelWidth, viewport}: Props) {
  const focused = useIsWindowFocused();
  const [searchTerm, setSearchTerm] = useState('');
  const [notifs, setNotifs] = useState<number>(0);
  const {fetchContext, user} = useUserContext();
  const {fetchFriendsRequestContext, recvInvitesFrom} = useFriendsRequestContext();
  const [ball] = useState<AutonomousBall>(new AutonomousBall({x: 50, y: 50}, {x: 4, y: 7}));
  const [size, setSize] = useState<Size>({...basesize, ball: 30});

  useEffect(() => {
    if (focused) {
      fetchContext();
    }
    // eslint-disable-next-line
  }, [focused]);

  useEffect(() => {
    fetchFriendsRequestContext();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!user)
      return;
    if (recvInvitesFrom && recvInvitesFrom.length > 0)
      setNotifs(recvInvitesFrom.length);
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    setSize({
      ...size,
      width: viewport.width,
      height: viewport.height,
    })
  }, [viewport.width, viewport.height]);

  function setup(p5: p5Types, canvasParentRef: Element) {
    const canvas = p5.createCanvas(viewport.width, viewport.height);
    try {
      canvas.parent(canvasParentRef);
    } catch (e) {
      canvas.parent('container');
    }
  }

  function draw(p5: p5Types) {
    p5.resizeCanvas(viewport.width, viewport.height);
    p5.background(color.clear);
    p5.fill(255, 0, 255);
    ball.update(size);
    ball.draw(p5, size);
  }

  return (
    <div style={MainPageStyle}>
      <Background bg_color={color.clear} flex_direction={'row'} flex_justifyContent={'space-between'}
                  flex_alignItems={'stretch'}>
        <Sketch draw={draw} setup={setup} style={{position: 'absolute'}}/>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={true} duration_ms={900}>
          <Background flex_justifyContent={'flex-start'}>
            <ContactPanel viewport={viewport}/>
          </Background>
        </SidePanel>
        <Background bg_color={color.clear} flex_justifyContent={'space-around'}>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeHolder={'Leader Board...'} user={user}/>
          <PlayButton/>
        </Background>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={false} duration_ms={900}>
          <Background>
            <ChatPanel viewport={viewport} width={panelWidth}/>
          </Background>
        </SidePanel>
      </Background>
      <Navbar/>
      <div style={notificationBadgeStyle}>
        {notifs && <span style={notificationCountStyle}> 1 </span>}
      </div>
    </div>
  );
}

const MainPageStyle: React.CSSProperties = {
  //border: '4px solid red',
  position: 'relative',
  width: '100%',
  height: '100%',
};

const notificationBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  backgroundColor: 'red',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const notificationCountStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
};
