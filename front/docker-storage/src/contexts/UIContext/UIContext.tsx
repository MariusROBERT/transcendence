import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { useUserContext } from '../UserContext/UserContext';
import { ChannelPublicPass } from '../../utils/interfaces';

type UIContextType = {
  theme: 'rainbow' | 'matrix';
  setTheme: (value: 'rainbow' | 'matrix') => void;
  isLeaderboardOpen: boolean;
  setIsLeaderboardOpen: (value: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (value: boolean) => void;
  isProfileOpen: number;
  setIsProfileOpen: (value: number) => void;
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  isContactOpen: boolean;
  setIsContactOpen: (value: boolean) => void;

  // chat
  isChatMenuOpen: boolean;
  setIsChatMenuOpen: (value: boolean) => void;
  channels: ChannelPublicPass[] | undefined;
  setChannels: (value: ChannelPublicPass[] | undefined) => void;

  saveUIContext: () => void
  loadUIContext: () => void
  resetUIContext: () => void
}

const UIContext = createContext<UIContextType>({
  theme: 'rainbow',
  setTheme: (value: 'rainbow' | 'matrix') => {
    void(value);
  },
  isLeaderboardOpen: false,
  setIsLeaderboardOpen: (value: boolean) => {
    void(value);
  },
  isSettingsOpen: false,
  setIsSettingsOpen: (value: boolean) => {
    void(value);
  },
  isProfileOpen: 0,
  setIsProfileOpen: (value: number) => {
    void(value);
  },
  isChatOpen: false,
  setIsChatOpen: (value: boolean) => {
    void(value);
  },
  isContactOpen: false,
  setIsContactOpen: (value: boolean) => {
    void(value);
  },

  // chat
  isChatMenuOpen: false,
  setIsChatMenuOpen: (value: boolean) => {
    void(value);
  },
  channels: undefined,
  setChannels: (value: ChannelPublicPass[] | undefined) => {
    void(value);
  },

  saveUIContext: () => {
    return;
  },
  loadUIContext: () => {
    return;
  },
  resetUIContext: () => {
    return ;
  }
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
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [channels, setChannels] = useState<ChannelPublicPass[] | undefined>(undefined);

  useEffect(() => {
    if (id <= 0) return;
    saveUIContext();
  }, [theme, isLeaderboardOpen, isSettingsOpen, isProfileOpen, isContactOpen, isChatMenuOpen, channels, id]);

  async function loadUIContext(): Promise<void> {
    setTheme(localStorage.getItem('theme') as 'rainbow' | 'matrix');
    setIsSettingsOpen(localStorage.getItem('isSettingsOpen') === 'true');
    setIsProfileOpen(localStorage.getItem('isProfileOpen') ? parseInt(localStorage.getItem('isProfileOpen') as string) : 0);
    setIsContactOpen(localStorage.getItem('isContactOpen') === 'true');
    setIsLeaderboardOpen(localStorage.getItem('isLeaderboardOpen') === 'true');
  }

  async function saveUIContext(): Promise<void> {
    localStorage.setItem('theme', theme);
    localStorage.setItem('isSettingsOpen', isSettingsOpen.toString());
    localStorage.setItem('isProfileOpen', isProfileOpen ? isProfileOpen.toString() : '0');
    localStorage.setItem('isContactOpen', isContactOpen.toString());
    localStorage.setItem('isLeaderboardOpen', isLeaderboardOpen.toString());
  }

  async function resetUIContext(): Promise<void> {
    localStorage.setItem('theme', 'rainbow');
    localStorage.setItem('isSettingsOpen', 'false');
    localStorage.setItem('isProfileOpen', '0');
    localStorage.setItem('isContactOpen', 'false');
    localStorage.setItem('isLeaderboardOpen', 'false');
  }

  return (
    <>
      <UIContext.Provider value={{
        theme,
        setTheme,
        isLeaderboardOpen,
        setIsLeaderboardOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isProfileOpen,
        setIsProfileOpen,
        isChatOpen,
        setIsChatOpen,
        isContactOpen,
        setIsContactOpen,

        // chat
        isChatMenuOpen,
        setIsChatMenuOpen,
        channels,
        setChannels,

        saveUIContext,
        loadUIContext,
        resetUIContext
      }}>
        {children}
      </UIContext.Provider>
    </>
  );
}