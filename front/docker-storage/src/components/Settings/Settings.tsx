import Cookies from 'js-cookie';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { UserInfosForSetting } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { PasswordInput, Popup, RoundButton, SwitchToggle } from '..';
import { API_URL, color } from '../../utils/Global';
import { useUIContext, useUserContext } from '../../contexts';


export default function Settings() {
  const { isSettingsOpen, setIsSettingsOpen } = useUIContext();
  const { fetchContext } = useUserContext()
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userInfosSettings, setUserInfosSettings] = useState<UserInfosForSetting>();
  const [qrCode2fa, setQrCode2fa] = useState<string>('');
  const [pictureError, setPictureError] = useState<string>('');
  const [pseudoError, setPseudoError] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newImage, setNewImage] = useState<Blob>();
  const [code2fa, setCode2fa] = useState<string>('');
  const [confirm2fa, setConfirm2fa] = useState<string>('');
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [is2fa, setIs2fa] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');

  useEffect(() => {
    if (isSettingsOpen) {
      const getUserInfos = async () => {
        const user = (await Fetch('user', 'GET'))?.json;
        if (user) {
          setUserInfosSettings(user);
        } else {
          window.location.replace(API_URL + '/api/auth/login');
        }
      };
      getUserInfos();
    } else {
      setErrorMessage('');
      setPictureError('');
    }
  }, [isSettingsOpen]);

  // IMG

  function setImage(isValid: boolean, files: FileList) {
    if (!isValid) {
      setPictureError('File is not an image!');
    } else {
      setPictureError('');
      if (files && files.length !== 0) {
        setNewImage(files[0]);
        setNewImageUrl(URL.createObjectURL(files[0]));
      }
    }
  }

  function isImage(e: ChangeEvent<HTMLInputElement>, files: FileList) {
    const file = e.target.files?.[0] || null;
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      const jpgMagic = [0xFF, 0xD8, 0xFF];
      const pngMagic = [0x89, 0x50, 0x4E, 0x47];
      let isValid = true;

      for (let i = 0; i < jpgMagic.length; i++) {
        if (bytes[i] !== jpgMagic[i]) {
          isValid = false;
          break;
        }
      }
      if (isValid)
        return setImage(isValid, files);
      isValid = true;
      for (let i = 0; i < pngMagic.length; i++) {
        if (bytes[i] !== pngMagic[i]) {
          isValid = false;
          break;
        }
      }
      setImage(isValid, files);
    };
    reader.readAsArrayBuffer(file as Blob);
  }

  // MODIFICATIONS

  const saveModifications = async (e: FormEvent<HTMLFormElement> | null) => {
    if (e)
      e.preventDefault();
    const jwtToken = Cookies.get('jwtToken');
    if (
      newName === '' &&
      confirmPassword === '' &&
      password === '' &&
      newImageUrl === '' &&
      is2fa === userInfosSettings?.is2fa_active
    )
    // nothing changed
    {
      setIsSettingsOpen(false);
      return;
    }

    // PASSWORD :
    if (password !== '' && confirmPassword !== '' && oldPassword !== '') {
      if (password !== confirmPassword)
        return setErrorMessage('passwords doesn\'t match !');
      const user = (await Fetch('user/update_password', 'PATCH', JSON.stringify({
        newPassword: password,
        oldPassword: oldPassword,
      })))?.json;
      if (!user)
        return;
      if (user.message === 'Wrong password')
        return setErrorMessage(user.message);
      if (user.message)
        return setErrorMessage(user.message);
      setUserInfosSettings(user);
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');

    }

    //PSEUDO
    if (newName !== '' && newName !== userInfosSettings?.pseudo) {
      if (newName.endsWith('_42') && newName !== userInfosSettings?.username) {
        setErrorMessage('Le new name ne peut pas finir par _42');
        return;
      }
      const user = (await Fetch('user/update_pseudo', 'PATCH', JSON.stringify({ pseudo: newName })))?.json;
      if (!user)
        return;
      if (user.message === 'Pseudo already exists') {
        return (setPseudoError(user.message));
      }
      if (user.message === 'Pseudo must contains only alphanums characters') {
        return (setPseudoError(user.message));
      }
      setNewName('');
      setPseudoError('');
    }

    // IMG :
    if (newImageUrl !== '') {
      const formData = new FormData();
      formData.append('file', newImage || '');

      const user = await fetch(
        API_URL + '/api/user/update_picture',
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
          // return r.json();
          return;
        }
        setPictureError('Error while uploading picture');
        return null;
      });
      if (user) {
        setNewImageUrl('');
        setUserInfosSettings(user);
      }
    }

    // 2FA && NEWNAME :
    if (is2fa !== userInfosSettings?.is2fa_active) {
      const user = (await Fetch('user/update_2fa', 'PATCH',
        JSON.stringify({
          is2fa_active: is2fa,
        })))?.json;
      if (user) {
        setUserInfosSettings(user);
      }
      if (user?.qrCode && e) {
        setQrCode2fa(user.qrCode);
        setCode2fa(user.code2fa);
      }
    }
    setErrorMessage('');
    fetchContext();
    if (!is2fa || !e)
      setIsSettingsOpen(false);
  };

  async function validate2fa(code: number) {
    const res = await Fetch('user/confirm2fa', 'PATCH', JSON.stringify({
      code: code,
    }));
    if (res?.response.ok) {
      setConfirm2fa('');
      setQrCode2fa('');
      setIsSettingsOpen(false);
    }
    else if (res?.response.statusText === 'You don\' have to validate 2fa')
      setQrCode2fa('');
    else
      setConfirm2fa('');
  }

  const mobile = window.innerWidth < 500;

  return (
    <Popup isVisible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
      <div>
        <form onSubmit={saveModifications} style={settingsStyle}>
          {mobile ?
            <h3>{userInfosSettings?.pseudo}</h3> :
            <h2>{userInfosSettings?.pseudo}</h2>
          }
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={modifContainerImage}>
              <RoundButton isDisabled={true} icon={newImageUrl || userInfosSettings?.urlImg || ''} icon_size={200} onClick={() => null} />
              <input
                id={'image'}
                type='file'
                accept={'image/png, image/jpeg, image/jpg'}
                onChange={(event: ChangeEvent) => {
                  const { files } = event.target as HTMLInputElement;
                  if (files && files.length !== 0) {
                    if (files[0].size > 1024 * 1024 * 5) {
                      setPictureError('File is too big!');
                      setNewImage(undefined);
                    } else {
                      isImage(event as ChangeEvent<HTMLInputElement>, files);
                    }
                  }
                }
                }
                style={{ display: 'none' }}
              />
              <label style={Btn} htmlFor='image'><p style={{ margin: 'auto' }}>Upload Image</p></label>
            </div>
            <div className="change_name">
              <input id='change_name'
                type="text"
                placeholder='New name'
                onChange={(e) => setNewName(e.target.value)}
                pattern={'[a-zA-Z0-9\\-_+.]{1,11}'}
              />
              <p style={{ color: 'red', textAlign: 'center', marginBottom: '0px' }}>{pseudoError}</p>
              <label htmlFor="change_name"></label>
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
                noVerify
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
                confirmPassword={password}
              />
              <br />
            </div>
          }
          <div style={modifContainer2FA}>
            <p>2FA</p>
            <SwitchToggle
              onChange={(change: boolean) => setIs2fa(change)}
              checked={!!userInfosSettings?.is2fa_active}
            />
          </div>
          <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
          <button style={Btn} type='submit'><p style={{ margin: 'auto' }}>Save</p></button>
        </form>
        {qrCode2fa && qrCode2fa !== '' &&
          <Popup isVisible={qrCode2fa !== ''} onClose={() => {
            setIs2fa(false);
            setQrCode2fa('');
            saveModifications(null);
          }
          }>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'space-evenly',
              flexDirection: 'column',
            }}>
              <p style={{ backgroundColor: color.blue, padding: '1em', borderRadius: 5 }}>
                <strong>Scan this QrCode in your favorite 2fa application</strong>
              </p>
              <img src={qrCode2fa} alt='qrCode2fa' />
              <p style={code2faStyle}>{code2fa}</p>
              <p style={{ backgroundColor: color.blue, padding: '.5em', borderRadius: 5 }}>
                <strong>Enter a first code to validate</strong>
              </p>
              <input id={'2faConfirm'}
                type='number'
                name={'twoFactorCode'}
                autoComplete={'one-time-code'}
                maxLength={6}
                value={confirm2fa}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')
                    validate2fa(Number(confirm2fa));
                }}
                onChange={(e) => {
                  if (e.target.value.length > 6)
                    e.target.value = e.target.value.slice(0, 6);
                  setConfirm2fa(e.target.value.replace(/[^0-9]/g, ''));
                }}
                style={{
                  width: '6ch',
                  height: '2em',
                  fontSize: '2.5em',
                  textAlign: 'center',
                  backgroundColor: 'white',
                  borderRadius: 5,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <button id={'2faCancel'} onClick={() => {
                  setIs2fa(false);
                  setQrCode2fa('');
                  saveModifications(null);
                }} style={{ display: 'none' }} />
                <label htmlFor={'2faCancel'}>
                  <p style={{ backgroundColor: color.green, padding: '.7em', borderRadius: 5, margin: 10, color: 'red' }}><strong>Cancel</strong></p>
                </label>
                <button id={'2faDone'} onClick={() => validate2fa(Number(confirm2fa))} style={{ display: 'none' }} />
                <label htmlFor={'2faDone'}>
                  <p style={{ backgroundColor: color.green, padding: '.7em', borderRadius: 5, margin: 10, color: 'black' }}><strong>Done</strong></p>
                </label>
              </div>
            </div>
          </Popup>
        }
      </div>
    </Popup>
  );
}

const code2faStyle: React.CSSProperties = {
  backgroundColor: 'lightgrey',
  padding: '.7em',
  borderRadius: 5,
  color: 'black',
  fontSize: '1.75em',
  textShadow: 'none',
};

const settingsStyle: React.CSSProperties = {
  borderRadius: '10px',
  padding: '30px',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: color.blue,
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
  paddingBottom: '15px'
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

export const Btn: React.CSSProperties = {
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  height: '40px',
  width: '200px',
  borderRadius: '6px',
  backgroundColor: color.green,
  padding: '5px',
  marginTop: '5px',
  color: 'black',
};
