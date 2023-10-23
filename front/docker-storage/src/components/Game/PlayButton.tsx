import { Flex, SwitchToggle } from '..';
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

  const mobile = window.innerWidth < 500;

  return (
    <>
      <div style={{height: '350px' }}>
        <div className='btnContainer' onClick={() => {
          joinQueue(isSpecial ? 'special' : 'normal');
        }}>
          <img src={require('../../assets/imgs/pngwing.com (3).png')} />
        </div>
        {/* <RoundButton
          icon_size={mobile ? 175 : 200}
          icon={require('../../assets/imgs/icon_play.png')}
          onClick={() => {
            joinQueue(isSpecial ? 'special' : 'normal');
          }} /> */}
        <Flex flex_direction={'row'}>
          <p>Special Mode: </p>
          <SwitchToggle onChange={() => {
            setIsSpecial(!isSpecial);
          }} checked={isSpecial}></SwitchToggle>
        </Flex>
        <div style={{ height: mobile ? 38 : 56 }} />
      </div>
    </>
  );
}
