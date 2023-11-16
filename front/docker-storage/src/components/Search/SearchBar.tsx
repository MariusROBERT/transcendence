import { color } from '../../utils';
import React from 'react';

interface Props {
  setSearchTerm: (value: string) => void,
  onClick?: () => void,
  children: string,
  isVisible: boolean
  id?: string
  style?: React.CSSProperties
}

export function SearchBar({ setSearchTerm, onClick, children, isVisible, id, style }: Props) {
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
        display: 'flex',
        flexDirection: 'row',
        ...style,
      }}
      className={'text cursor_pointer'}
    >
      <input
        id={id}
        style={{
          width: '100%',          
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
          paddingLeft: '10px',
          outline: 'none',
          borderRadius: '10px',
          position: 'relative',
          border: '0',
          // width: mobile ? 200 : 315,
          backgroundColor: color.white,
        }}
        maxLength={25}
        placeholder={children}
        onChange={handleInputChange}
        onClick={onClick || undefined}
      />
    </div>
  );
}
