import { ReactNode } from 'react';
import { UserContextProvider } from '..';

interface Props{
  children:ReactNode
}

export function Contexts({ children }: Props){
  return (
    <>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </>
  )
}