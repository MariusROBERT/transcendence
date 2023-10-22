import { Leaderboard, Popup, SearchBar } from '..';
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
  const mobile = window.innerWidth < 500;

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

  const style: React.CSSProperties = {
   position: 'absolute',
   left: '48%',
   transform: 'translate(-50%)', 
   top: mobile ? 80 : 40,
   border: '0',
  }

  return (
   <div style={{ zIndex: 2 }}>
      <SearchBar setSearchTerm={props.setSearchTerm}
                 onClick={() => setSearchMode(true)}
                 isVisible={!searchMode}
                 style={style}
      >
        {props.placeHolder || ''}
      </SearchBar>
      <Popup isVisible={searchMode} setIsVisible={setSearchMode}>
        <div style={{

          display: 'flex',
          minHeight: mobile ? 100 : '300px',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'grey',
          borderRadius: '10px',
          padding: '15px',
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