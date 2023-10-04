import React, { CSSProperties, useEffect, useState } from 'react';
import { RoundButton, Settings, Profil, Popup, GameInvites } from '..';
import Cookies from 'js-cookie';
import { Fetch } from '../../utils';
import { useUserContext } from '../../contexts';
import { IUser } from '../../utils/interfaces';
import NotifCard from './notifCard'
import { useFriendsRequestContext } from '../../contexts/FriendsRequestContext/FriendsRequestContext';


const Navbar: React.FC = () => {
  const jwtToken = Cookies.get('jwtToken');
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);
  const [notifsVisible, setNotifsVisible] = useState<boolean>(false);
  const { user } = useUserContext();
  const { recvInvitesFrom } = useFriendsRequestContext();
  const [notifs, setNotifs] = useState<Array<IUser>>([])

  const showNotif = () => {
    setNotifsVisible(!notifsVisible);
  }

  const logout = async () => {
    const res = await fetch('http://localhost:3001/api/user/logout', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'appsetNotifsVisiblelication/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (res.ok) {
      Cookies.remove('jwtToken');
      window.location.replace('/login');
    } else {
      console.log(res.status);
    }
  };

  // delog the user if he close the navigator without click in logout button
  useEffect(() => {
    const handleBeforeUnload = () => {
      logout();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line
  }, [profilVisible]);

  // todo: refresh notifbadge quand on handle les notifs
  // todo2: mettre des notifs badge sur le contacts pannel et sur les categorties approprie (friends, users...)
  const setNotif = async () => {
    let tmp = user?.recvInvitesFrom.map(async (from, index) => {
      return (await Fetch(`user/get_public_profile_by_id/${from}`, 'GET'))?.json;
    })
    try {
      if (!tmp) {
        setNotifsVisible(false);
        return;
      }
      let res = await Promise.all(tmp);
      setNotifs(res as IUser[]);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setNotif();
    notifs.length === 0 ? setNotifsVisible(false) : setNotifsVisible(true);
    // eslint-disable-next-line
  }, [recvInvitesFrom])

  return (
    <>
      <div style={navbarStyle}>
        <div>
          <div style={{display: 'flex', background: 'black', borderRadius: '0 0 0 30px'}}>
            {notifs.length > 0 && <div style={notifbadge}>{notifs.length}</div>}
            <RoundButton
              icon={require('../../assets/imgs/icon_notif.png')}
              icon_size={50}
              onClick={() => showNotif()}
            />
            <RoundButton
              icon={user?.urlImg ? user.urlImg : require('../../assets/imgs/icon_user.png')}
              icon_size={50}
              onClick={() => setProfilVisible(!profilVisible)}
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
          {notifsVisible && notifs.length > 0 &&
            <div style={notifstyle}>
              {notifs.map((notif) => (
                <div key={notif.id}><NotifCard notif={notif} otherUser={notif} /></div>
              ))}
            </div>}
          <Popup isVisible={settingsVisible} setIsVisible={setSettingsVisible}>
            <Settings isVisible={settingsVisible} />
          </Popup>
          <Popup isVisible={profilVisible} setIsVisible={setProfilVisible}>
            <Profil otherUser={user} />
          </Popup>
        </div>

      </div>
      <GameInvites></GameInvites>
      <Popup isVisible={settingsVisible} setIsVisible={setSettingsVisible}>
        <Settings isVisible={settingsVisible} />
      </Popup>
      <Popup isVisible={profilVisible} setIsVisible={setProfilVisible}>
        <Profil otherUser={user} />
      </Popup>
    </>
  );
};

const navbarStyle: CSSProperties = {
  top: '-1px',
  right: '-1px',
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
  alignContent: 'center'
}

const notifstyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '90px',
  right: '200px',
  minHeight: '100%',
  width: '300px',
}

export default Navbar;
