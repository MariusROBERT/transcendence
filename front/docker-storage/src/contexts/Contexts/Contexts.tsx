import { ReactNode } from 'react';
import { GameContextProvider, UserContextProvider } from '..';
import { FriendsRequestProvider } from '../FriendsRequestContext/FriendsRequestContext';

interface Props {
  children: ReactNode;
}

export function Contexts({ children }: Props) {
  return (
    <>
      <UserContextProvider>
        <FriendsRequestProvider>
          <GameContextProvider>
            {children}
          </GameContextProvider>
        </FriendsRequestProvider>
      </UserContextProvider>
    </>
  );
}
