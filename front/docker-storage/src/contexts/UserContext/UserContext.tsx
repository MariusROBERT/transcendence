import { Fetch } from '../../utils';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { IUserComplete } from '../../utils/interfaces';
import { useFriendsRequestContext } from '../FriendsRequestContext/FriendsRequestContext';

type UserContextType = {
  id: number;
  isOnline: boolean;
  socket: Socket | undefined,
  fetchContext: () => Promise<void>,
  user?: IUserComplete,
}

const UserContext = createContext<UserContextType>({
  id: 0,
  isOnline: false,
  socket: undefined,
  fetchContext: async () => {},
  user: undefined,
});

export function useUserContext() {
  return useContext(UserContext);
}

interface Props {
  children: ReactNode;
}

export function UserContextProvider({ children }: Props) {
  const [username, setUsername] = useState<number>(0);
  const [id, setId] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [user, setUser] = useState<IUserComplete>();

  async function fetchContext(): Promise<void> {
    const user = (await Fetch('user', 'GET'))?.json;
    if (!user) {
      setIsOnline(false);
    } else {
      setUser(user);
      setUsername(user.username);
      setId(user.id);
      setIsOnline(true);
      if (!socket)
        initSocket();
    }
  }

  useEffect(() => {
    socket?.on('connect_error', (err) => {
      console.log('Connection to socket.io server failed', err);
    });
    socket?.on('disconnect', (reason) => {
      socket?.emit('reset_user_socket_id', { id: id });
      console.log('Disconnected from socket.io server', reason);
    });
    socket?.on('connect', () => {
      socket?.emit('update_user_socket_id', { id: id, socketId: socket?.id });
      console.log('Connected, Socket ID: ', socket?.id, ' UserName: [', username, '] ID: ', id);
    });
    socket?.connect();

    return () => {
      socket?.off('connect_error');
      socket?.off('disconnect');
      socket?.off('connect');
    };
  }, [socket, id, username]);

  function initSocket() {
    if (!socket) {
      const token = Cookies.get('jwtToken');
      setSocket(
        io('http://localhost:3001', {
          withCredentials: true,
          reconnectionAttempts: 1,
          transports: ['websocket'],
          autoConnect: false,
          query: { token },
        }),
      );
    }
    return () => {
      socket?.close();
    };
  }

  return (
    <>
      <UserContext.Provider value={{ id, isOnline, socket, fetchContext, user }}>
        {children}
      </UserContext.Provider>
    </>
  );
}
