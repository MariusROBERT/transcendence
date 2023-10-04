import React, { CSSProperties, useEffect, useState } from 'react';
import { RoundButton, Border, Background, Settings, Profil, Popup, GameInvites } from '..';
import Cookies from 'js-cookie';
import { color } from '../../utils';
import { useUserContext } from '../../contexts';

const Navbar: React.FC = () => {
  const jwtToken = Cookies.get('jwtToken');
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);
  const [notifsVisible, setNotifsVisible] = useState<boolean>(false);
  const { user } = useUserContext();

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

  // console.log(meUser)

  return (
    <>
      <div style={navbarStyle}>
        <Border borderRadius={30} height={85} width={220} borderColor={color.black} borderSize={0}>
          <Background flex_direction={'row'} flex_alignItems={'flex-end'} flex_justifyContent={'flex-start'} bg_color={color.black}>
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
          </Background>
          {notifsVisible &&
            <ul>
              {user?.recvInvitesFrom.map((number, index) => (
                <li key={index}>{number}</li>
              ))}
            </ul>}
          <Popup isVisible={settingsVisible} setIsVisible={setSettingsVisible}>
            <Settings isVisible={settingsVisible} />
          </Popup>
          <Popup isVisible={profilVisible} setIsVisible={setProfilVisible}>
            <Profil otherUser={user} />
          </Popup>
        </Border>
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
  top: '-25px',
  right: '0px',
  position: 'fixed',
  display: 'flex',
  flexDirection: 'row-reverse',
  zIndex: '10000',
};

const notifs: CSSProperties = {
  position: 'absolute',
  border: '1px solid red',
  top: '70px'
}

export default Navbar;
