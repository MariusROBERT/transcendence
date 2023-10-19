import Cookies from 'js-cookie';
import { NavigateFunction } from 'react-router-dom';

export async function RedirectToHome(navigate: NavigateFunction, response: Response) {
  const jwt = await response.json();
  Cookies.set('jwtToken', jwt['access-token'], {
    expires: 7, // 7 jours
  });
  navigate('/');
}
