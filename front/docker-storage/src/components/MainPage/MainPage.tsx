import { color, Viewport } from '../../utils';
import { Background, ChatPanel, ContactPanel, Leaderboard, Navbar, RoundButton, SearchBar, SidePanel } from '..';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../contexts';
import { Game } from '../game/Game';
import Cookies from 'js-cookie';

interface Props {
  panelWidth: number;
  viewport: Viewport;
}

export function MainPage({ panelWidth, viewport }: Props) {
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken)
    window.location.replace('http://localhost:3001/api/auth/login');
  const [searchTerm, setSearchTerm] = useState('');
  const [inGame, setInGame] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState<boolean>(false);
  const [notifs, setNotifs] = useState<number>(0);
  const { fetchContext, socket, id, user } = useUserContext();

  useEffect(() => {
    const getUser = async () => {
      await fetchContext();
    }
    getUser();
  }, [fetchContext]);

  useEffect(() => {
    if (!user)
      return;
    if (user.invites && Array.isArray(user.invites) && user.invites.length > 0)
      setNotifs(user.invites.length);
  }, [user]);

  function onPlayClicked() {
    // console.log('start clicked', socket?.id);
    socket?.emit('join_queue', { id: id });
  }

  return (
    <div style={MainPageStyle}>
      {notifs && (
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
                     <div style={btn}>

          <RoundButton icon_size={200} icon={require('../../assets/imgs/icon_play.png')}
                       onClick={onPlayClicked}></RoundButton>
                       </div>
          <div style={{ height: '60px' }} />
        </Background>
        <SidePanel viewport={viewport} width={panelWidth} isLeftPanel={false} duration_ms={900}>
          <Background>
            <ChatPanel viewport={viewport} width={panelWidth}></ChatPanel>
          </Background>
        </SidePanel>
      </Background>)}
      <Game inGame={inGame} setInGame={setInGame}></Game>
    </div>
  );
}

const btn: React.CSSProperties = {
  left: '50%',
  top: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)'
}
const MainPageStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%'

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