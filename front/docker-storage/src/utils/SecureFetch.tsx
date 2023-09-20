import Cookies from 'js-cookie';

export async function Fetch(url_end: string, method: 'GET'|'PATCH'|'POST', body: any = undefined): Promise<{response: Response, json: any}> {
  const jwtToken = Cookies.get('jwtToken');

  const response = await fetch('http://localhost:3001/api/' + url_end, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    body: body
  })

  console.log(response);
  if (response.ok) {
    const rep_json = await response.json();
    return {response: response, json:rep_json};
  }

  window.location.href = '/login';
  alert('You have been disconnected \n(your Authorisation Cookie has been modified or deleted)');
  return {response: response, json: null};
}

export async function unsecureFetch(url_end: string, method: 'GET'|'PATCH'|'POST', body: any = undefined) {

  return await fetch('http://localhost:3001/api/' + url_end, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body
  });
}