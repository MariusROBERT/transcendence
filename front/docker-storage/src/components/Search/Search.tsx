import { Leaderboard, Popup, SearchBar } from '..';
import React, { useEffect } from 'react';
import { IUser } from '../../utils/interfaces';
import { useUIContext } from '../../contexts/UIContext/UIContext';

interface Props {
  searchTerm: string,
  setSearchTerm: (value: string) => void,
  placeHolder?: string,
  user?: IUser
}

export function Search(props: Props) {
  const { isLeaderboardOpen, setIsLeaderboardOpen } = useUIContext();
  const mobile = window.innerWidth < 500;

  useEffect(() => {
    const input = document.getElementById('searchBar') as HTMLInputElement;
    if (isLeaderboardOpen)
      input?.focus();
    else {
      if (input)
        input.value = '';
      props.setSearchTerm('');
    }
    // eslint-disable-next-line
  }, [isLeaderboardOpen]);

  return (
    <div style={{ zIndex: 2 }}>
      <SearchBar setSearchTerm={props.setSearchTerm}
                 onClick={() => setIsLeaderboardOpen(true)}
                 isVisible={!isLeaderboardOpen}
                 style={{ top: mobile ? 80 : 0 }}
      >
        {props.placeHolder || ''}
      </SearchBar>
    </div>
  );
}