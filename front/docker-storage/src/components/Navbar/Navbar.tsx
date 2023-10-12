import React, { CSSProperties, useEffect, useState } from 'react';
import { GameInvites, Popup, Profil, RoundButton, Settings } from '..';
import Cookies from 'js-cookie';
import { Fetch } from '../../utils';
import { useUserContext } from '../../contexts';
import { IUser } from '../../utils/interfaces';
import NotifCard from './notifCard';
import { useFriendsRequestContext } from '../../contexts';

const Navbar: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [profileVisible, setProfileVisible] = useState<boolean>(false);
  const [notifsVisible, setNotifsVisible] = useState<boolean>(false);
  const [notifs, setNotifs] = useState<Array<IUser>>([]);
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
        setNotifs(res as IUser[]);
      } catch (e) {
        console.log(e);
      }
    };
    setNotif();
  }, [recvInvitesFrom]);

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
                <div key={notif.id}><NotifCard notif={notif} otherUser={notif} /></div>
              ))}
            </div>}
        </div>
      </div>

      <GameInvites></GameInvites>
      <Popup isVisible={settingsVisible} setIsVisible={setSettingsVisible}>
        <Settings isVisible={settingsVisible} />
      </Popup>
      <Popup isVisible={profileVisible} setIsVisible={setProfileVisible}>
        <Profil otherUser={user} />
      </Popup>
    </>
  );
};

const navbarStyle: CSSProperties = {
  top: '0px',
  right: '0px',
  position: 'fixed',
  display: 'flex',
  flexDirection: 'row-reverse',
  borderRadius: '30px',
  zIndex: '10000',
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
  top: '90px',
  right: '200px',
  minHeight: '100%',
  background: 'black',
};

export default Navbar;
