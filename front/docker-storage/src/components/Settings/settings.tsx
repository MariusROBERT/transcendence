import Cookies from 'js-cookie';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInfosForSetting } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { PasswordInput, SwitchToggle } from '..';

interface Props {
  isVisible: boolean;
}

export default function Settings(props: Props) {
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken) {
    navigate('/login');
    alert('Vous avez été déconnecté');
  }
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userInfosSettings, setUserInfosSettings] = useState<UserInfosForSetting>();
  const [qrCode2fa, setQrCode2fa] = useState<string>('');
  const [pictureError, setPictureError] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newImage, setNewImage] = useState<Blob>();
  const [code2fa, setCode2fa] = useState<string>('');
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [is2fa, setIs2fa] = useState<boolean>(false);

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
    } else {
      setErrorMessage('');
      setPictureError('');
    }
  }, [props.isVisible]);

  // MODIFICATIONS

  const saveModifications = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jwtToken = Cookies.get('jwtToken');
    if (!jwtToken) {
      window.location.replace('http://localhost:3001/api/auth/login');
      alert('You have been disconnected \n(your Authorisation Cookie has been modified or deleted)');
    }
    if (
      confirmPassword === '' &&
      password === '' &&
      newImageUrl === '' &&
      is2fa === userInfosSettings?.is2fa_active
    )
      // nothing changed
      return;

    // PASSWORD :
    if (password !== '' && confirmPassword !== '' && oldPassword !== '') {
      if (password !== confirmPassword)
        return setErrorMessage('passwords doesn\'t match !');
      else {
        const user = await (fetch('http://localhost:3001/api/user/update_password', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ newPassword: password, oldPassword: oldPassword }),
        }))
          .then(r => r.json());

        if (user.message === 'Wrong password')
          return setErrorMessage(user.message);
        if (user.error)
          return setErrorMessage('Error while updating password');
        setUserInfosSettings(user);
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
      }
    }

    // IMG :
    if (newImageUrl !== '') {
      const formData = new FormData();
      formData.append('file', newImage || '');

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
        setNewImageUrl('');
        setUserInfosSettings(user);
      }
    }

    // 2FA :
    if (is2fa !== userInfosSettings?.is2fa_active) {
      const user = (await Fetch('user', 'PATCH',
        JSON.stringify({
          is2fa_active: is2fa,
        })))?.json;
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
              borderColor: newImageUrl === '' ? 'green' : 'orange',
            }} // green = synced with back, orange = not uploaded yet
                 src={newImageUrl || userInfosSettings?.urlImg}
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
                    setNewImage(undefined);
                  } else {
                    setNewImageUrl(URL.createObjectURL(files[0]));
                    setPictureError('');
                    setNewImage(files[0]);
                  } //TODO: when too big file is upload, then settings are closed and you re-open the same file, it doesn't show the error
                }
              }
              }
              style={{ display: 'none' }}
            />
            <label style={Btn} htmlFor='image'><p style={{ margin: 'auto' }}>Upload Image</p></label>
          </div>
          <p style={{ color: 'red', textAlign: 'center' }}>{pictureError}</p>
        </div>
        {(userInfosSettings?.username && userInfosSettings?.username.match(/.*_42/)) ? null :
          //hide password change for 42 users
          <div style={modifContainerPwd}>
            <PasswordInput hidePassword={hidePassword}
                           setHidePassword={setHidePassword}
                           password={oldPassword}
                           setPassword={setOldPassword}
                           placeholder={'Current password'}
            />
            <br />
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
            <br />
          </div>
        }
        <div style={modifContainer2FA}>
          <p>2FA</p>
          <SwitchToggle
            onChange={(change) => setIs2fa(change)}
            checked={!!userInfosSettings?.is2fa_active}
          />
        </div>
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
        <button style={Btn} type='submit'><p style={{ margin: 'auto' }}>Save</p></button>
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
  minWidth: '300px',

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
  color: 'white',
};
