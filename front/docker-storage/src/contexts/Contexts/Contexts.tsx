import { ReactNode } from 'react';
import { GameContextProvider, UserContextProvider } from '..';

interface Props{
  children:ReactNode
}

export function Contexts({ children }: Props){
  return (
    <>
      <UserContextProvider>
        <GameContextProvider>
          {children}
        </GameContextProvider>
      </UserContextProvider>
    </>
  )
}