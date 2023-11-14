import { IUser, NotifMsg } from '../../utils/interfaces';
import './stylenavbar.css';
import { RoundButton } from '../ComponentBase/RoundButton';
import { useFriendsRequestContext, useUserContext, useUIContext } from '../../contexts';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Fetch } from '../../utils';
import { SetCurrChan, UpdateChannelMessage, UpdateChannelUsers } from '../../utils/channel_functions';
import { publish } from '../../utils/event';

const NotifCard = ({ notifFriends, notifMsg, setNotifsMsg, notifsMsg, otherUserId }: { notifFriends?: IUser, notifMsg?: NotifMsg, setNotifsMsg?: Dispatch<SetStateAction<NotifMsg[]>>, notifsMsg?: NotifMsg[], otherUserId: number }) => {
  const { acceptFriendRequest, declineFriendRequest, recvInvitesFrom } = useFriendsRequestContext();
  const { setIsProfileOpen } = useUIContext();
  const [usr, setUsr] = useState<IUser>();
  const { socket } = useUserContext()

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
    if (!usr || !notifMsg) return;
    const chan_id = notifMsg?.channel_id;
    UpdateChannelMessage(chan_id);
    UpdateChannelUsers(chan_id);
    SetCurrChan(name);
    socket?.emit('join', { channel: name });
    publish('open_chat', undefined);
  }

  const onclick = async () => {
    if (!usr || !notifMsg) return;
    if (setNotifsMsg && notifsMsg)
      setNotifsMsg(notifsMsg.filter((el) => el.channel_id !== notifMsg.channel_id));
    if (!(await Fetch('user/is_in_channel/' + notifMsg.channel_id, 'GET'))?.json) return;
    OnJoinChannel(notifMsg.channel_name);
  }

  if (recvInvitesFrom.includes(otherUserId)) {
    return (
      <div className='notif'>
        <div className='bar' />
        <div className='container'>
          <div className='username'>
            {notifFriends && <RoundButton icon={notifFriends.urlImg} onClick={() => {setIsProfileOpen(otherUserId)}} />}<p><span style={{ fontWeight: 'bold', color: '#459DD3' }}>{notifFriends?.pseudo}</span> vous a demande en ami</p>
          </div>
          <div className='btn'>
            <RoundButton icon={require('../../assets/imgs/icon_accept.png')}
              onClick={() => { acceptFriendRequest(otherUserId) }} />
            <RoundButton icon={require('../../assets/imgs/icon_denied.png')}
              onClick={() => { declineFriendRequest(otherUserId) }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='notif'>
      <div className='bar' />
      <div onClick={() => onclick()
      } className='container'>
        <div className='username'>
          {!notifMsg?.priv_msg ? (<p>Vous avez recu un message sur <span style={{ fontWeight: 'bold', color: '#459DD3' }}>{notifMsg?.channel_name}</span></p>) :
            (<p> Vous avez recu un message de <span style={{ fontWeight: 'bold', color: '#459DD3' }} >{notifMsg?.sender_pseudo} </span> </p>)}
        </div>
      </div>
    </div>
  );
};

export default NotifCard;