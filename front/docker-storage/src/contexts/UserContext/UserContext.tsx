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
import { IUser } from '../../utils/interfaces';
import { API_URL } from '../../utils/Global';

type UserContextType = {
  id: number;
  isOnline: boolean;
  socket: Socket | undefined,
  fetchContext: () => Promise<void>,
  user?: IUser,
}

const UserContext = createContext<UserContextType>({
  id: 0,
  isOnline: false,
  socket: undefined,
  fetchContext: async () => {
    return;
  },
  user: undefined,
});

export function useUserContext() {
  return useContext(UserContext);
}

interface Props {
  children: ReactNode;
}

export function UserContextProvider({ children }: Props) {
  const [pseudo, setPseudo] = useState<number>(0);
  const [id, setId] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [user, setUser] = useState<IUser>();

  async function fetchContext(): Promise<void> {
    const user = (await Fetch('user', 'GET'))?.json;
    if (!user) {
      setIsOnline(false);
    } else {
      setUser(user);
      setPseudo(user.pseudo);
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
      void reason;
    });
    socket?.on('connect', () => {
      socket?.emit('update_user_socket_id', { id: id, socketId: socket?.id });
    });
    socket?.connect();

    return () => {
      socket?.off('connect_error');
      socket?.off('disconnect');
      socket?.off('connect');
    };
  }, [socket, id, pseudo]);

  function initSocket() {
    const token = Cookies.get('jwtToken');
    setSocket(
      io(API_URL, {
        withCredentials: true,
        reconnectionAttempts: 1,
        transports: ['websocket'],
        autoConnect: false,
        query: { token },
      }),
    );
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
