import { color, useIsWindowFocused, Viewport } from '../../utils';
import {
  Background,
  ChatPanel,
  ContactPanel,
  Navbar,
  PlayButton,
  Profil,
  Settings,
  Leaderboard,
} from '..';
import React, { useEffect, useState } from 'react';
import { Search } from '../Search/Search';
import {useFriendsRequestContext, useUserContext, useUIContext, useGameContext} from '../../contexts';
import JoinChat from '../Chat/JoinChat';
import CreateChat from '../Chat/CreateChat';


interface Props {
  panelWidth: number;
  viewport: Viewport;
}

export function MainPage({ panelWidth, viewport }: Props) {
  const focused = useIsWindowFocused();
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchContext, user } = useUserContext();
  const { fetchFriendsRequestContext } = useFriendsRequestContext();
  const { fetchGameContext } = useGameContext();
  const { loadUIContext  } = useUIContext();

  // functions -------------------------------------------------------------------------------------------------------//

  useEffect(() => {
    if (focused)
      fetchContext();
      fetchGameContext();
    // eslint-disable-next-line
  }, [focused]);

  useEffect(() => {
    fetchFriendsRequestContext();
    loadUIContext();
    // eslint-disable-next-line
  }, []);


  return (
    <div style={MainPageStyle}>
      <Background bg_color={color.clear} flex_direction={'row'} flex_justifyContent={'space-between'}
        flex_alignItems={'stretch'} forceStyle={{ zIndex: 2, position: 'relative' }}>
        <ContactPanel viewport={viewport} />
        <div style={CenterStyle}>
          <div style={{ height: '350px' }}>
            <h2 className={'rainbow'} style={{margin: '50px', fontSize: '130px', zIndex: '20', fontFamily: 'title' }}>PONG</h2>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeHolder={'Leader Board...'} user={user} />
            <Navbar />
          </div>
          <PlayButton />
          <div style={{ height: '350px' }} />
        </div>
        <ChatPanel viewport={viewport} width={panelWidth} />
      </Background>
      <Leaderboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Profil />
      <Settings />
      <JoinChat />
      <CreateChat />
    </div>
  );
}

const CenterStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  margin: 'auto',
  height: '100vh',
  overflow: 'scroll'
};

const MainPageStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
};
