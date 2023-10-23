import { IUser, NotifMsg } from '../../utils/interfaces';
import './stylenavbar.css';
import { RoundButton } from '../ComponentBase/RoundButton';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import Profil from '../Profil/Profil';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Popup from '../ComponentBase/Popup';
import { openChat } from '../../utils/user_functions';
import { Fetch } from '../../utils';
import { Socket } from 'socket.io-client';
import { SetCurrChan, UpdateChannelMessage, UpdateChannelUsers } from '../../utils/channel_functions';
import { publish } from '../../utils/event';

const NotifCard = ({ notifFriends, notifMsg, setNotifsMsg, notifsMsg, otherUserId }: { notifFriends?: IUser, notifMsg?: NotifMsg, setNotifsMsg?: Dispatch<SetStateAction<NotifMsg[]>>, notifsMsg?: NotifMsg[], otherUserId: number }) => {
  const { acceptFriendRequest, declineFriendRequest, recvInvitesFrom } = useFriendsRequestContext();
  const [visible, setVisible] = useState<boolean>(false);
  const [usr, setUsr] = useState<IUser>();
  const { id, socket } = useUserContext()

  useEffect(() => {
    notifsMsg?.filter((el) => {
      if (el.sender_id !== otherUserId || el.channel_id !== otherUserId) {
        return;
      }
    });
  }, [])

  useEffect(() => {
    async function getOtherUser() {
      const usr = (await (Fetch(`user/get_public_profile_by_id/${otherUserId}`, 'GET')))?.json;
      setUsr(usr);
    }
    getOtherUser();
  }, [])

  async function OnJoinChannel(name: string) {
    console.log('name: ', name);
    if (!usr) return ;
    // openChat(usr, socket);
    UpdateChannelMessage(id);
    UpdateChannelUsers(id);
    SetCurrChan(name);
    socket?.emit('join', { channel: name });
    publish('open_chat', undefined);
  }

  const onclick = async () => {
    if (!usr || !notifMsg) return;
    OnJoinChannel(notifMsg.channel_name);
    if (setNotifsMsg && notifsMsg)
      setNotifsMsg(notifsMsg.filter((el) => el.sender_id !== otherUserId));
    try {
      await fetch(`http://localhost:3001/api/msgsUnread/remove/${otherUserId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.log('que tchi');
    }
  }

  if (recvInvitesFrom.includes(otherUserId)) {
    return (
      <div className='notif'>
        <div className='bar' />
        <div className='container'>
          <div className='username'>
            {notifFriends && <RoundButton icon={notifFriends.urlImg} onClick={() => { setVisible(true); }} />}<p><span style={{fontWeight: 'bold', color: '#459DD3'}}>{notifFriends?.username}</span> vous a demande en ami</p>
          </div>
          <div className='btn'>
            <RoundButton icon={require('../../assets/imgs/icon_accept.png')}
              onClick={() => {acceptFriendRequest(otherUserId)}} />
            <RoundButton icon={require('../../assets/imgs/icon_denied.png')}
              onClick={() => {declineFriendRequest(otherUserId)}} />
          </div>
        </div>
        <Popup isVisible={visible} onClose={() => setVisible(false)}>
          <Profil />
        </Popup>
      </div>
    );
  }
  return (
    <div className='notif'>
      <div className='bar' />
      <div onClick={() => onclick()
        } className='container'>
        <div className='username'>
          {!notifMsg?.priv_msg ? (<p>Vous avez recu un message sur <span style={{fontWeight: 'bold', color: '#459DD3'}}>{notifMsg?.channel_name}</span></p>) :
            (<p> Vous avez recu un message de <span style={{fontWeight: 'bold', color: '#459DD3'}} >{notifMsg?.sender_username} </span> </p>)}
        </div>
      </div>
    </div>
  );
};

export default NotifCard;