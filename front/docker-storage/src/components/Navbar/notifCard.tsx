import { IUser, NotifMsg } from '../../utils/interfaces';
import './stylenavbar.css';
import { RoundButton } from '../ComponentBase/RoundButton';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import Profil from '../Profil/Profil';
import { useState } from 'react';
import Popup from '../ComponentBase/Popup';

const NotifCard = ({ notifFriends, otherUserId, notifMsg }: { notifFriends?: IUser, notifMsg?: NotifMsg, otherUserId: number }) => {
  const { acceptFriendRequest, declineFriendRequest, recvInvitesFrom } = useFriendsRequestContext();
  const { id } = useUserContext();
  const [visible, setVisible] = useState<boolean>(false);

  if (recvInvitesFrom.includes(otherUserId)) {
    return (
      <div className='notif'>
        <div className='bar' />
        <div className='container'>
          <p className='username'>
            {notifFriends && <RoundButton icon={notifFriends.urlImg} onClick={() => { setVisible(true); }} />}{notifFriends?.username} vous a demande en ami
          </p>
          <div className='btn'>
            <RoundButton icon={require('../../assets/imgs/icon_accept.png')}
              onClick={() => acceptFriendRequest(id, otherUserId)} />
            <RoundButton icon={require('../../assets/imgs/icon_denied.png')}
              onClick={() => declineFriendRequest(id, otherUserId)} />
          </div>
        </div>
        <Popup isVisible={visible} setIsVisible={setVisible}>
          <Profil otherUser={notifFriends} />
        </Popup>
      </div>
    );
  }
  return (
    <div className='notif'>
      <div className='bar' />
      <div className='container'>
        <p className='username'>
        {notifMsg?.channel_name}: Vous avez recu un message de {notifMsg?.sender_username}
        </p>
        <div><button>Ouvrir le chat {notifMsg?.channel_name}</button></div>
      </div>
    </div>
  );
  return null;

};

export default NotifCard;