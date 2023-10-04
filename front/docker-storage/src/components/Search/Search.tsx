import { SearchBar, Leaderboard, Popup } from '..';
import React, { useEffect, useState } from 'react';
import { IUser } from '../../utils/interfaces';

interface Props {
  searchTerm: string,
  setSearchTerm: (value: string) => void,
  placeHolder?: string,
  user?: IUser
}

export function Search(props: Props) {
  const [searchMode, setSearchMode] = useState<boolean>(false);

  useEffect(() => {
    const input = document.getElementById('searchBar') as HTMLInputElement;
    if (searchMode)
      input?.focus();
    else {
      if (input)
        input.value = '';
      props.setSearchTerm('');
    }
    // eslint-disable-next-line
  }, [searchMode]);

  return (
    <div>
      <SearchBar setSearchTerm={props.setSearchTerm}
                 onClick={() => setSearchMode(true)}
                 isVisible={!searchMode}>
        {props.placeHolder || ''}
      </SearchBar>
      <Popup isVisible={searchMode} setIsVisible={setSearchMode}>
        <div style={{
          display: 'flex',
          minHeight: '300px',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'grey',
          borderRadius: '10px',
          padding: '10px',
        }}>
          <SearchBar setSearchTerm={props.setSearchTerm}
                     isVisible={searchMode}
                     id={'searchBar'}>
            {props.placeHolder || ''}
          </SearchBar>
          <Leaderboard
            searchTerm={props.searchTerm}
          />
        </div>
      </Popup>
    </div>
  );
}