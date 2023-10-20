import React, { CSSProperties, useEffect, useState } from 'react';
import { GameInvites, RoundButton, } from '..';
import Cookies from 'js-cookie';
import { Fetch } from '../../utils';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import { IUser } from '../../utils/interfaces';
import NotifCard from './notifCard';
import { useUIContext } from '../../contexts/UIContext/UIContext';

const Navbar: React.FC = () => {
  const { isProfileOpen, setIsProfileOpen, isSettingsOpen, setIsSettingsOpen } = useUIContext();
  const [notifsVisible, setNotifsVisible] = useState<boolean>(false);
  const [notifs, setNotifs] = useState<Array<IUser>>([]);
  const { user, socket, id } = useUserContext();
  const { recvInvitesFrom } = useFriendsRequestContext();

  const showNotif = () => {
    setNotifsVisible(!notifsVisible);
  };

  const logout = async () => {
    socket?.disconnect();
    Cookies.remove('jwtToken');
    window.location.replace('/login');
  };

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
        setNotifs(res as IUser[]);
      } catch (e) {
        console.log(e);
      }
    };
    setNotif();
  }, [recvInvitesFrom]);

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
              onClick={() => {
                if (isSettingsOpen)
                  setIsSettingsOpen(false);
                setIsProfileOpen(id);
              }}
            />
            <RoundButton
              icon={require('../../assets/imgs/icon_setting.png')}
              icon_size={50}
              onClick={() => {
                if (isProfileOpen)
                  setIsProfileOpen(0);
                setIsSettingsOpen(true);
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
              {notifs.map((notif) => (
                <div key={notif.id}><NotifCard notif={notif} otherUser={notif} /></div>
              ))}
            </div>}
        </div>
      </div>
      <GameInvites />
    </>
  );
};

export default Navbar;
