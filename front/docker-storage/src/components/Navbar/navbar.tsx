import React, { CSSProperties, useEffect, useState } from 'react';
import Settings from '../Settings/settings';
import { RoundButton } from '../RoundButton/RoundButton';
import { IUserComplete } from '../../utils/interfaces';
import Profil from '../Profil/profil';
import Cookies from 'js-cookie';
import Popup from '../ComponentBase/Popup';

interface Props {
  meUser: IUserComplete | undefined;
}

const Navbar: React.FC<Props> = ({ meUser }) => {
  const jwtToken = Cookies.get('jwtToken');
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);

  const logout = async () => {
    const res = await fetch('http://localhost:3001/api/user/logout', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
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
  }, [profilVisible]);

  return (
    <>
      <div style={navbarStyle}>
        <RoundButton
          icon={require('../../assets/imgs/icon_setting.png')}
          icon_size={50}
          onClick={() => setSettingsVisible(!settingsVisible)}
        />
        <Popup isVisible={settingsVisible} setIsVisible={setSettingsVisible}>
          <Settings isVisible={settingsVisible}/>
        </Popup>
        <RoundButton
          icon={require('../../assets/imgs/icon_user.png')}
          icon_size={50}
          onClick={() => setProfilVisible(!profilVisible)}
        />
        <Popup isVisible={profilVisible} setIsVisible={setProfilVisible}>
          <Profil otherUser={meUser} meUser={meUser} />
        </Popup>
        <RoundButton
          icon={require('../../assets/imgs/icon_logout.png')}
          icon_size={50}
          onClick={() => logout()}
        />
      </div>
    </>
  );
};

const navbarStyle: CSSProperties = {
  top: '20px',
  position: 'absolute',
  display: 'flex',
  width: '250px',
  justifyContent: 'space-around',
};

export default Navbar;
