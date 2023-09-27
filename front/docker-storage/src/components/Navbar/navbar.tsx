import { useState } from 'react';
import Settings from '../Settings/settings';
import { RoundButton } from '../RoundButton/RoundButton';
import { IUserComplete } from '../../utils/interfaces';
import Profil from '../Profil/profil';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface Props {
  meUser: IUserComplete | undefined;
}

const Navbar: React.FC<Props> = ({ meUser }) => {
  const jwtToken = Cookies.get('jwtToken');
  const navigate = useNavigate();
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);
// todo : mettre le Fetch
  const logout = () => {
    fetch('http://localhost:3001/api/auth/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(() => {
        Cookies.remove('jwtToken');
        navigate('/login');
      });
  };

  return (
    <>
      <div style={navbarStyle}>
        <RoundButton icon={require('../../assets/imgs/icon_setting.png')} icon_size={50}
                     onClick={() => setSettingsVisible(!settingsVisible)}></RoundButton>
        {settingsVisible && <Settings isVisible={settingsVisible} />}
        <RoundButton icon={require('../../assets/imgs/icon_user.png')} icon_size={50}
                     onClick={() => setProfilVisible(!profilVisible)}></RoundButton>
        {profilVisible &&
          <Profil otherUser={meUser} meUser={meUser} onClose={() => setProfilVisible(!profilVisible)} />}
        <RoundButton icon={require('../../assets/imgs/icon_logout.png')} icon_size={50}
                     onClick={() => logout()}></RoundButton>
      </div>
    </>
  );
};

const navbarStyle = {
  border: '1px solid black',
  display: 'flex',
};


export default Navbar;
