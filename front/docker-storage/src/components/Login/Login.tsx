import { color, delay, RedirectToHome, unsecureFetch, Viewport } from '../../utils';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Background, Border, Button, Flex, PasswordInput, TwoFA } from '..';
import { API_URL } from '../../utils/Global';

const SIZE = 350;

interface Props {
  duration_ms?: number;
  viewport: Viewport;
}

export function Login({ duration_ms = 900, viewport }: Props) {

  // ReactHook -------------------------------------------------------------------------------------------------------//
  const [signIn, setSign] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnim, setIsAnim] = useState(false);
  const [isConnected, setIsConneted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const [is2fa, setIs2fa] = useState<boolean>(false);
  const [error2fa, setError2fa] = useState<string>(' ');
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  // functions -------------------------------------------------------------------------------------------------------//

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (signIn) return OnConnect();
    return OnRegister();
  }

  async function OnRegister() {
    if (username !== '' && password !== '') {
      if (password === confirmPassword) {
        if (!username.endsWith('_42')) {
          const registerResponse = await unsecureFetch('auth/register', 'POST', JSON.stringify({
            username: username,
            password: password,
          }));
          if (registerResponse?.ok)
            return OnConnect();
          const error = await registerResponse?.json().then((data) => data.message);
          setErrorMessage(error || 'Error');
          // console.error('register failure. Error:', registerResponse?.status);
        } else {
          setErrorMessage('username can\'t be ended with _42');
        }
      } else {
        setErrorMessage('passwords are not corresponding');
      }
    }
  }

  async function OnConnect(twoFactorCode?: string) {
    try {
      const credits = is2fa ? {
        username: username,
        password: password,
        twoFactorCode: twoFactorCode,
      } : {
        username: username,
        password: password,
      };

      const response = await unsecureFetch('auth/login', 'POST',
        JSON.stringify(credits));
      if (response?.statusText === 'Missing 2fa code') {
        setIs2fa(true);
        return;
      }
      if (response?.statusText === 'Invalid 2fa code') {
        setErrorMessage(response.statusText);
      }

      if (response?.ok) {
        return animateReturnToHome(response);
      }
      const data = await response?.json();

      if (data.message === 'Missing 2fa code') {
        setIs2fa(true);
        return;
      }
      if (data.message === 'Invalid 2fa code') {
        setError2fa('Invalid 2fa code');
      } else {
        setErrorMessage(data.message);
        //console.error('connection failure. Error:', response?.status);
      }
    } catch (error) {

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

  // reset 2fa error message when popup is closed
  useEffect(() => {
    if (!is2fa) {
      setError2fa('');
    }
  }, [is2fa]);

  //focus on input when login or signup is clicked
  useEffect(() => {
    document.getElementById('username')?.focus();
  }, [signIn]);

  // Styles ----------------------------------------------------------------------------------------------------------//
  const connectionStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: '0px',
    zIndex: 2,
  };

  const animStyle: React.CSSProperties = {
    height: viewport.isLandscape
      ? Math.max(SIZE, viewport.height) - 50 + 'px'
      : Math.max(2 * SIZE, viewport.height) - 50 + 'px',
    width: '100%',
    position: 'absolute',
    top: '50px',
    transition: duration_ms / 3 + 'ms ease',
    zIndex: 2,
  };

  const connectingStyle: React.CSSProperties = {
    height: viewport.isLandscape
      ? Math.max(SIZE, viewport.height) + 'px'
      : Math.max(2 * SIZE, viewport.height) + 'px',
    width: '100%',
    position: 'absolute',
    top: viewport.isLandscape ? -Math.max(SIZE, viewport.height) + 'px' : -Math.max(2 * SIZE, viewport.height) + 'px',
    transition: duration_ms + 'ms ease',
    zIndex: 2,
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
    zIndex: 2,
  };

  return (
    <div
      style={isConnected ? connectedStyle : isConnecting ? connectingStyle : isAnim ? animStyle : connectionStyle}>
      <Background bg_color={color.clear} flex_direction={viewport.isLandscape ? 'row' : 'column'}
        flex_justifyContent={'space-around'} forceStyle={{ padding: 0, margin: 0 }}>

        <Border height={SIZE} width={SIZE} borderColor={color.clear}>
          <Background bg_color={color.clear}>
            <h2 className={'rainbow'} style={{padding: 20}}>Welcome to Pong</h2>
            <p>{signIn ? 'Still not registered?' : 'You have an Account?'}</p>
            <button  className={'button-30 cursor_pointer'} style={{backgroundColor:'grey'}} onClick={() => {
              setSign(!signIn);
            }}><p>{signIn ? 'Sign Up' : 'Sign In'}</p></button>
          </Background>
        </Border>
        
        <Border height={SIZE} width={SIZE} borderColor={color.clear}>
          <Background bg_color={color.clear} flex_alignItems={'stretch'} padding={'10px'}>
            <div style={{ padding: '0 35px 0 0' }}>
              <form onSubmit={handleSubmit}>
                <Background bg_color={color.clear} flex_alignItems={'stretch'} padding={'10px 30px 10px 10px'}
                  forceStyle={{ overflow: '' }}>
                  {!signIn && <p>Password Politic: 1 Maj, 1 Min, <br></br>1 Digit, 1 Special char, 8 Char mini</p>}
                  {errorMessage && <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>}
                  <input
                    style={{ minWidth: 100 + 'px', minHeight: 30 + 'px' }}
                    type='text'
                    name='username'
                    id={'username'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='login...'
                    maxLength={11}
                    pattern={!signIn ? /[a-zA-Z0-9\\-_+.]{1,11}/.source : /.*/.source}
                    required
                  />
                  <PasswordInput
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    password={password}
                    setPassword={setPassword}
                    required
                    noVerify={signIn}
                    style={{ minWidth: '100px', minHeight: '30px' }}
                  />
                  {!signIn &&
                    <PasswordInput
                      hidePassword={hidePassword}
                      setHidePassword={setHidePassword}
                      password={confirmPassword}
                      setPassword={setConfirmPassword}
                      placeholder={'confirm password'}
                      confirmPassword={password}
                      style={{ minWidth: '100px', minHeight: '30px' }}
                    />
                  }
                  <Flex flex_direction={'row'} flex_justifyContent={'flex-end'}>
                    <button type={'submit'} className={'button-30 cursor_pointer'} style={{backgroundColor:'grey'}}>
                      <p>{signIn ? 'Connect' : 'SignUp'}</p>
                    </button>
                  </Flex>
                  <br />
                </Background>
              </form>
              <Flex flex_direction={'row'} flex_justifyContent={'space-between'}>
                <p>or sign in with <a style={{color: color.white, textDecoration: 'none', fontWeight: 500}} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Intra42</a></p>
                <Button icon={require('../../assets/imgs/logo_42.png')} onClick={() => {
                  window.location.replace(API_URL + '/api/auth/login/42');
                }} />
              </Flex>
            </div>
          </Background>
        </Border>
      </Background>
      <TwoFA setIsVisible={setIs2fa}
        isVisible={is2fa}
        submit={OnConnect}
        errorMessage={error2fa}
        setErrorMessage={setError2fa}
      />
    </div>
  );
}
