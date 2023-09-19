import Cookies from 'js-cookie';
import { sendFriendInvite } from '../../utils/user_functions';
import { ProfilProps, UserInfos } from '../../utils/interfaces';
import { UserButton } from '../User/UserButton';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

// TODO : rafraichir quand il click sur ask as friend

const Profil: React.FC<ProfilProps> = ({ user, onClose }) => {
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken)
  {
    navigate('/login');
    alert('Vous avez été déconnecté');
  }
  const [userInfos, setUserInfos] = useState<UserInfos | null>(null);
  const [sendButton, setSendButton] = useState(false); 
  useEffect(() => {
        const fetchUserInfos = async () => {
          try {
            const response = await fetch('http://localhost:3001/api/user', {
              method: 'GET',
              body: undefined,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
              },
            });
    
            if (response.ok) {
              const userData = await response.json();
              setUserInfos(userData);
            } else {
              console.log('Réponse non OK');
            }
          } catch (error) {
            console.error(
              'Erreur lors de la récupération des données utilisateur:',
              error,
            );
          }
        };
    
        if (jwtToken) {
          fetchUserInfos();
        }
      }, [jwtToken]);

  useEffect(() => {
      if (userInfos && userInfos.invited.includes(user?.id as number)) {
        setSendButton(true);
    }
  }, [user?.id, userInfos]);

  if (user?.id === userInfos?.id)
  {
    return (
      <div style={profilContainer}>
        <div style={profilContent}>
          {user ? (
            <>
              <h2>COUCOU C"EST OUAM {user.username}</h2>
              <p>ID : {user.id}</p>
              <img style={imgStyle} src={require('../../assets/imgs/icon_default_profil.png')}></img>
              {user.user_status ? 
                <img style={statusStyle} src={require('../../assets/imgs/icon_status_connected.png')} />
              :
                <img style={imgStyle} src={require('../../assets/imgs/icon_status_disconnected.png')} />
              }
              <p>LAST MATCHS</p>
              <p>--------------</p>
              <p>--------------</p>
              <p>LAST MATCHS</p>
              <p>Winrate : {user.winrate}</p>
              <button onClick={onClose}>Fermer</button>
            </>
          ) : (
            <p>Utilisateur introuvable.</p>
          )}
        </div>
      </div>
    );
  }
	
  return (
    <div style={profilContainer}>
      <div style={profilContent}>
        {user ? (
          <>
            <h2>Profil de {user.username}</h2>
            <p>ID : {user.id}</p>
            <img style={imgStyle} src={require('../../assets/imgs/icon_default_profil.png')}></img>
            {user.user_status ? 
              <img style={statusStyle} src={require('../../assets/imgs/icon_status_connected.png')} />
            :
              <img style={imgStyle} src={require('../../assets/imgs/icon_status_disconnected.png')} />
            }
            <p>LAST MATCHS</p>
            <p>--------------</p>
            <p>--------------</p>
            <p>LAST MATCHS</p>
            <p>Winrate : {user.winrate}</p>
            <button onClick={onClose}>Fermer</button>
            {!user.is_friend ? (
              <>
                {sendButton ? ( 
                 <button disabled>Sent !</button>
                ) : (
                  <button onClick={() => sendFriendInvite(user.id, jwtToken)}>Add as friend</button>
                )}
                <button>Send a message</button>
                <button>Options</button>
              </>
            ) : (
              <>
                <button>Add as friend</button>
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
}


export default Profil;
