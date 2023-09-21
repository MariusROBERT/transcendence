import { Fetch } from '../../utils'
import { useState, createContext, useEffect, useContext, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

type UserContextType = {
  id: number;
  isOnline: boolean;
  socket: Socket | undefined,
  fetchContext: () => Promise<void>,
}

const UserContext = createContext<UserContextType>({
  id: 0,
  isOnline: false,
  socket: undefined,
  fetchContext: async () => {}
});

export function useUserContext() {
  return useContext(UserContext);
}

interface Props{
  children:ReactNode
}

export function UserContextProvider({ children }: Props){
  const [id, setId] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  async function fetchContext() : Promise<void> {
    const user = (await Fetch('user', 'GET'))?.json;
    if (!user) {
      setIsOnline(false);
    }
    else {
      setId(user.id);
      setIsOnline(true);
      if (user.socket)
        setSocket(user.socket);
      else {
        await initSocket();
      }
    }
  }

  useEffect(() => {
    socket?.on('connect_error', (err) => {
      console.log('Connection to socket.io server failed', err);
    });
    socket?.on('disconnect', (reason) => {
      console.log('Disconnected from socket.io server', reason);
    });
    socket?.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    return () => {
      socket?.off('connect_error');
      socket?.off('disconnect');
      socket?.off('connect');
    }
  }, [socket]);

  async function initSocket(){
    setSocket(
      io('http://localhost:3001', {
        withCredentials: true,
        reconnectionAttempts: 1,
        transports: ['websocket']
      }));
    socket?.on('connect', () => {
      Fetch('user/update_status', 'PATCH', JSON.stringify({user_status: 'on'}));
      Fetch('user/update_socket_id', 'PATCH', JSON.stringify({socket: socket?.id}));
    });
    socket?.on('disconnect', () => {
      Fetch('user/update_status', 'PATCH', JSON.stringify({ user_status: 'off' }));
      Fetch('user/update_socket_id', 'PATCH', JSON.stringify({ socket: undefined }));
    });
    return () => { socket?.close(); }
  }

  return (
    <>
      <UserContext.Provider value={{id, isOnline, socket, fetchContext}}>
        {children}
      </UserContext.Provider>
    </>
  );
}
