import { color, Fetch, Viewport } from '../../utils';
import { Background, ContactPanel, Leaderboard, Navbar, RoundButton, SearchBar, SidePanel } from '..';
import { useEffect, useState } from 'react';
import { ChatPanel } from '../ChatPanel/ChatPanel';
import Cookies from 'js-cookie';

interface Props {
  panelWidth: number;
  viewport: Viewport;
}

export function MainPage({ panelWidth, viewport }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState<boolean>(false);
  // const [userID, setUserID] = useState<number>();
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const jwtToken = Cookies.get('jwtToken');

  useEffect(() => {
    const getInvites = async () => {
      const user = (await Fetch('user', 'GET'))?.json;
      // setUserID(user.id);
      if (user.invites && Array.isArray(user.invites) && user.invites.length > 0)
        setShowNotificationBadge(true);
    };
    getInvites();
  }, [jwtToken]);


  return (
    <>
      {showNotificationBadge && (
        <div style={notificationBadgeStyle}>
          <span style={notificationCountStyle}>1</span>
        </div>
      )}
      {isLeaderboardVisible && <Leaderboard searchTerm={searchTerm} isVisible={isLeaderboardVisible}></Leaderboard>}
      <Background bg_color={color.clear} flex_direction={'row'} flex_justifyContent={'space-between'}
                  flex_alignItems={'stretch'}>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={true} duration_ms={900}>
          <Background flex_justifyContent={'flex-start'}>
            <ContactPanel viewport={viewport}></ContactPanel>
          </Background>
        </SidePanel>
        <Background bg_color={color.clear} flex_justifyContent={'space-around'}>
          <Navbar></Navbar>
          <SearchBar setSearchTerm={setSearchTerm} onClick={() => setIsLeaderboardVisible(true)}>Leader
            Board..</SearchBar>
          <RoundButton icon_size={200} icon={require('../../assets/imgs/icon_play.png')} onClick={() => {
            console.log('match making');
          }}></RoundButton>
          <div style={{ height: '60px' }} />
        </Background>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={false} duration_ms={900}>
          <Background>
            <ChatPanel viewport={viewport} width={panelWidth}></ChatPanel>
          </Background>
        </SidePanel>
      </Background>
    </>
  );
}

const notificationBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  right: '20px',
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