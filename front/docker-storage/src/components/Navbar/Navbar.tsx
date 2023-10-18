import React, { CSSProperties, useEffect, useState } from 'react';
import { GameInvites, Popup, Profil, RoundButton, Settings } from '..';
import Cookies from 'js-cookie';
import { Fetch } from '../../utils';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import { IUser, NotifMsg } from '../../utils/interfaces';
import NotifCard from './notifCard';

const Navbar: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [profileVisible, setProfileVisible] = useState<boolean>(false);
  const [notifsVisible, setNotifsVisible] = useState<boolean>(false);
  const [notifs, setNotifs] = useState<Array<IUser>>([]);
  const [notifsMsg, setNotifsMsg] = useState<Array<NotifMsg>>([]);
  const { user, socket } = useUserContext();
  const { recvInvitesFrom } = useFriendsRequestContext();

  const showNotif = () => {
    setNotifsVisible(!notifsVisible);
  };

  const logout = async () => {
    socket?.disconnect();
    Cookies.remove('jwtToken');
    window.location.replace('/login');
  };

  // get msgs on login
  const getNotifMsg = async () => {
    const MsgsUnread: NotifMsg[] = [];
    const channels = (await Fetch('channel/public_all', 'GET'))?.json;
    if (!channels) return;

    channels.forEach(async (chan: any) => {
      console.log('chan : ', chan);
      const msgs = (await Fetch('channel/msg/' + chan.id, 'GET'))?.json;
        console.log('msg: ', msgs[msgs.length-1]?.message_createdAt);
        console.log('lastmsg: ', user?.last_msg_date);
      if (user?.last_msg_date && msgs[msgs.length-1]?.message_createdAt > user?.last_msg_date)
        MsgsUnread.push(msgs[msgs.length]);
    });
    return MsgsUnread;
  }

  // recv msg instant
  useEffect(() => {
    const onNotifMsg = (data: any) => {
      if (user?.id !== data.sender_id)
        setNotifsMsg([...notifsMsg, data]);
    }
    socket?.on('notifMsg', onNotifMsg);
    return (() => {
      socket?.off('notifMsg', onNotifMsg);
    })
  }, [socket])

  useEffect(() => {
    const setNotif = async () => {
      if (!recvInvitesFrom)
        return;
      const tmp = recvInvitesFrom.map(async (from) => {
        return (await Fetch(`user/get_public_profile_by_id/${from}`, 'GET'))?.json;
      });
      try {
        if (!tmp) {
          setNotifsVisible(false);
          return;
        }
        const res = await Promise.all(tmp);
        setNotifs(res);
        // const msgs = await getNotifMsg();
        // if (msgs)
        // setNotifsMsg(msgs)
      } catch (e) {
        console.log(e);
      }
    };
    setNotif();
  }, [recvInvitesFrom.length, socket]);

  const mobile = window.innerWidth < 500;

  const navbarStyle: CSSProperties = {
    top: 0,
    right: 0,
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row-reverse',
    borderRadius: '30px',
    zIndex: 111,
  };

  const notifbadge: CSSProperties = {
    position: 'absolute',
    width: '20px',
    height: '20px',
    top: '20px',
    background: 'red',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  };

  const notifstyle: CSSProperties = {
    border: '1px solid red',
    maxHeight: '500px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    right: mobile ? 0 : 200,
    minHeight: '100%',
    background: 'black',
  };

  return (
    <>
      <div style={navbarStyle}>
        <div>
          <div style={{ display: 'flex', background: 'black', borderRadius: '0 0 0 30px' }}>
            {notifs.length > 0 && <div style={notifbadge}>{notifs.length + notifsMsg.length}</div>}
            <RoundButton
              icon={require('../../assets/imgs/icon_notif.png')}
              icon_size={50}
              onClick={() => showNotif()}
            />
            <RoundButton
              icon={user?.urlImg ? user.urlImg : require('../../assets/imgs/icon_user.png')}
              icon_size={50}
              onClick={() => setProfileVisible(!profileVisible)}
            />
            <RoundButton
              icon={require('../../assets/imgs/icon_setting.png')}
              icon_size={50}
              onClick={() => setSettingsVisible(!settingsVisible)}
            />
            <RoundButton
              icon={require('../../assets/imgs/icon_logout.png')}
              icon_size={50}
              onClick={() => logout()}
            />
          </div>
          {notifsVisible &&
            <div style={notifstyle}>
              {notifs.map((notif) => (
                <div key={notif.id}><NotifCard notifFriends={notif} otherUserId={notif.id} /></div>
              ))}
              {notifsMsg.map((notifmsg) => (
                <div key={notifmsg.id+'a'}><NotifCard notifMsg={notifmsg} otherUserId={notifmsg.id} /></div>
              ))}
            </div>}
        </div>
      </div>
      <GameInvites />
      <Popup isVisible={settingsVisible} setIsVisible={setSettingsVisible}>
        <Settings isVisible={settingsVisible} />
      </Popup>
      <Popup isVisible={profileVisible} setIsVisible={setProfileVisible}>
        <Profil otherUser={user} />
      </Popup>
    </>
  );
};

export default Navbar;
