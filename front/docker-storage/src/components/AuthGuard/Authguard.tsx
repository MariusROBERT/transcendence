import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TwoFA } from '..';
import { unsecureFetch } from '../../utils';

interface AuthGuardProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const Authguard: React.FC<AuthGuardProps> = ({ children }): any => {
  const ft_token = new URLSearchParams(window.location.search).get('access-token');
  const [error2fa, setError2fa] = React.useState<string>('');
  const [is2fa, setIs2fa] = React.useState<boolean>(ft_token === 'missing 2fa code');

  if (ft_token && ft_token !== 'missing 2fa code' && ft_token !== '') {
    Cookies.set('jwtToken', ft_token, {
      expires: 7, // 7 jours
    });
    window.location.href = '/';
  }
  const jwtToken = Cookies.get('jwtToken');
  let auth = !!jwtToken;
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth && !is2fa) {
      Cookies.remove('jwtToken')
      navigate('/login');
    }
  }, [auth, navigate]);

  if (auth)
    return (children);

  async function submitTwoFA(code2fa: string) {
    const credits = {
      code2fa: code2fa,
    };

    const response = await unsecureFetch('auth/2fa/42', 'POST',
      JSON.stringify(credits));
    if (response?.ok) {
      const json = await response.json();
      Cookies.set('jwtToken', json['access-token'], {
        expires: 7, // 7 jours
      });
      window.location.href = '/';
      auth = true;
    } else if (response?.statusText === 'Invalid 2fa code') {
      setError2fa(response.statusText);
    } else {
      console.error(response?.statusText);
      setError2fa('Error');
    }
  }

  if (ft_token === 'missing 2fa code')
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
export default Authguard;
