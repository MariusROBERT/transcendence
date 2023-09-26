import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import TwoFA from '../Login/TwoFA';
import { unsecureFetch } from '../../utils';

interface AuthGuardProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }): any => {
  const ft_token = new URLSearchParams(window.location.search).get('access-token');
  const intraToken = new URLSearchParams(window.location.search).get('ftToken');
  const [error2fa, setError2fa] = React.useState<string>('');
  const [is2fa, setIs2fa] = React.useState<boolean>(!!intraToken);

  console.log('window.location.search', window.location.search);
  console.log('ft_token', ft_token);
  console.log('intraToken', intraToken);

  if (ft_token !== '' && ft_token){
    Cookies.set('jwtToken', ft_token, {
      expires: 7, // 7 jours
    });
    window.location.href = '/';
  }
  const jwtToken = Cookies.get('jwtToken')
  console.log('jwtToken', jwtToken);
  let auth = !!jwtToken;
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth && !is2fa) {
      console.log('goToLogin');
      navigate('/login');
    }
  }, [is2fa]);

  useEffect(() => {
    // if (!auth) {
    if (!auth && !intraToken) {
      console.log('goToLogin');
      navigate('/login');
    }
  }, [auth, navigate]);

  if (auth)
    return (children);

  async function submitTwoFA(code2fa: string) {
    const credits = {
      code2fa: code2fa,
      ftToken: intraToken,
    };

    console.log('making request');
    const response = await unsecureFetch('auth/2fa/42', 'POST',
      JSON.stringify(credits));
    console.log('response: ', response);
    if (response?.ok) {
      console.log('ok');
      const json = await response.json();
      console.log(json['access-token']);
      Cookies.set('jwtToken', json['access-token'], {
        expires: 7, // 7 jours
      });
      window.location.href = '/';
      auth = true;
    } else if (response?.statusText === 'Invalid 2fa code') {
      setError2fa(response.statusText);
    } else {
      console.log(response?.statusText);
      setError2fa('Error');
    }
  }

  if (intraToken)
    return (
      <TwoFA isVisible={is2fa}
             errorMessage={error2fa}
             setErrorMessage={setError2fa}
             submit={submitTwoFA}
             setIsVisible={setIs2fa}
      />
    );

  return null;
};
export default AuthGuard;
