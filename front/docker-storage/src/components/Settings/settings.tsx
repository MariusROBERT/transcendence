import Cookies from 'js-cookie';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
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
    img: '',
    password: '',
    confirmpwd: '',
    is2fa_active: false, // TODO : set en fonction UserInfosForSetting.is2fa_active (psa la le bug c'est que si c'est tru chez le user et que je save sans rien faire, ca le save en false)
  });
  const [pictureError, setPictureError] = useState<string>('');
  const [newImage, setNewImage] = useState<string>('');

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
      modifData.img === '' &&
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
          setUserInfosSettings(user);
        }
        lockPwd();
        setErrorMessage('');
      }
    }
    if (
      modifData.is2fa_active === userInfosSettings?.is2fa_active &&
      modifData.img === userInfosSettings?.urlImg
    ) {
      setIsDisabled(true);
      setShowConfirmPassword(false);
      return;
    }

    // IMG :
    if (modifData.img !== '') {
      const formData = new FormData();
      formData.append('file', modifData.img);
      formData.append('is2fa_active', JSON.stringify(modifData.is2fa_active));

      const user = await fetch('http://localhost:3001/api/user/update_picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      }).then(r => {
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
      const user = (await Fetch('user', 'PATCH',
        JSON.stringify({
          is2fa_active: modifData.is2fa_active,
        })))?.json;
      if (user) {
        setUserInfosSettings(user);
      }
    }  

    lockPwd();
    setErrorMessage('');
  };

  return (
    <div style={popupStyle}>
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
              type='file'
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
            <label style={Btn} htmlFor='image'><p style={{ height:'10px',  textAlign: 'center', width:'150px', margin: '0', padding: '0'}}>Upload Image</p></label>
          </div>
          <p style={{ color: 'red' }}>{pictureError}</p>
        </div>
        <div style={modifContainerPwd}>
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
            <div style={modifContainerPwd}>
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
            <button style={Btn} type='button' onClick={togglePasswordVisibility}>
              {passwordType === 'password' ? 'Afficher' : 'Masquer'}
            </button>
          )}
          <button style={Btn} type='button' onClick={toggleLock}>
            {isDisabled ? 'Modifier' : 'Verouiller'}
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
        {errorMessage && (
          <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
        )}
        <button style={Btn} type='submit'>Enregistrer</button>
      </form>
    </div>
  );
};

const imgStyle: React.CSSProperties = {
  width: '100px',
  border: '2px solid'
};

const popupStyle: React.CSSProperties = {  // tempooraire
  zIndex: '9999',
  height: '100%'
}

const settingsStyle: React.CSSProperties = {
  padding: '40px 10px',
  alignItems: 'center',
  width: '400px',
  display: 'flex',
  flexDirection: 'column',
  background: 'grey',
  height: '100%',
  color: 'white',
  margin: '10px',
  cursor: 'pointer',
};

const modifContainerImage: React.CSSProperties = {
  width: '350px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',

}

const modifContainer2FA = {
  width: '150px',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: '10px'
}

const modifContainerPwd : React.CSSProperties = {
  width: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
}

const Btn: React.CSSProperties = {
  display: "flex",
  alignContent: 'center',
  justifyContent: 'center',
  height: '30px',
  width: '200px',
  borderRadius: '6px', 
  backgroundColor: 'darkgrey',
  padding: '5px',
  marginTop: '5px',
}

export default Settings;
