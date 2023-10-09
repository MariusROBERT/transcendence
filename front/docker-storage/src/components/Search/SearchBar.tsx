import {color} from '../../utils';
import React from 'react';

interface Props {
  setSearchTerm: (value: string) => void,
  onClick?: () => void,
  children: string,
  isVisible: boolean
  id?: string
  style ?: React.CSSProperties
}

export function SearchBar({setSearchTerm, onClick, children, isVisible, id, style}: Props) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const mobile = window.innerWidth < 500;

  return (
    <div
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        margin: '30px',
        borderRadius: '10px',
        backgroundColor: color.white,
        height: mobile ? 40 : 60,
        width: mobile ? 250 : 400,
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        ...style,
      }}
      className={'text cursor_pointer'}
    >
      <img
        style={{
          height: mobile ? 50 : 80,
          width: mobile ? 50 : 80,
          position: 'relative',
          top: mobile ? -5 : -10,
          left: mobile ? -5 : -15,
        }}
        src={require('../../assets/imgs/icon_search.png')} alt={'search'}
      />
      <input
        id={id}
        style={{
          outline: 'none',
          borderRadius: '10px',
          border: '0',
          position: 'relative',
          width: mobile ? 200 : 315,
          backgroundColor: color.white,
        }}
        placeholder={children}
        onChange={handleInputChange}
        onClick={onClick || undefined}
      />
    </div>
  );
}
