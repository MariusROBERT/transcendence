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
  const [notifsMsg, setNotifsMsg] = useState<Array<NotifMsg>>([]);
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
        if (!uniqueSenders.has(msg.sender_id)) {
          uniqueSenders.add(msg.sender_id);
          return true;
        }
        return false;
      });
      setMsgs(uniqueMsgs);
    }
    getAllUnreadMsg();
    console.log('eeewsh : ', msgs);

  }, [socket])

  // recv msg instant
  useEffect(() => {
    const onNotifMsg = (data: NotifMsg) => {

      if (user?.id !== data.sender_id) {
        if (notifsMsg.length === 0) {
          notifsMsg.push(data);
        } else {
          let bool = true;
          notifsMsg.forEach((el) => { if (el.sender_id === data.sender_id) bool = false; })
          if (bool) notifsMsg.push(data);
        }
        setNotifsMsg(notifsMsg);
      }
    }
    socket?.on('notifMsg', onNotifMsg);
    return (() => {
      socket?.off('notifMsg', onNotifMsg);
    })
  }, [socket])

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
            {(notifsMsg.length > 0 || notifs.length > 0 || msgs.length > 0) ? (
              <div style={{ border: '3px solid green', borderRadius: '50%' }}>
                <RoundButton
                  icon={require('../../assets/imgs/icon_notif.png')}
                  icon_size={50}
                  onClick={() => showNotif()}
                />
              </div>
            ) : (
              <div style={{ border: '3px solid transparent', borderRadius: '50%' }}>
                <RoundButton
                  icon={require('../../assets/imgs/icon_notif.png')}
                  icon_size={50}
                  onClick={() => showNotif()}
                />
              </div>
            )}
            <RoundButton
              icon={user?.urlImg ? user.urlImg : require('../../assets/imgs/icon_user.png')}
              icon_size={50}
              onClick={() => {
                if (settingsVisible)
                  setSettingsVisible(false);
                setProfileVisible(!profileVisible);
              }}
            />
            <RoundButton
              icon={require('../../assets/imgs/icon_setting.png')}
              icon_size={50}
              onClick={() => {
                if (profileVisible)
                  setProfileVisible(false);
                setSettingsVisible(!settingsVisible);
              }}
            />
            <RoundButton
              icon={require('../../assets/imgs/icon_logout.png')}
              icon_size={50}
              onClick={() => logout()}
            />
          </div>
          {notifsVisible &&
            <div style={notifstyle}>
              {notifs.map((notif, index) => (
                <div key={index}><NotifCard notifFriends={notif} otherUserId={notif?.id} /></div>
              ))}
              {notifsMsg.map((notifmsg, index) => (
                <div key={index}><NotifCard notifMsg={notifmsg} setNotifsMsg={setNotifsMsg} notifsMsg={notifsMsg} otherUserId={notifmsg?.sender_id} /></div>
              ))}
              {msgs.filter((msg) => {
                notifsMsg.forEach((el) => {
                  msg.sender_id === el.sender_id
                })
              })
                .map((msg, index) => (
                  <div key={index}><NotifCard notifMsg={msg} setNotifsMsg={setMsgs} notifsMsg={msgs} otherUserId={msg?.sender_id} /></div>
                ))}
            </div>}
        </div>
      </div>
      <GameInvites />
      <Settings isVisible={settingsVisible} setIsVisible={setSettingsVisible} />
      <Profil otherUser={user} isVisible={profileVisible} setIsVisible={setProfileVisible} />
    </>
  );
};

export default Navbar;
