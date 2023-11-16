import Cookies from 'js-cookie';
import { API_URL } from './Global';

export async function Fetch(url_end: string, method: 'GET' | 'PATCH' | 'POST' | 'DELETE', body: any = undefined): Promise<undefined | {
  response: Response,
  json: any
}> {
  const jwtToken = Cookies.get('jwtToken');
  try {
    const response = await fetch(API_URL + '/api/' + url_end, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: body,
    });
    if (response.ok) {
      const rep_json = await response.json();
      return { response: response, json: rep_json };
    }
    const rep_json = await response.json();
    if (rep_json.statusCode !== 401) {
      return { response: response, json: rep_json };
    }
    window.location.href = '/login';
  } catch {
    window.location.href = '/login';
  }
}

export async function unsecureFetch(
  url_end: string,
  method: 'GET' | 'PATCH' | 'POST',
  body: any = undefined,
): Promise<undefined | Response> {
  let response;
  try {
    response = await fetch(API_URL + '/api/' + url_end, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    return response;
  } catch (e) {
    // console.warn(e);
    return;
  }
}
