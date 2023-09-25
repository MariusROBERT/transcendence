import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface AuthGuardProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const ft_token = new URLSearchParams(window.location.search).get('access-token');
  if (ft_token)
  {
    Cookies.set('jwtToken', ft_token, {
      expires: 7, // 7 jours
    });
    window.location.href = '/';
  }
  const jwtToken = Cookies.get('jwtToken')
  let auth = !!jwtToken;
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
  }, [auth, navigate]);
  return auth ? <>{children}</> : null;
};
export default AuthGuard;
