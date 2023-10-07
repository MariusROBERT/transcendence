import { color, Viewport, useIsWindowFocused } from '../../utils';
import { Background, ChatPanel, ContactPanel, Navbar, PlayButton, SidePanel } from '..';
import React, { useEffect, useState } from 'react';
import { Search } from '../Search/Search';
import { useUserContext } from '../../contexts';
import { useFriendsRequestContext } from '../../contexts/FriendsRequestContext/FriendsRequestContext';

interface Props {
  panelWidth: number;
  viewport: Viewport;
}

export function MainPage({ panelWidth, viewport }: Props) {
  const focused = useIsWindowFocused();
  const [searchTerm, setSearchTerm] = useState('');
  const [notifs, setNotifs] = useState<number>(0);
  const { fetchContext, user } = useUserContext();
  const { fetchFriendsRequestContext, recvInvitesFrom } = useFriendsRequestContext();

  useEffect(() => {
    if (focused) {
      fetchContext();
    }
    // eslint-disable-next-line
  }, [focused]);

  useEffect(() => {
    fetchFriendsRequestContext();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!user)
      return;
    if (recvInvitesFrom && recvInvitesFrom.length > 0)
      setNotifs(recvInvitesFrom.length);
    // eslint-disable-next-line
  }, [user]);

  return (
    <div style={MainPageStyle}>
      <Background bg_color={color.clear} flex_direction={'row'} flex_justifyContent={'space-between'}
                  flex_alignItems={'stretch'}>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={true} duration_ms={900}>
          <Background flex_justifyContent={'flex-start'}>
            <ContactPanel viewport={viewport} />
          </Background>
        </SidePanel>
        <Background bg_color={color.clear} flex_justifyContent={'space-around'}>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeHolder={'Leader Board...'} user={user} />
          <PlayButton />
        </Background>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={false} duration_ms={900}>
          <Background>
            <ChatPanel viewport={viewport} width={panelWidth} />
          </Background>
        </SidePanel>
      </Background>
      <Navbar />
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
