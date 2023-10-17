import React, { CSSProperties, useEffect, useState } from 'react';
import { GameInvites, Popup, Profil, RoundButton, Settings } from '..';
import Cookies from 'js-cookie';
import { Fetch } from '../../utils';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import { IUser, NotifInfos } from '../../utils/interfaces';
import NotifCard from './notifCard';

const Navbar: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [profileVisible, setProfileVisible] = useState<boolean>(false);
  const [notifsVisible, setNotifsVisible] = useState<boolean>(false);
  const [notifs, setNotifs] = useState<Array<NotifInfos>>([]);
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

  const getNotifMsg = async () => {
    const jwtToken = Cookies.get('jwtToken');
    const MsgsUnread: NotifInfos[] = [];
    const channels = (await Fetch('channel/public_all', 'GET'))?.json;
    if (!channels) return;
  
    console.log('channels : ', channels);
    const lastMsg = await fetch('http://localhost:3001/api/user/get_last_msg', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    console.log('ici = ', lastMsg);
    
    channels.forEach(async (chan: any) => {
      console.log('chan : ', chan);
      const msgs = (await Fetch('channel/msg/' + chan.id, 'GET'))?.json;
      console.log('msgs : ', msgs);
      // if (msgs && msgs[msgs.length].date > lastMsg)
      //   MsgsUnread.push(msgs[msgs.length]);
    });
    return MsgsUnread;
  }

  useEffect(() => {
    const setNotif = async () => {
      const tmp = recvInvitesFrom.map(async (from) => {
        return (await Fetch(`user/get_public_profile_by_id/${from}`, 'GET'))?.json;
      });
      try {
        if (!tmp) {
          setNotifsVisible(false);
          return;
        }
        const res = await Promise.all(tmp);
        setNotifs(res as NotifInfos[]);
        const msgs = await getNotifMsg();
        // if (msgs)
        //   setNotifs((prevNotifs) => [...prevNotifs, ...msgs])
      } catch (e) {
        console.log(e);
      }
    };
    setNotif();
  }, [recvInvitesFrom.length]);

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
            {notifs.length > 0 && <div style={notifbadge}>{notifs.length}</div>}
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
                <div key={notif.id}><NotifCard notif={notif} otherUserId={notif.id} /></div>
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
