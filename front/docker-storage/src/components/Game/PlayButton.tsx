import { Flex, RoundButton, SwitchToggle } from '..';
import { useGameContext } from '../../contexts';

export function PlayButton(){
  const { gameType, joinQueue } = useGameContext();
  let isSpecial = gameType === 'special';

  return (
    <>
      <Flex>
        <RoundButton icon_size={200} icon={require('../../assets/imgs/icon_play.png')} onClick={() => joinQueue(isSpecial ? 'special' : 'normal')}></RoundButton>
        <SwitchToggle onChange={() => {isSpecial = !isSpecial}} checked={isSpecial}></SwitchToggle>
      </Flex>
      <div style={{ height: '83px' }} />
    </>
  );
}
