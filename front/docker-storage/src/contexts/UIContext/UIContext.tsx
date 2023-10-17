import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useUserContext } from '../UserContext/UserContext';

type UIContextType = {
  theme: 'rainbow' | 'matrix';
  setTheme: (value: 'rainbow' | 'matrix') => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (value: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (value: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  isFriendsOpen: boolean;
  setIsFriendsOpen: (value: boolean) => void;
  isChannelsOpen: boolean;
  setIsChannelsOpen: (value: boolean) => void;

  saveUIContext: () => void
  loadUIContext: () => void
}

const UIContext = createContext<UIContextType>({
  theme: 'rainbow',
  setTheme: (value: 'rainbow' | 'matrix') => {
  },
  isSettingsOpen: false,
  setIsSettingsOpen: (value: boolean) => {
  },
  isProfileOpen: false,
  setIsProfileOpen: (value: boolean) => {
  },
  isChatOpen: false,
  setIsChatOpen: (value: boolean) => {
  },
  isFriendsOpen: false,
  setIsFriendsOpen: (value: boolean) => {
  },
  isChannelsOpen: false,
  setIsChannelsOpen: (value: boolean) => {
  },

  saveUIContext: () => {
    return;
  },
  loadUIContext: () => {
    return;
  },
});

export function useUIContext() {
  return useContext(UIContext);
}

interface Props {
  children: ReactNode;
}

export function UIContextProvider({ children }: Props) {
  const { id } = useUserContext();
  const [theme, setTheme] = useState<'rainbow' | 'matrix'>('rainbow');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isChannelsOpen, setIsChannelsOpen] = useState(false);

  async function loadUIContext(): Promise<void> {
    if (id <= 0) return;
    if (id.toString() !== localStorage.getItem('id')) {
      return resetUIContext();
    }
    setTheme(localStorage.getItem('theme') as 'rainbow' | 'matrix');
    setIsSettingsOpen(localStorage.getItem('isSettingsOpen') === 'true');
    setIsProfileOpen(localStorage.getItem('isProfileOpen') === 'true');
    setIsChatOpen(localStorage.getItem('isChatOpen') === 'true');
    setIsFriendsOpen(localStorage.getItem('isFriendsOpen') === 'true');
    setIsChannelsOpen(localStorage.getItem('isChannelsOpen') === 'true');
  }

  async function saveUIContext(): Promise<void> {
    localStorage.setItem('theme', theme);
    localStorage.setItem('isSettingsOpen', isSettingsOpen.toString());
    localStorage.setItem('isProfileOpen', isProfileOpen.toString());
    localStorage.setItem('isChatOpen', isChatOpen.toString());
    localStorage.setItem('isFriendsOpen', isFriendsOpen.toString());
    localStorage.setItem('isChannelsOpen', isChannelsOpen.toString());
  }

  async function resetUIContext(): Promise<void> {
    localStorage.setItem('theme', 'rainbow');
    localStorage.setItem('isSettingsOpen', 'false');
    localStorage.setItem('isProfileOpen', 'false');
    localStorage.setItem('isChatOpen', 'false');
    localStorage.setItem('isFriendsOpen', 'false');
    localStorage.setItem('isChannelsOpen', 'false');
  }

  return (
    <>
      <UIContext.Provider value={{
        theme,
        setTheme,
        isSettingsOpen,
        setIsSettingsOpen,
        isProfileOpen,
        setIsProfileOpen,
        isChatOpen,
        setIsChatOpen,
        isFriendsOpen,
        setIsFriendsOpen,
        isChannelsOpen,
        setIsChannelsOpen,

        saveUIContext,
        loadUIContext,
      }}>
        {children}
      </UIContext.Provider>
    </>
  );
}