import Cookies from 'js-cookie';

export async function RedirectToHome(navigate: Function, response: Response) {
    const jwt = await response.json();
    Cookies.set('jwtToken', jwt['access-token'], {
        expires: 7, // 7 jours
    });
    const jwtToken = Cookies.get('jwtToken');
    navigate('/');
}
