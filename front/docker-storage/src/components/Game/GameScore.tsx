import { RoundButton } from '../ComponentBase/RoundButton';
import { useNavigate } from 'react-router-dom';
import { Viewport } from '../../utils';
import { Background } from '..';
import { useUserContext } from '../../contexts';
import { Fetch } from '../../utils';
import { TheWinnerIs } from './TheWinnerIs';
import React, { useEffect } from 'react';

// Johan



export function GameScore({ viewport }: { viewport: Viewport }) {
  const { id } = useUserContext();
  const navigate = useNavigate();
  const [won, setWon] = React.useState(false);
  const [score, setScore] = React.useState(0);

  async function getScore() {
    const game = (await (await Fetch('game/get_last_game/' + id, 'GET'))?.json)?.game; 
    console.log(game);
    setScore(game.elo1);
    (id === game.winner ? setWon(true):setWon(false));
  }

  useEffect(() => {
    if (id === 0)
      return ;
    getScore();
  }, [id]);

  

  return (
    <Background flex_direction={viewport.isLandscape ? 'row' : 'column'}>
      <TheWinnerIs won={won}></TheWinnerIs>
      <RoundButton icon={require('../../assets/imgs/icon_close.png')} onClick={() => {
        navigate('/');
      }}></RoundButton>
      
    </Background>
  );
}