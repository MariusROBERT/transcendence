import React, { CSSProperties, useState } from 'react';
import { RoundButton, Background, Settings, Profil, Popup, GameInvites } from '..';
import Cookies from 'js-cookie';
import { color } from '../../utils';
import { useUserContext } from '../../contexts';

const Navbar: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);
  const { user, socket } = useUserContext()
  const logout = async () => {
    socket?.disconnect();
    Cookies.remove('jwtToken');
    window.location.replace('/login');
  };

  return (
    <>
      <div style={navbarStyle}>
        <div style={BorderStyle}>
          <Background flex_direction={'row'} flex_alignItems={'flex-end'} flex_justifyContent={'flex-start'} bg_color={color.black}>
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

const BorderStyle: CSSProperties = {
  minWidth: 195 + 'px',
  minHeight: 55 + 'px',
  display: 'flex',
  borderRadius: '0px 0px 0px 30px',
  overflow: 'hidden',
  border: 0 + 'px',
};

const navbarStyle: CSSProperties = {
  top: '0px',
  right:'0px',
  position: 'fixed',
  display: 'flex',
  flexDirection: 'row-reverse',
  zIndex: '10000'
};

export default Navbar;
