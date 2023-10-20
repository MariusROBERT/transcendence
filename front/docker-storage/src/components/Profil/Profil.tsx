import { GameHistory, IUser } from '../../utils/interfaces';
import React, { useEffect, useState } from 'react';
import { UserButton } from '../User/UserButton';
import { useUserContext } from '../../contexts';
import { Popup } from '../index';
import { Fetch } from '../../utils';

export interface ProfilProps {
  otherUser: IUser | undefined | null;
  onClose?: () => void;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export default function Profil(props: ProfilProps) {
  const { user } = useUserContext();
  const [games, setGames] = useState<GameHistory[]>([])
  const mobile = window.innerWidth < 500;

  const profilContainer: React.CSSProperties = {
    borderRadius: '10px',
    padding: mobile ? 15 : 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    background: 'grey',
    height: '100%',
    color: 'white',
    margin: mobile ? 5 : 10,
    cursor: 'pointer',
    minWidth: '300px',
  };
  useEffect(() => {
    getGames();
  }, []);
  
  if (!props.otherUser)
    return (<div style={profilContainer}>
      <p>User not found</p>
    </div>);

  const isMe = props.otherUser?.id === user?.id;
  const displayName = props.otherUser?.username.length > 11 ?
    props.otherUser?.username.slice(0, 11) + '...' :
    props.otherUser?.username;


  const imgStyle = {
    width: '200px',
    borderRadius: '5px',
    border: '2px solid',
  };

  const statusStyle = {
    width: '10px',
    height: '10px',
  };

  async function getGames()
  {
    const tmp: { gameHist: GameHistory[] } = (await Fetch('Game/get_game/' + user?.id, 'GET'))?.json;
    setGames(tmp.gameHist);
    console.log(tmp.gameHist);
  }

  return (
    <Popup isVisible={props.isVisible} setIsVisible={props.setIsVisible}>
      <div style={profilContainer}>
        {mobile ?
          <h3>{displayName}</h3> :
          <h2>{displayName}</h2>
        }
        <p>ID : {props.otherUser?.id}</p>
        <img style={imgStyle} src={props.otherUser?.urlImg} alt={'user'} />
        <img style={isMe ? statusStyle : (props.otherUser?.user_status ? statusStyle : imgStyle)}
             src={props.otherUser?.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') :
               require('../../assets/imgs/icon_red_disconnect.png')}
             alt={props.otherUser?.user_status === 'on' ? 'connected' : 'disconnected'} />
        <hr style={{ width: '100%' }} />
        {/* <div style={MatchHistory}>
          {games.map((game)=>(
              <div key={game.id}><GameHistory user={user?.id} game={game}/> </div>
          ))}
        </div> */}
        <p>Winrate : {props.otherUser?.winrate} %</p>
        {!isMe && <UserButton otherUser={props.otherUser} />}
      </div>
    </Popup>
  );

}

