import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../contexts';
import { UserButton } from '../User/UserButton';
import { IUser, IUserComplete } from '../../utils/interfaces';

export interface ProfilProps {
  otherUser: IUser | undefined | null;
  meUser: IUserComplete | undefined;
  onClose?: () => void;
}

const Profil: React.FC<ProfilProps> = ({ otherUser, meUser, onClose }) => {
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken)
  {
    window.location.replace('/login');
    alert('Vous avez été déconnecté');
  }

  if (otherUser?.id === meUser?.id) {
    return (
      <div style={profilContainer}>
        <div style={profilContent}>
            <>
              <h2>COUCOU C"EST OUAM {meUser?.username}</h2>
              <p>ID : {meUser?.id}</p>
              <img style={imgStyle} src={meUser?.urlImg}></img>
              {meUser?.user_status == 'on' ?
                <img style={statusStyle} src={require('../../assets/imgs/icon_green_connect.png')} />
              :
                <img style={statusStyle} src={require('../../assets/imgs/icon_red_disconnect.png')} />
              }
              <p>LAST MATCHS</p>
              <p>--------------</p>
              <p>--------------</p>
              <p>LAST MATCHS</p>
              <p>Winrate : {meUser?.winrate}</p>
              <button onClick={onClose}>Fermer</button>
            </>
        </div>
      </div>
    );
  }

  return (
    <div style={profilContainer}>
      <div style={profilContent}>
        {otherUser ? (
          <>
            <h2>Profil de {otherUser.username}</h2>
            <p>ID : {otherUser.id}</p>
            <img style={imgStyle} src={otherUser.urlImg}></img>
            <img style={otherUser?.user_status ? statusStyle : imgStyle}
                 src={meUser?.user_status ? require('../../assets/imgs/icon_status_connected.png') : require('../../assets/imgs/icon_status_disconnected.png')}
                 alt={meUser?.user_status ? 'connected' : 'disconnected'} />
            <p>LAST MATCHS</p>
            <p>--------------</p>
            <p>--------------</p>
            <p>LAST MATCHS</p>
            <p>Winrate : {otherUser.winrate}</p>
            <button onClick={onClose}>Fermer</button>
            {/* <UserButton otherUser={otherUser} meUser={meUser}></UserButton> */}
          </>
        ) : (
          <p>Utilisateur introuvable.</p>
        )}
      </div>
    </div>
  );
};

const profilContainer: React.CSSProperties = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999, // todo : metre entre mainPage (devant input du LeaderBoard) et pannels
};

const profilContent = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
};

const imgStyle = {
  width: '100px',
  height: '100px',
  border: '1px solid red',
};


const statusStyle = {
  width: '10px',
  height: '10px',
};


export default Profil;
