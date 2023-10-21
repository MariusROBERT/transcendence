import React, { CSSProperties, useEffect, useState } from 'react';
import { GameInvites, Profil, RoundButton, Settings } from '..';
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
  const { user, socket, id } = useUserContext();
  const { recvInvitesFrom } = useFriendsRequestContext();
  const [msgs, setMsgs] = useState<Array<NotifMsg>>([])

  const logout = async () => {
    socket?.disconnect();
    Cookies.remove('jwtToken');
    window.location.replace('/login');
  };

  const showNotif = () => {
    setNotifsVisible(!notifsVisible);
  };

  useEffect(() => {
    const getAllUnreadMsg = async () => {
      if (id !== user?.id) return
      const response = await fetch(`http://localhost:3001/api/msgsUnread/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const msgs = await response.json();
      const uniqueSenders = new Set();
      const uniqueMsgs = msgs.filter((msg: any) => {
        if (!uniqueSenders.has(msg.channel_id)) {
          uniqueSenders.add(msg.channel_id);
          return true;
        }
        return false;
      });
      setMsgs(uniqueMsgs);
    }
    getAllUnreadMsg();
  }, [socket])

  // recv msg instant
  useEffect(() => {
    const onNotifMsg = async (data: NotifMsg) => {
      if (msgs.some((msg) => msg.channel_id === data.channel_id))
        return;
      if (id === data.sender_id)
        return;
      setMsgs([...msgs, data]);
    }

    socket?.on('notifMsg', onNotifMsg);
    return (() => {
      socket?.off('notifMsg', onNotifMsg);
    })
  }, [socket, msgs])

  // friends request
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
      } catch (e) {
        console.log(e);
      }
    };
    setNotif();
  }, [recvInvitesFrom.length, socket]);

  const navbarStyle: CSSProperties = {
    top: '150px',
    right: '50%',
    transform: 'translate(50%, 50%)',
    width: '400px',
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-around',
    borderRadius: '30px',
    zIndex: 111,
  };

  const notifstyle: CSSProperties = {
    maxHeight: '500px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '120px',
    minHeight: '100%',
    background: 'transparent',
  };

  return (
    <>
      <div style={navbarStyle}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', borderRadius: '0 0 0 30px' }}>
          <RoundButton
            icon={user?.urlImg ? user.urlImg : require('../../assets/imgs/profile-svgrepo-com.png')}
            icon_size={70}
            onClick={() => {
              if (settingsVisible)
                setSettingsVisible(false);
              setProfileVisible(!profileVisible);
            }}
          />
          {(notifs.length > 0 || msgs.length > 0) ? (
            <div style={{ border: '3px solid green', borderRadius: '50%' }}>
              <RoundButton
                icon={require('../../assets/imgs/notification-13-svgrepo-com.png')}
                icon_size={70}
                onClick={() => showNotif()}
              />
            </div>
          ) : (
            <div style={{ border: '3px solid transparent', borderRadius: '50%' }}>
              <RoundButton
                icon={require('../../assets/imgs/notification-13-svgrepo-com.png')}
                icon_size={70}
                onClick={() => showNotif()}
              />
            </div>
          )}
          <RoundButton
            icon={require('../../assets/imgs/settings-svgrepo-com.png')}
            icon_size={70}
            onClick={() => {
              if (profileVisible)
                setProfileVisible(false);
              setSettingsVisible(!settingsVisible);
            }}
          />
          <RoundButton
            icon={require('../../assets/imgs/logout-svgrepo-com.png')}
            icon_size={70}
            onClick={() => logout()}
          />
        </div>
        {notifsVisible &&
          <div style={notifstyle}>
            {notifs.map((notif, index) => (
              <div key={index}><NotifCard notifFriends={notif} otherUserId={notif?.id} /></div>
            ))}
            {msgs
              .map((msg, index) => (
                msg.priv_msg ? (
                  <div key={index}><NotifCard notifMsg={msg} setNotifsMsg={setMsgs} notifsMsg={msgs} otherUserId={msg?.sender_id} /></div>
                ) : (
                  <div key={index}><NotifCard notifMsg={msg} setNotifsMsg={setMsgs} notifsMsg={msgs} otherUserId={msg?.channel_id} /></div>
                )
              ))}
          </div>}
      </div>
      <GameInvites />
      <Settings isVisible={settingsVisible} setIsVisible={setSettingsVisible} />
      <Profil otherUser={user} isVisible={profileVisible} setIsVisible={setProfileVisible} />
    </>
  );
};

export default Navbar;
