import { SearchBar } from '..';
import React, { useEffect } from 'react';
import { IUser } from '../../utils/interfaces';
import { useUIContext } from '../../contexts';

interface Props {
  searchTerm: string,
  setSearchTerm: (value: string) => void,
  placeHolder?: string,
  user?: IUser
}

export function Search(props: Props) {
  const { isLeaderboardOpen, setIsLeaderboardOpen } = useUIContext();

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
    <div style={{ zIndex: 2, width: '100%', left: '50%', display: 'flex', justifyContent:'space-around', margin: 'auto' }}>
      <SearchBar setSearchTerm={props.setSearchTerm}
                 onClick={() => setIsLeaderboardOpen(true)}
                 isVisible={!isLeaderboardOpen}
      >
        {props.placeHolder || ''}
      </SearchBar>
    </div>
  );
}