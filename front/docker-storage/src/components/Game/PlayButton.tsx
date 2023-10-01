import { Flex, RoundButton, SwitchToggle } from '..';
import { useGameContext } from '../../contexts';
import { useEffect, useState } from 'react';

export function PlayButton() {
  const { isInQueue, joinQueue } = useGameContext();
  const [isSpecial, setIsSpecial] = useState(false);

  useEffect(() => {
    if (!isInQueue) return;
    setIsSpecial(isInQueue === 'special');
  }, [isInQueue]);

  return (
    <>
      <Flex>
        <RoundButton
          icon_size={200}
          icon={require('../../assets/imgs/icon_play.png')}
          onClick={() => {
            joinQueue(isSpecial ? 'special' : 'normal');
          }}></RoundButton>
        <Flex flex_direction={'row'}>
          <p>Special Mod: </p>
          <SwitchToggle onChange={() => {
            setIsSpecial(!isSpecial);
          }} checked={isSpecial}></SwitchToggle>
        </Flex>
      </Flex>
      <div style={{ height: '83px' }} />
    </>
  );
}
