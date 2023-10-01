import React, { CSSProperties, useEffect, useState } from 'react';
import { RoundButton, Border, Background, Settings, Profil, Popup } from '..';
import { IUserComplete } from '../../utils/interfaces';
import Cookies from 'js-cookie';
import { color } from '../../utils';

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

  //TODO: [Raffi] reuse this in game

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
        <Border borderRadius={30} height={100} width={300} borderColor={color.black}>
          <Background flex_direction={'row'} flex_alignItems={'flex-end'} flex_justifyContent={'flex-start'}
                      bg_color={color.black}>
            <RoundButton
              icon={meUser?.urlImg ? meUser.urlImg : require('../../assets/imgs/icon_user.png')}
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
          <Popup isVisible={settingsVisible} setIsVisible={setSettingsVisible}>
            <Settings isVisible={settingsVisible} />
          </Popup>
          <Popup isVisible={profilVisible} setIsVisible={setProfilVisible}>
            <Profil otherUser={meUser} meUser={meUser} />
          </Popup>
        </Border>
      </div>
    </>
  );
};

const navbarStyle: CSSProperties = {
  top: '-40px',
  position: 'absolute',
  display: 'flex',
  justifyContent: 'space-around',
};

export default Navbar;
