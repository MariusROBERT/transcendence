import { RoundButton } from '../ComponentBase/RoundButton';
import { useNavigate } from 'react-router-dom';
import { Viewport } from '../../utils';
import { Background } from '..';

export function GameScore({ viewport }:{ viewport: Viewport }){
  const navigate = useNavigate();

  return (
    <Background flex_direction={viewport.isLandscape ? 'row' : 'column'}>
      <h2>GAME SCORE PANEL !!!</h2>
      <RoundButton icon={require('../../assets/imgs/icon_close.png')} onClick={() => {navigate('/')}}></RoundButton>
    </Background>
  );
}