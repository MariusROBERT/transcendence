import React, { ReactNode } from 'react';
import { Background, Border } from '..';
import { color } from '../../utils';

interface Props {
  children?: ReactNode;
  heading: string;
  duration_ms: number;
}

export function GroupItems({ children, heading, duration_ms }: Props) {

  const groupStyle: React.CSSProperties = {
    width: '100%',
    paddingTop: '25px',
    paddingRight: '5px',
    paddingLeft: '15px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    overflowX: 'hidden',
    height: '100%',
    transition: duration_ms + 'ms ease',
  };

  return (
    <>
      <Border
        borderSize={0}
        height={50}
        borderColor={color.black}
        borderRadius={0}
      >
        <Background
          bg_color={color.grey}
          flex_direction={'row'}
          flex_justifyContent={'flex-end'}
        >
          <h2 style={{ position: 'absolute', left: 5 }}>{heading}</h2>
        </Background>
      </Border>
      <div style={groupStyle}>
        {children}
      </div>
    </>
  );
}