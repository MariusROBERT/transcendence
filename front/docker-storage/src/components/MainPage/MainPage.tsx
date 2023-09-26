import { color, Viewport } from '../../utils';
import { Background, ChatPanel, ContactPanel, Leaderboard, Navbar, RoundButton, SearchBar, SidePanel } from '..';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../contexts';
import { Game } from '../game/Game';

interface Props {
  panelWidth: number;
  viewport: Viewport;
}

// const [userComplete, setUserComplete] = useState<IUserComplete>();

export function MainPage({ panelWidth, viewport }: Props) {
  const OnLoad = '';
  const [searchTerm, setSearchTerm] = useState('');
  const [inGame, setInGame] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState<boolean>(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const { fetchContext, socket, id, user } = useUserContext();

  useEffect(() => {
    fetchContext();
  // eslint-disable-next-line
  }, [OnLoad]);


  useEffect(() => {
    if (user?.invites && Array.isArray(user?.invites) && user?.invites.length > 0)
      setShowNotificationBadge(true);
  }, [OnLoad, user?.invites]);

  function onPlayClicked() {
    // console.log('start clicked', socket?.id);
    socket?.emit('join_queue', { id: id });
  }

  return (
    <>
      {showNotificationBadge && (
        <div style={notificationBadgeStyle}>
          <span style={notificationCountStyle}>1</span>
        </div>)}
      {isLeaderboardVisible &&
        <Leaderboard meUser={user} searchTerm={searchTerm} isVisible={isLeaderboardVisible} setIsVisible={setIsLeaderboardVisible}></Leaderboard>}
      {!inGame && (<Background bg_color={color.clear} flex_direction={'row'} flex_justifyContent={'space-between'}
                               flex_alignItems={'stretch'}>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={true} duration_ms={900}>
          <Background flex_justifyContent={'flex-start'}>
            <ContactPanel meUser={user} viewport={viewport}></ContactPanel>
          </Background>
        </SidePanel>
        <Background bg_color={color.clear} flex_justifyContent={'space-around'}>
          <Navbar meUser={user}></Navbar>
          <SearchBar setSearchTerm={setSearchTerm} onClick={() => setIsLeaderboardVisible(true)}
                     isVisible={isLeaderboardVisible}>Leader Board..</SearchBar>
          <RoundButton icon_size={200} icon={require('../../assets/imgs/icon_play.png')}
                       onClick={onPlayClicked}></RoundButton>
          <div style={{ height: '60px' }} />
        </Background>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={false} duration_ms={900}>
          <Background>
            <ChatPanel viewport={viewport} width={panelWidth}></ChatPanel>
          </Background>
        </SidePanel>
      </Background>)}
      <Game inGame={inGame} setInGame={setInGame}></Game>
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