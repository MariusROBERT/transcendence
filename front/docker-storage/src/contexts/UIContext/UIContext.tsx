import { createContext, ReactNode, useContext, useState } from 'react';
import { useUserContext } from '../UserContext/UserContext';
import { current_chan, SetCurrChan } from '../../utils/channel_functions';

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

  saveUIContext: () => void
  loadUIContext: () => void
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
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  async function loadUIContext(): Promise<void> {
    if (id <= 0) return;
    if (id.toString() !== localStorage.getItem('id')) {
      return resetUIContext();
    }
    setTheme(localStorage.getItem('theme') as 'rainbow' | 'matrix');
    setIsSettingsOpen(localStorage.getItem('isSettingsOpen') === 'true');
    setIsProfileOpen(localStorage.getItem('isProfileOpen') ? parseInt(localStorage.getItem('isProfileOpen') as string) : 0);
    SetCurrChan(localStorage.getItem('isChatOpen') !== '' ? localStorage.getItem('isChatOpen') as string : '');
    setIsChatOpen(localStorage.getItem('isChatOpen') === 'true');
    setIsContactOpen(localStorage.getItem('isContactOpen') === 'true');
  }

  async function saveUIContext(): Promise<void> {
    localStorage.setItem('theme', theme);
    localStorage.setItem('isSettingsOpen', isSettingsOpen.toString());
    localStorage.setItem('isProfileOpen', isProfileOpen ? isProfileOpen.toString() : '0');
    localStorage.setItem('isChatOpen', current_chan);
    localStorage.setItem('isContactOpen', isContactOpen.toString());
  }

  async function resetUIContext(): Promise<void> {
    localStorage.setItem('theme', 'rainbow');
    localStorage.setItem('isSettingsOpen', 'false');
    localStorage.setItem('isProfileOpen', '0');
    localStorage.setItem('isChatOpen', '');
    localStorage.setItem('isContactOpen', 'false');
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

        saveUIContext,
        loadUIContext,
      }}>
        {children}
      </UIContext.Provider>
    </>
  );
}