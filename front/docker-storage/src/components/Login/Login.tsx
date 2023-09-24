import { color, delay, RedirectToHome, unsecureFetch, Viewport } from '../../utils';
import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Background, Border, Button, Flex } from '..';

const SIZE: number = 350;

interface Props {
  duration_ms?: number,
  viewport: Viewport,
}

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  twoFactorCode: string;
}

export function Login({ duration_ms = 900, viewport }: Props) {

  // ReactHook -------------------------------------------------------------------------------------------------------//
  const [signIn, setSign] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnim, setIsAnim] = useState(false);
  const [isConnected, setIsConneted] = useState<boolean>(false);
  // const [isFTConnection, setIsFTConnection] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    twoFactorCode: '',
  });
  const [is2fa, setIs2fa] = useState<boolean>(false);


  // functions -------------------------------------------------------------------------------------------------------//
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (signIn)
      return OnConnect();
    else
      return OnRegister();
  }

  async function OnRegister() {
    if (formData.username !== '' && formData.password !== '') {
      if (formData.password === formData.confirmPassword) {
        if (!formData.username.endsWith('_42')) {
          const registerResponse = await unsecureFetch('auth/register', 'POST', JSON.stringify({
            username: formData.username,
            password: formData.password,
          }));
          if (registerResponse?.ok) {
            return OnConnect();
          } else {
            setErrorMessage('this username is already used');
            console.error('register failure. Error:', registerResponse?.status);
          }
        } else {
          setErrorMessage(`username can't be ended with _42`);
        }
      } else {
        setErrorMessage('passwords are not corresponding');
      }
    }
  }

  async function OnConnect(twoFactorCode?: string) {
    try {
      const credits = is2fa ? {
        username: formData.username,
        password: formData.password,
        twoFactorCode: twoFactorCode,
      } : {
        username: formData.username,
        password: formData.password,
      };

      const response = await unsecureFetch('auth/login', 'POST',
        JSON.stringify(credits));
      console.log('response : ', response);
      if (response?.statusText === 'Missing 2fa code') {
        setIs2fa(true);
        return;
      } else if (response?.statusText === 'Wrong 2fa code') {
        setErrorMessage('Wrong 2fa code');
      }

      if (response?.ok) {
        return animateReturnToHome(response);
      } else {
        const data = await response?.json();

        if (data.message === 'Missing 2fa code') {
          setIs2fa(true);
          return;
        } else if (data.message === 'Wrong 2fa code') {
          setErrorMessage('Wrong 2fa code');
        } else {
          setErrorMessage(data.message);
          console.error('connection failure. Error:', response?.status);
        }
      }
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  }

  async function animateReturnToHome(response: Response) {
    setIsAnim(true);
    await delay(duration_ms / 3);
    setIsConnecting(true);
    setIsAnim(false);
    await delay(duration_ms);
    setIsConneted(true);
    setIsConnecting(false);
    return RedirectToHome(navigate, response);
  }


  // Styles ----------------------------------------------------------------------------------------------------------//
  const connectionStyle: React.CSSProperties = {
    height: viewport.isLandscape
      ? Math.max(SIZE, viewport.height) + 'px'
      : Math.max(2 * SIZE, viewport.height) + 'px',
    width: '100%',
    position: 'absolute',
    top: '0px',
  };

  const animStyle: React.CSSProperties = {
    height: viewport.isLandscape ? (Math.max(SIZE, viewport.height) - 50) + 'px' : (Math.max(2 * SIZE, viewport.height) - 50) + 'px',
    width: '100%',
    position: 'absolute',
    top: '50px',
    transition: duration_ms / 3 + 'ms ease',
  };

  const connectingStyle: React.CSSProperties = {
    height: viewport.isLandscape ? Math.max(SIZE, viewport.height) + 'px' : Math.max(2 * SIZE, viewport.height) + 'px',
    width: '100%',
    position: 'absolute',
    top: viewport.isLandscape ? -Math.max(SIZE, viewport.height) + 'px' : -Math.max(2 * SIZE, viewport.height) + 'px',
    transition: duration_ms + 'ms ease',
  };

  const connectedStyle: React.CSSProperties = {
    height: viewport.isLandscape
      ? Math.max(SIZE, viewport.height) + 'px'
      : Math.max(2 * SIZE, viewport.height) + 'px',
    width: '100%',
    position: 'absolute',
    left: '0px',
    top: viewport.isLandscape
      ? -Math.max(SIZE, viewport.height) + 'px'
      : -Math.max(2 * SIZE, viewport.height) + 'px',
  };

  return (
    <div
      style={isConnected ? connectedStyle : isConnecting ? connectingStyle : isAnim ? animStyle : connectionStyle}>
      <Background bg_color={color.clear} flex_direction={viewport.isLandscape ? 'row' : 'column'}
                  flex_justifyContent={'space-around'}>
        <Border height={SIZE} width={SIZE} borderColor={color.clear}>
          <Background bg_color={color.clear}>
            <h2>Welcome to Pong</h2>
            <p>{signIn ? 'Still not registered?' : 'You have an Account?'}</p>
            <Button onClick={() => {
              // console.log(signIn ? 'sign up clicked' : 'sign in clicked');
              setSign(!signIn);
            }}>{signIn ? 'Sign Up' : 'Sign In'}</Button>
          </Background>
        </Border>
        <Border height={SIZE} width={SIZE} borderColor={color.clear}>
          <Background bg_color={color.clear} flex_alignItems={'stretch'} padding={'10px'}>
            <form onSubmit={handleSubmit}>
              <Background bg_color={color.clear} flex_alignItems={'stretch'} padding={'10px'}>
                {errorMessage && <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>}
                <input
                  style={{ minWidth: 100 + 'px', minHeight: 30 + 'px' }}
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='login..'
                  required
                />
                <input
                  style={{ minWidth: 100 + 'px', minHeight: 30 + 'px' }}
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='password..'
                  required
                />
                {!signIn &&
                  <input
                    style={{ minWidth: 100 + 'px', minHeight: 30 + 'px' }}
                    type='password'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder='password confirmation..'
                    required
                  />}
                <Flex flex_direction={'row'} flex_justifyContent={'flex-end'}>
                  <button type={'submit'} className={'button-30 color-3 cursor_pointer'}>
                    <p className={'color-3'}>{signIn ? 'Connect' : 'SignUp'}</p>
                  </button>
                </Flex>
                <br />
              </Background>
            </form>
            <Flex flex_direction={'row'} flex_justifyContent={'space-between'}>
              <p>or sign in with Intra42</p>
              <Button icon={require('../../assets/imgs/logo_42.png')} onClick={() => {
                // setIsFTConnection(true);
                window.location.replace('http://localhost:3001/api/auth/login/42');
              }}></Button>
            </Flex>
          </Background>
        </Border>
      </Background>

      {is2fa &&
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
            <h2>2FA</h2>
            <input id={'2fa'}
                   type='number'
                   name={'twoFactorCode'}
                   pattern='[0-9]{6}'
                   autoComplete={'one-time-code'}
                   maxLength={6}
                   value={formData.twoFactorCode}
                   onChange={handleChange}
                   style={{ width: '7ch' }}
            />
            <button
              id='2faValidate'
              style={{ display: 'none' }}
              onClick={() => OnConnect(formData.twoFactorCode)} />
            <label htmlFor='2faValidate'>
              <p style={{ backgroundColor: 'darkgrey', padding: '.7em', borderRadius: 5 }}>
                Confirm
              </p>
            </label>
          </div>
        </div>
      }
    </div>
  );
}
