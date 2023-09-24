import Cookies from 'js-cookie';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwitchToggle from './switchToggle';
import { Modifications, UserInfosForSetting } from '../../utils/interfaces';
import { Fetch } from '../../utils';

interface Props {
  isVisible: boolean;
}

const Settings: React.FC<Props> = ({ isVisible }) => {
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken) {
    navigate('/login');
    alert('Vous avez été déconnecté');
  }
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [userInfosSettings, setUserInfosSettings] = useState<UserInfosForSetting>();
  const [modifData, setModifData] = useState<Modifications>({
    urlImg: '',
    password: '',
    confirmpwd: '',
    is2fa_active: false, // TODO : set en fonction UserInfosForSetting.is2fa_active (psa la le bug c'est que si c'est tru chez le user et que je save sans rien faire, ca le save en false)
  });
  const [qrCode2fa, setQrCode2fa] = useState<string>('');

  const unlockPwd = () => {
    setIsDisabled(false);
    setShowConfirmPassword(true);
  };

  const lockPwd = () => {
    setIsDisabled(true);
    setShowConfirmPassword(false);
  };

  const toggleLock = () => {
    if (!isDisabled)
      lockPwd();
    else unlockPwd();
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  useEffect(() => {
    const getUserInfos = async () => {
      const user = (await Fetch('user', 'GET'))?.json;
      if (user) {
        setUserInfosSettings(user);
      } else {
        // si je delete le cookie du jwt
        navigate('/login');
        alert('Vous avez été déconnecté');
      }
    };
    getUserInfos();
  }, [isVisible]);

  // MODIFICATIONS

  const saveModifications = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jwtToken = Cookies.get('jwtToken');
    if (!jwtToken) {
      navigate('/login');
      alert('You have been disconnected \n(your Authorisation Cookie has been modified or deleted)');
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
      if (modifData.password === '' || modifData.confirmpwd === '')
        return setErrorMessage('passwords doesn\'t match !');
      if (modifData.password !== undefined && modifData.password !== modifData.confirmpwd)
        return setErrorMessage('passwords doesn\'t match !');
      else {
        const user = (await Fetch('user/update_password', 'PATCH',
          JSON.stringify({ password: modifData.password })))?.json;
        if (user) {
          //console.log('MDP changed : ', user.password);
          setUserInfosSettings(user);
        }
        lockPwd();
        setErrorMessage('');
      }
    }
    if (
      modifData.is2fa_active === userInfosSettings?.is2fa_active &&
      modifData.urlImg === userInfosSettings?.urlImg
    ) {
      setIsDisabled(true);
      setShowConfirmPassword(false);
      return;
    }

    const user = (await Fetch('user', 'PATCH',
      JSON.stringify({
        is2fa_active: modifData.is2fa_active,
        urlImg: modifData.urlImg,
      })))?.json;
    if (user) {
      //console.log('2fa & urlImg changed : ', user.is2fa_active, user.urlImg);
      setUserInfosSettings(user);
    }
    if (user?.is2fa_active)
      setQrCode2fa(user.qrCode);
    lockPwd();
    setErrorMessage('');
  };

  return (
    <div>
      <form onSubmit={saveModifications} style={settingsStyle}>
        <p>{userInfosSettings?.username}</p>
        <div style={modifContainer}>
          <img style={imgStyle} src={userInfosSettings?.urlImg} alt='' />
          <input
            type='file'
            onChange={(e) =>
              setModifData({
                ...modifData,
                urlImg: e.target.value,
              })
            }
          />
        </div>
        <div style={modifContainer}>
          <input
            type={passwordType}
            onChange={(e) =>
              setModifData({
                ...modifData,
                password: e.target.value,
              })
            }
            disabled={isDisabled}
            placeholder='password'
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
                placeholder='Confirm Password'
              />
            </div>
          )}
          {showConfirmPassword && (
            <button type='button' onClick={togglePasswordVisibility}>
              {passwordType === 'password' ? 'Afficher' : 'Masquer'}
            </button>
          )}
          <button type='button' onClick={toggleLock}>
            {isDisabled ? 'Modifier' : 'Verouiller'}
          </button>
        </div>
        <div style={modifContainer}>
          <p>2FA</p>
          <SwitchToggle
            onChange={(change) =>
              setModifData({ ...modifData, is2fa_active: change })
            }
            checked={userInfosSettings?.is2fa_active || false} // Obliger de mettre "ou false" psq : Type 'boolean | undefined' is not assignable to type 'boolean'...
          />
        </div>
        {errorMessage && (
          <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
        )}
        <button type='submit'>Enregistrer</button>
      </form>
      {qrCode2fa &&
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          backgroundColor: 'rgba(70,70,70,0.5)',
          height: '100vh',
          width: '100vw',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', alignContent: 'space-evenly', flexDirection: 'column' }}>
            <p style={{ backgroundColor: 'darkgrey', padding: '1em', borderRadius: 5 }}>
              Scan this QrCode in your favorite 2fa application
            </p>
            <img src={qrCode2fa} alt='qrCode2fa' />
            <button id={'2faDone'} onClick={() => setQrCode2fa('')} style={{ display: 'none' }}></button>
            <label htmlFor={'2faDone'}>
              <p style={{ backgroundColor: 'darkgrey', padding: '.7em', borderRadius: 5 }}>Done</p>
            </label>
          </div>
        </div>
      }
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
