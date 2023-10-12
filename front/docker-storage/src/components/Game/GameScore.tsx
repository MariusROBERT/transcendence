import { useNavigate } from 'react-router-dom';
import { Viewport } from '../../utils';
import { Background, UserBanner } from '..';
import { useUserContext } from '../../contexts';
import { Fetch } from '../../utils';
import { IUser, IUserComplete } from '../../utils/interfaces';
// import  UserBanner  from '../User/UserBanner';
import { TheWinnerIs} from './TheWinnerIs';
import ScorePannel from './ScorePannel';
import React, { useEffect } from 'react';
import { Flex, RoundButton } from '..';

// Johan



export function GameScore({ viewport }: { viewport: Viewport }) {
  const { id } = useUserContext();
  const navigate = useNavigate();
  const [won, setWon] = React.useState(false);

  const [game, setGame] = React.useState<any | undefined>(undefined);
  const [profil1, setProfil1] = React.useState<IUserComplete>();
  const [profil2, setProfil2] = React.useState<IUser>();
  
  async function getScore() {
    const res = await Fetch('game/get_last_game/' + id, 'GET');
    const g = await res?.json.game;
    setGame(g);
    if(!g)
    {
      navigate('/');
      return ;
    }
    const user1 = (await( Fetch ('user', 'GET')))?.json;
    console.log(g);
    const user2 = (g.player1 === id) ? (await( Fetch ('user/get_public_profile_by_id/' + g.player2, 'GET')))?.json : 
    (await( Fetch ('user/get_public_profile_by_id/' + g.player1, 'GET')))?.json;
    
    setProfil1(user1);
    setProfil2(user2);
    console.log(user1);
    console.log(user2);
    (id === g.winner ? setWon(true):setWon(false));
  }

  useEffect(() => {
    if (id === 0)
      return ;
    getScore();
  }, [id]);

  useEffect(() => {
    getScore();
  }, []);

  return (
    <Background flex_direction={viewport.isLandscape ? 'row' : 'column'}>
      <Flex>
        <div>
        <TheWinnerIs won={won}></TheWinnerIs>
        </div>
        <div>
          {
            profil1 && profil2 &&
            <ScorePannel user1={profil1} user2={profil2} score1={game.points1} score2={game.points2} />
          }
        </div>
        <div>
          <RoundButton icon={require('../../assets/imgs/icon_close.png')} onClick={() => {
            navigate('/');
          }}></RoundButton>
        </div>
      </Flex>
      
    </Background>
  );
}