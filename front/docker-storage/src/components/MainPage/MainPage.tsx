import {color, useIsWindowFocused, Viewport} from '../../utils';
import {Background, ChatPanel, ContactPanel, Navbar, PlayButton, SidePanel} from '..';
import React, {useEffect, useState} from 'react';
import {Search} from '../Search/Search';
import {useFriendsRequestContext, useUserContext} from '../../contexts';

interface Props {
  panelWidth: number;
  viewport: Viewport;
}

export function MainPage({panelWidth, viewport}: Props) {
  const focused = useIsWindowFocused();
  const [searchTerm, setSearchTerm] = useState('');
  const {fetchContext, user} = useUserContext();
  const {fetchFriendsRequestContext} = useFriendsRequestContext();

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
                  flex_alignItems={'stretch'} forceStyle={{zIndex: 2}}>
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
    </div>
  );
}

const MainPageStyle: React.CSSProperties = {
  //border: '4px solid red',
  position: 'relative',
  width: '100%',
  height: '100%',
};
