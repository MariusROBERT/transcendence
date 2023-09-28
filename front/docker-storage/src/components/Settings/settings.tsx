import Cookies from 'js-cookie';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwitchToggle from './switchToggle';
import { Modifications, UserInfosForSetting } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { PasswordInput } from '../Input/PasswordInput';

interface Props {
  isVisible: boolean;
}

export function Settings(props: Props) {
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken) {
    navigate('/login');
    alert('Vous avez été déconnecté');
  }
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [userInfosSettings, setUserInfosSettings] =
    useState<UserInfosForSetting>();
  const [modifData, setModifData] = useState<Modifications>({
    img: '',
    password: '',
    confirmpwd: '',
    is2fa_active: false, // TODO : set en fonction UserInfosForSetting.is2fa_active (psa la le bug c'est que si c'est tru chez le user et que je save sans rien faire, ca le save en false)
  });
  const [qrCode2fa, setQrCode2fa] = useState<string>('');
  const [pictureError, setPictureError] = useState<string>('');
  const [newImage, setNewImage] = useState<string>('');
  const [code2fa, setCode2fa] = useState<string>('');
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  useEffect(() => {
    if (props.isVisible) {
      const getUserInfos = async () => {
        const user = (await Fetch('user', 'GET'))?.json;
        if (user) {
          setUserInfosSettings(user);
        } else {
          window.location.replace('http://localhost:3001/api/auth/login');
          // alert('Vous avez été déconnecté');
        }
      };
      getUserInfos();
    }
  }, [props.isVisible, navigate]);

  // MODIFICATIONS

  const saveModifications = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jwtToken = Cookies.get('jwtToken');
    if (!jwtToken) {
      window.location.replace('http://localhost:3001/api/auth/login');
      alert('You have been disconnected \n(your Authorisation Cookie has been modified or deleted)');
    }
    if (
      modifData.confirmpwd === '' &&
      modifData.password === '' &&
      modifData.img === '' &&
      modifData.is2fa_active === userInfosSettings?.is2fa_active
    )
      // nothing changed
      return;
    // PASSWORD :
    if (modifData.password === '' || modifData.confirmpwd === '')
      return setErrorMessage('passwords doesn\'t match !');
    if (modifData.password !== undefined && modifData.password !== modifData.confirmpwd)
      return setErrorMessage('passwords doesn\'t match !');
    else {
      const user = (await Fetch('user/update_password', 'PATCH',
        JSON.stringify({ password: modifData.password })))?.json;
      if (user) {
        setUserInfosSettings(user);
      }
      setErrorMessage('');
    }

    if (modifData.is2fa_active === userInfosSettings?.is2fa_active &&
      modifData.img === userInfosSettings?.urlImg) {
      setShowConfirmPassword(false);
      return;
    }

    // IMG :
    if (modifData.img !== '') {
      const formData = new FormData();
      formData.append('file', modifData.img);

      const user = await fetch(
        'http://localhost:3001/api/user/update_picture',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          body: formData,
        },
      ).then((r) => {
        if (r.ok) {
          setPictureError('');
          return r.json();
        }
        setPictureError('Error while uploading picture');
        return null;
      });
      if (user) {
        modifData.img = '';
        setUserInfosSettings(user);
      }
    }

    // 2FA :
    if (modifData.is2fa_active !== userInfosSettings?.is2fa_active) {
      const user = (
        await Fetch(
          'user',
          'PATCH',
          JSON.stringify({
            is2fa_active: modifData.is2fa_active,
          }),
        )
      )?.json;
      if (user) {
        setUserInfosSettings(user);
      }
      if (user?.is2fa_active) {
        setQrCode2fa(user.qrCode);
        setCode2fa(user.code2fa);
      }
    }
    setErrorMessage('');
  };

  return (
    <div>
      <form onSubmit={saveModifications} style={settingsStyle}>
        <p>{userInfosSettings?.username}</p>
        <div>
          <div style={modifContainerImage}>
            <img style={{
              ...imgStyle,
              borderColor: modifData.img === '' ? 'green' : 'orange',
            }} // green = synced with back, orange = not uploaded yet
                 src={newImage || userInfosSettings?.urlImg}
                 alt='user profile pic'
            />
            <input
              id={'image'}
              type="file"
              accept={'image/png, image/jpeg, image/jpg'}
              onChange={(event: ChangeEvent) => {
                const { files } = event.target as HTMLInputElement;
                if (files && files.length !== 0) {
                  if (files[0].size > 1024 * 1024 * 5) {
                    setPictureError('File is too big!');
                  } else {
                    setNewImage(URL.createObjectURL(files[0]));
                    setPictureError('');
                    setModifData({
                      ...modifData,
                      img: files[0],
                    });
                  }
                }
              }
              }
              style={{ display: 'none' }}
            />
            <label style={Btn} htmlFor='image'><p
              style={{ height: '10px', textAlign: 'center', width: '150px', margin: '0', padding: '0' }}>Upload
              Image</p></label>
          </div>
          <p style={{ color: 'red' }}>{pictureError}</p>
        </div>
        <div style={modifContainerPwd}>
          <PasswordInput hidePassword={hidePassword}
                         setHidePassword={setHidePassword}
                         password={password}
                         setPassword={setPassword}
          />
          <PasswordInput hidePassword={hidePassword}
                         setHidePassword={setHidePassword}
                         password={confirmPassword}
                         setPassword={setConfirmPassword}
                         placeholder={'Confirm password'}
          />
          {showConfirmPassword && (
            <button style={Btn} type='button' onClick={togglePasswordVisibility}>
              {passwordType === 'password' ? 'Afficher' : 'Masquer'}
            </button>
          )}
          <button style={Btn} type='button' onClick={() => {
            setModifData({
              ...modifData,
              password: password,
              confirmpwd: confirmPassword,
            });
            console.log(modifData);
          }}
                  disabled={(password != confirmPassword) || password == ''}
          >
            Confirm
          </button>
        </div>
        <div style={modifContainer2FA}>
          <p>2FA</p>
          <SwitchToggle
            onChange={(change) =>
              setModifData({ ...modifData, is2fa_active: change })
            }
            checked={userInfosSettings?.is2fa_active || false} // Obliger de mettre "ou false" psq : Type 'boolean | undefined' is not assignable to type 'boolean'...
          />
        </div>
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
        <button style={Btn} type='submit'>Enregistrer</button>
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
            <p style={{
              backgroundColor: 'lightgrey',
              padding: '.7em',
              borderRadius: 5,
              color: 'black',
              fontSize: '1.75em',
              textShadow: 'none',
            }}>{code2fa}</p>
            <button id={'2faDone'} onClick={() => setQrCode2fa('')} style={{ display: 'none' }} />
            <label htmlFor={'2faDone'}>
              <p style={{ backgroundColor: 'darkgrey', padding: '.7em', borderRadius: 5 }}>Done</p>
            </label>
          </div>
        </div>
      }
    </div>
  );
}

const imgStyle: React.CSSProperties = {
  width: '200px',
  borderRadius: '5px',
  border: '2px solid',
};

const settingsStyle: React.CSSProperties = {
  borderRadius: '10px',
  padding: '30px',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  background: 'grey',
  height: '100%',
  color: 'white',
  margin: '10px',
  cursor: 'pointer',
  width: '300px',

};

const modifContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const modifContainerImage: React.CSSProperties = {
  ...modifContainer,
  flexDirection: 'column',
  justifyContent: 'center',
};

const modifContainer2FA = {
  ...modifContainer,
  justifyContent: 'space-evenly',
  width: '100%',
};

const modifContainerPwd: React.CSSProperties = {
  ...modifContainer,
  flexDirection: 'column',
  justifyContent: 'space-around',
};

const Btn: React.CSSProperties = {
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  height: '30px',
  width: '200px',
  borderRadius: '6px',
  backgroundColor: 'darkgrey',
  padding: '5px',
  marginTop: '5px',
};

export default Settings;
