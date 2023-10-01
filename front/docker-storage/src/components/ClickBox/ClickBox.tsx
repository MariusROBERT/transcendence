import { useEffect, useState } from 'react';
import { subscribe, unsubscribe } from '../../utils/event';

interface Props {
  close: boolean;
  pos: any;
}

export function ClickBox({close, pos}: Props) {
  //const [visible, setVisible] = useState<boolean>(false);
  //const [position, setPosition] = useState({ x: 0, y: 0 });

  const ClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    //if (!target.closest('#userIconContainer')) {
    //  setVisible(false);
    //}
  };

  //useEffect(() => {
  //  if (visible) {
  //    subscribe('click', ClickOutside);
  //  } else {
  //    subscribe('click', ClickOutside);
  //  }
  //  return () => {
  //    unsubscribe('click', ClickOutside);
  //  };
  //}, [visible]);

  return (
    <div>
      {close && (
        <div
          style={{
            position: 'absolute',
            top: pos.y,
            left: pos.x,
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: '#fff',
            zIndex: 9999,
          }}
        >
          <p>Options</p>
          <p>Options</p>
          <p>Options</p>
          <p>Options</p>
          <p>Options</p>
          <p>Options</p>
          <button onClick={() => console.log('click')}>Options</button>
        </div>
      )}
    </div>
  );
}
