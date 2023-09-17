import Cookies from 'js-cookie';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwitchToggle from './switchToggle';
import {
  Modifications,
  UserInfosForSetting,
  SettingsProps,
} from '../../utils/interfaces';

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const jwtToken = Cookies.get('jwtToken');
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordType, setPasswordType] = useState('password'); // Type initial : password
  const [userInfosSettings, setUserInfosSettings] =
    useState<UserInfosForSetting>();
  const [modifData, setModifData] = useState<Modifications>({
    urlImg: '',
    password: '',
    confirmpwd: '',
    is2fa_active: false, // TODO : set en fonction UserInfosForSetting.is2fa_active (psa la le bug c'est que si c'est tru chez le user et que je save sans rien faire, ca le save en false)
  });

  const unlockPwd = () => {
    setIsDisabled(false);
    setShowConfirmPassword(true);
  };

  const lockPwd = () => {
    setIsDisabled(true);
    setShowConfirmPassword(false);
  }

  const toggleLock = () => {
    if (!isDisabled)
      lockPwd();
    else
      unlockPwd();
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  useEffect(() => {
    const getUserInfos = async () => {
      const rep = await fetch('http://localhost:3001/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (rep.ok) {
        const user = await rep.json();
        setUserInfosSettings(user);
      } else {
        // si je delete le cookie du jwt
        navigate('/login');
        alert('Vous avez été déconnecté');
      }
    };
    if (jwtToken) getUserInfos(); // appel de la fonction si le jwt est good
  }, [jwtToken]);

  // MODIFICATIONS

  const saveModifications = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jwtToken = Cookies.get('jwtToken');
    if (!jwtToken) {
      navigate('/login');
      alert(`Vous avez ete déconnecté car vous n'êtes pas authorisé`);
    }
    if (
      modifData.confirmpwd === '' &&
      modifData.password === '' &&
      modifData.urlImg === '' &&
      modifData.is2fa_active === userInfosSettings?.is2fa_active
    )
      // nothing changed
      return;

    // PASSWORD :
    if (!isDisabled) {
      if (modifData.password == '' || modifData.confirmpwd == '')
        return setErrorMessage('les passwords ne correspondent pas !');
      if (
        modifData.password !== undefined &&
        modifData.password !== modifData.confirmpwd
      ) {
        return setErrorMessage('les passwords ne correspondent pas !');
      } else {
        const response = await fetch(
          'http://localhost:3001/api/user/update_password', // PATCH update_password
          {
            method: 'PATCH',
            body: JSON.stringify({
              password: modifData.password,
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
          },
        );
        if (response.ok) {
          const user = await response.json();
          console.log('MDP changed : ', user.password);
          setUserInfosSettings(user);
        } else {
          navigate('/login');
          alert(`Vous avez ete déconnecté car vous n'êtes pas authorisé`);
          // ou recreer un jwt ?
        }
        lockPwd();
        setErrorMessage('');
      }
    }
    if (
      modifData.is2fa_active === userInfosSettings?.is2fa_active &&
      modifData.urlImg === userInfosSettings.urlImg
    ) {
      console.log('\n\n=====verif OK');
      setIsDisabled(true);
      setShowConfirmPassword(false);
      return;
    }

    const rep = await fetch(
      'http://localhost:3001/api/user', // PATCH
      {
        method: 'PATCH',
        body: JSON.stringify({
          is2fa_active: modifData.is2fa_active,
          urlImg: modifData.urlImg,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
    if (rep.ok) {
      const user = await rep.json();
      console.log('2fa & urlImg changed : ', user.is2fa_active, user.urlImg);
      setUserInfosSettings(user);
    } else {
      navigate('/login');
      alert('Vous avez été déconnecté');
      // ou recreer un jwt
    }
    lockPwd();
    setErrorMessage('');
  };

  return (
    <div>
      <form onSubmit={saveModifications} style={settingsStyle}>
        <p>{userInfosSettings?.username}</p>
        <div style={modifContainer}>
          {' '}
          {/* IMG ==> TODO */}
          <img style={imgStyle} src={userInfosSettings?.urlImg} alt="" />
          <input
            type="file"
            onChange={(e) =>
              setModifData({
                ...modifData,
                urlImg: e.target.value,
              })
            }
          />
        </div>
        <div style={modifContainer}>
          {' '}
          {/* PWD ==> ok */}
          <input
            type={passwordType}
            onChange={(e) =>
              setModifData({
                ...modifData,
                password: e.target.value,
              })
            }
            disabled={isDisabled}
            placeholder="password"
          />
          {showConfirmPassword && (
            <div style={modifContainer}>
              <input
                type={passwordType}
                onChange={(e) =>
                  setModifData({
                    ...modifData,
                    confirmpwd: e.target.value,
                  })
                }
                placeholder="Confirm Password"
              />
            </div>
          )}
          {showConfirmPassword && (
            <button type="button" onClick={togglePasswordVisibility}>
              {passwordType === 'password' ? 'Afficher' : 'Masquer'}
            </button>
          )}
          <button type="button"  onClick={toggleLock}>
           {isDisabled ? 'Modifier' : 'Verouiller'}
          </button>
        </div>
        <div style={modifContainer}>
          {' '}
          {/* 2FA ==> ok */}
          <p>2FA</p>
          <SwitchToggle
            onChange={(change) =>
              setModifData({ ...modifData, is2fa_active: change })
            }
            checked={userInfosSettings?.is2fa_active || false}
          />
          {/*recup l'etat de base du 2fa*/}
        </div>
        {errorMessage && (
          <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
        )}
        <button type="submit">Enregistrer</button>
        <button onClick={onClose}>Fermer</button>
      </form>
    </div>
  );
};

const imgStyle: React.CSSProperties = {
  width: '100px',
  border: '1px solid red',
};

const settingsStyle: React.CSSProperties = {
  alignItems: 'center',
  width: '400px',
  display: 'flex',
  flexDirection: 'column',
  background: 'grey',
  border: '1px solid black',
  color: 'white',
  margin: '10px',
  padding: '10px',
  cursor: 'pointer',
};

const modifContainer: React.CSSProperties = {
  display: 'flex',
};

export default Settings;
