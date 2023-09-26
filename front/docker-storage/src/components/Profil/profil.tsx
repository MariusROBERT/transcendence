import Cookies from 'js-cookie';
import { sendFriendInvite } from '../../utils/user_functions';
import { ProfilProps } from '../../utils/interfaces';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../contexts';

// TODO : rafraichir quand il click sur ask as friend

const Profil: React.FC<ProfilProps> = ({ otherUser, meUser, onClose }) => {
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken) {
    navigate('/login');
    alert('Vous avez été déconnecté');
  }

  const { fetchContext } = useUserContext();
  const [sendButton, setSendButton] = useState(false);

  useEffect(() => {
    console.log('update user in profile', meUser);
    if (meUser && meUser.invited.includes(otherUser?.id as number)) {
      setSendButton(true);
    }
  }, [otherUser?.id, meUser]);

  const onClick = () => {
    if (!otherUser || !meUser)
      return;
    if (sendFriendInvite(otherUser.id, jwtToken))
      fetchContext();
  };

  if (otherUser?.id === meUser?.id) {
    return (
      <div style={profilContainer}>
        <div style={profilContent}>
          <>
            <h2>COUCOU C"EST OUAM {meUser?.username}</h2>
            <p>ID : {meUser?.id}</p>
            <img style={imgStyle} src={meUser?.urlImg} alt={'user\'s profile'} />
            <img style={meUser?.user_status ? statusStyle : imgStyle}
                 src={meUser?.user_status ? require('../../assets/imgs/icon_status_connected.png') : require('../../assets/imgs/icon_status_disconnected.png')}
                 alt={meUser?.user_status ? 'connected' : 'disconnected'} />
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
            <img style={imgStyle} src={otherUser.urlImg} alt={'profile'} />
            <img style={otherUser?.user_status ? statusStyle : imgStyle}
                 src={meUser?.user_status ? require('../../assets/imgs/icon_status_connected.png') : require('../../assets/imgs/icon_status_disconnected.png')}
                 alt={meUser?.user_status ? 'connected' : 'disconnected'} />
            <p>LAST MATCHS</p>
            <p>--------------</p>
            <p>--------------</p>
            <p>LAST MATCHS</p>
            <p>Winrate : {otherUser.winrate}</p>
            <button onClick={onClose}>Fermer</button>
            {!otherUser.is_friend ? (
              <>
                {sendButton ? (
                  <button disabled>Sent !</button>
                ) : (
                  <button onClick={onClick}>Add as friend</button>
                )}
                <button>Send a message</button>
                <button>Options</button>
              </>
            ) : (
              <>
                <button>ASk</button>
                <button>Play a Match</button>
                <button>Look the Match</button>
                <button>Options</button>
              </>
            )
            }
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
  zIndex: 999, // metre entre mainPage (devant input du LeaderBoard) et pannels
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
