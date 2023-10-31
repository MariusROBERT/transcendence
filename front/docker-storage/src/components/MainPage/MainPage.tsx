import {color, useIsWindowFocused, Viewport} from '../../utils';
import {
  Background,
  ChatPanel,
  ContactPanel,
  Navbar,
  PlayButton,
  SidePanel,
  Profil,
  Settings,
  Leaderboard,
} from '..';
import React, {useEffect, useState} from 'react';
import {Search} from '../Search/Search';
import {useFriendsRequestContext, useUserContext} from '../../contexts';
import { useUIContext } from '../../contexts/UIContext/UIContext';
import JoinChat from '../Chat/JoinChat';
import { Rainbow } from '../Game/game.utils';


interface Props {
  panelWidth: number;
  viewport: Viewport;
}

export function MainPage({ panelWidth, viewport }: Props) {
  const focused = useIsWindowFocused();
  const [searchTerm, setSearchTerm] = useState('');
  const {fetchContext, user} = useUserContext();
  const {fetchFriendsRequestContext} = useFriendsRequestContext();
  const {
    isChatOpen, setIsChatOpen,
    isContactOpen, setIsContactOpen
  } = useUIContext();
  const [rainbow] = useState<Rainbow>(new Rainbow());
  const [titleColor, setTitleColor] = useState<string>('');

  // functions -------------------------------------------------------------------------------------------------------//


  useEffect(() => {
    const isPannelOpen = localStorage.getItem('isPannelOpen');

    if (isPannelOpen === '1') {
      setIsContactOpen(true);
    } else
      setIsContactOpen(false);
  }, [])

  function rgbTitle() {
    setTimeout(() => {
      const color = rainbow.next();
      setTitleColor(`rgb(${color[0]}, ${color[1]}, ${color[2]}`);
      rgbTitle();
    }, 20);
  }

  useEffect(() => {
    rgbTitle();
  }, []);

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
    // eslint-disable-next-line
  }, [user]);

  return (
    <div style={MainPageStyle}>
      <Background bg_color={color.clear} flex_direction={'row'} flex_justifyContent={'space-between'}
                  flex_alignItems={'stretch'} forceStyle={{ zIndex: 2, position:'relative' }}>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={true} duration_ms={900} contextIsOpen={isContactOpen} setContextIsOpen={setIsContactOpen} isChatOpen={isChatOpen}>
          <Background flex_justifyContent={'flex-start'}>
            <ContactPanel viewport={viewport} />
          </Background>
        </SidePanel>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
          height:'100vh'
        }}>
          <div style={{ height: '200px'}}>
          <h2 style={{ paddingBottom: '10px', filter: `drop-shadow(0 0 10px ${titleColor})`, fontSize:'130px', zIndex:'20', fontFamily:'title', top:'15px'}}>PONG</h2>
          </div>
          <div style={{}}>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeHolder={'Leader Board...'} user={user} />
          <Navbar />
          </div>
          <div style={{position:'absolute', top:'50%', transform:'translate(25%,-50%)'}}>
          <PlayButton />
          </div>
        </div>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={false} duration_ms={900} contextIsOpen={isChatOpen} setContextIsOpen={setIsChatOpen} isChatOpen={isChatOpen}>
          <Background>
            <ChatPanel viewport={viewport} width={panelWidth} />
          </Background>
        </SidePanel>
      </Background>
      <Leaderboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Profil />
      <Settings />
      <JoinChat />
      
      
    </div>
  );
}

const MainPageStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
};
