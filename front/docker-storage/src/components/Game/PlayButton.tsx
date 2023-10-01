import { RoundButton } from '../RoundButton/RoundButton';
import React from 'react';
import { useGameContext } from '../../contexts';

export function PlayButton(){
  const [gameType, setGameType] = React.useState<'normal' | 'special'>('normal');
  const { joinQueue } = useGameContext();

  return (
    <>
      <div style={Btn}>
        <RoundButton icon_size={200} icon={require('../../assets/imgs/icon_play.png')} onClick={() => joinQueue('normal')}></RoundButton>
      </div>
      <div style={{ height: '60px' }} />
    </>
  );
}

const Btn: React.CSSProperties = {
  left: '50%',
  top: '50%',
  transform: 'translate(0%, -12%)'
}
