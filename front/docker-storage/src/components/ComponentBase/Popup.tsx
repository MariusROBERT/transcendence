import React from 'react';

interface Props {
  children: React.ReactNode;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  style?: React.CSSProperties;
  mainDivStyle?: React.CSSProperties;
}

/*
  * You can put anything inside,
  * it will be centered on the screen 
  * and the background will be darkened
  *
  * Click outside the popup or on the top left X to close it
*/
export default function Popup(props: Props) {
  return (
    <div
      style={{
        visibility: props.isVisible ? 'visible' : 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: 'rgba(70,70,70,0.5)',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.mainDivStyle,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setIsVisible(false);
        }
      }}
    >
      {
        props.isVisible &&
        (<div style={{ position: 'relative', ...props.style }}>
          <p onClick={() => props.setIsVisible(false)}
             style={{
               position: 'absolute',
               top: '15px',
               left: '15px',
               fontSize: '1.5em',
               padding: '5px',
               margin: 0,
             }}>X
          </p>
          {props.children}
        </div>)
      }
    </div>
  );
}