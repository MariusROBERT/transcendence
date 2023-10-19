import { IUser, NotifMsg } from '../../utils/interfaces';
import './stylenavbar.css';
import { RoundButton } from '../ComponentBase/RoundButton';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import Profil from '../Profil/Profil';
import { useEffect, useState } from 'react';
import Popup from '../ComponentBase/Popup';
import { openChat } from '../../utils/user_functions';
import { Fetch } from '../../utils';
import { Socket } from 'socket.io-client';



const NotifCard = ({ notifFriends, otherUserId, notifMsg }: { notifFriends?: IUser, notifMsg?: NotifMsg, otherUserId: number }) => {
  const { acceptFriendRequest, declineFriendRequest, recvInvitesFrom } = useFriendsRequestContext();
  const { id } = useUserContext();
  const [visible, setVisible] = useState<boolean>(false);
  const [usr, setUsr] = useState<IUser>();
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    async function getOtherUser() {
      const usr = (await (Fetch(`/user/get_public_profile_by_id/${otherUserId}`, 'GET')))?.json;
      setUsr(usr);
      setSocket(socket);
    }
    getOtherUser();
  }, [])


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
              onClick={() => acceptFriendRequest(otherUserId)} />
            <RoundButton icon={require('../../assets/imgs/icon_denied.png')}
              onClick={() => declineFriendRequest(otherUserId)} />
          </div>
        </div>
        <Popup isVisible={visible} setIsVisible={setVisible}>
          <Profil otherUser={notifFriends} isVisible={visible} setIsVisible={setVisible} />
        </Popup>
      </div>
    );
  }
  return (
    <div className='notif'>
      <div className='bar' />
      <div className='container'>
        <p className='username'>
          {notifMsg?.chan_status === 'public' ? (<>{notifMsg?.chan_status}: Vous avez recu un message de {notifMsg?.sender_username} </>) :
            (<> Vous avez recu un message de {notifMsg?.sender_username} </>)}
        </p>
        <div onClick={() => {
          if (!usr) return;
          openChat(usr, socket)}} ><button>Ouvrir la conversation</button></div>
      </div>
    </div>
  );
};

export default NotifCard;