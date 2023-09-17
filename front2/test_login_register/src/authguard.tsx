import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthGuardProps } from './utils/interfaces';

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const jwtToken = Cookies.get('jwtToken');
  let auth = jwtToken ? true : false;
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
  }, [auth, navigate]);
  return auth ? <>{children}</> : null;
};
export default AuthGuard;
