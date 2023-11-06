import React from 'react';
import { RoundButton } from './RoundButton';

interface Props {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
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

  function escape(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.isVisible)
      props.onClose();
  }

  React.useEffect(() => {
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, []);

  return (
    <div
      style={{        
        visibility: props.isVisible ? 'visible' : 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 110,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.mainDivStyle,
      }}
    >
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
           onClick={(e) => {
             if (e.target === e.currentTarget) {
               props.onClose();
             }
           }}></div>
      {
        props.isVisible &&
        (<div style={{ position: 'relative', ...props.style, }}>
          <div style={{
               position: 'absolute',
               top: '2%',
               left: '3%',
               fontSize: '1.5em',
               padding: '5px',
               margin: 0,
             }}>
            </div>
          {props.children}
        </div>)
      }
    </div>
  );
}