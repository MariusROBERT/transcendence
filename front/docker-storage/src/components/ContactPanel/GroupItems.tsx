import React, { ReactNode, useState } from 'react';
import { Background, Border } from '..';
import { color } from '../../utils';

interface Props {
  children?: ReactNode;
  heading: string;
  duration_ms: number;
}

export function GroupItems({ children, heading, duration_ms }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // const mobile = window.innerWidth < 500;

  const groupStyle: React.CSSProperties = {
    width: '100%',
    paddingTop: isOpen ? '25px' : '0px',
    paddingRight: '5px',
    paddingLeft: '15px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    overflowX: 'hidden',
    height: isOpen ? '100%' : '0px',
    transition: duration_ms + 'ms ease',
  };

  function openGroup() {
    setIsOpen(!isOpen);
  }

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
          onClick={openGroup}
        >
          <h2 style={{ position: 'absolute', left: 5 }} onClick={() => {
              openGroup();
            }}>{heading}</h2>
          {/* <div style={buttonStyle}>
            <RoundButton icon={require('../../assets/imgs/side_panel_button.png')} icon_size={40} onClick={() => {
              openGroup();
            }} /></div> */}
        </Background>
      </Border>
      <div style={groupStyle}>
        {children}
      </div>
    </>
  );
}
