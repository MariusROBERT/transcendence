import { ReactNode } from 'react';
import { GameContextProvider, UserContextProvider } from '..';
import { FriendsRequestProvider } from '../FriendsRequestContext/FriendsRequestContext';
import { UIContextProvider } from '../UIContext/UIContext';

interface Props {
  children: ReactNode;
}

export function Contexts({ children }: Props) {
  return (
    <>
      <UIContextProvider>
        <UserContextProvider>
          <FriendsRequestProvider>
            <GameContextProvider>
              {children}
            </GameContextProvider>
          </FriendsRequestProvider>
        </UserContextProvider>
      </UIContextProvider>
    </>
  );
}
