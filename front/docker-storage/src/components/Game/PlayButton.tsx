import { SwitchToggle } from '..';
import { useGameContext } from '../../contexts';
import { useEffect, useState } from 'react';
import './playBtn.css';

export function PlayButton() {
  const { isInQueue, joinQueue } = useGameContext();
  const [isSpecial, setIsSpecial] = useState(false);

  useEffect(() => {
    if (!isInQueue) return;
    setIsSpecial(isInQueue === 'special');
  }, [isInQueue]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      justifyContent: 'center',
      position: 'relative',
    }}
    >
      <div
        className="btnContainer"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => {
          joinQueue(isSpecial ? 'special' : 'normal');
        }}
      >
        <img
          src={require('../../assets/imgs/pngwing.com (3).png')}
          alt={'Play'}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          justifyContent: 'center',
          position: 'absolute',
          bottom: -20,
          // zIndex: 10000,
        }}
      >
        <p>Special Mode: </p>
        <SwitchToggle
          onChange={() => {
            setIsSpecial(!isSpecial);
          }}
          checked={isSpecial}
        />
      </div>
    </div>
  );
}
