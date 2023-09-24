import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const token = Cookies.get('jwtToken');

export const socket = io('http://127.0.0.1:3001', {
  autoConnect: false,
  //withCredentials: true, // Does not work idk why, check later
  query: { token },
});
