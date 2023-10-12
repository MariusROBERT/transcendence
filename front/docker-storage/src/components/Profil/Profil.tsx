import {IUser} from '../../utils/interfaces';
import React from 'react';
import {UserButton} from '../User/UserButton';
import {useUserContext} from '../../contexts';

export interface ProfilProps {
  otherUser: IUser | undefined | null;
  onClose?: () => void;
}

export default function Profil(props: ProfilProps) {
  const {user} = useUserContext();
  const mobile = window.innerWidth < 500;

  const profilContainer: React.CSSProperties = {
    borderRadius: '10px',
    padding: mobile ? 15: 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    background: 'grey',
    height: '100%',
    color: 'white',
    margin: mobile ? 5: 10,
    cursor: 'pointer',
    minWidth: '300px',
  };

  if (!props.otherUser)
    return (<div style={profilContainer}>
      <p>Utilisateur introuvable.</p>
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

  return (
    <div style={profilContainer}>
      {mobile ?
        <h3>{displayName}</h3> :
        <h2>{displayName}</h2>
      }
      <p>ID : {props.otherUser?.id}</p>
      <img style={imgStyle} src={props.otherUser?.urlImg} alt={'user'}/>
      <img style={isMe ? statusStyle : (props.otherUser?.user_status ? statusStyle : imgStyle)}
           src={props.otherUser?.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') :
             require('../../assets/imgs/icon_red_disconnect.png')}
           alt={props.otherUser?.user_status === 'on' ? 'connected' : 'disconnected'}/>
      <hr style={{width: '100%'}}/>
      <p>LAST MATCHS</p>
      <p>--------------</p>
      <p>--------------</p>
      <p>LAST MATCHS</p>
      <p>Winrate : {props.otherUser?.winrate}</p>
      {!isMe && <UserButton otherUser={props.otherUser}/>}

    </div>
  );

}

