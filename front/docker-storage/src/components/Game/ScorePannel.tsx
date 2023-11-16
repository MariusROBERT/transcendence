import {Flex} from '..';
import {IUser} from '../../utils/interfaces';
import React, {useEffect} from 'react';
import ScoreUser from './ScoreUser';
import {useUIContext} from '../../contexts';

interface Props {
  user2: IUser;
  user1: IUser;
  score1: number;
  score2: number;
  won:boolean;
}

const ScorePannel = ({user1, user2, score1, score2, won}: Props) => {
  const { setPaused } = useUIContext();
  useEffect(() => { setPaused(false)}, []);
  return (
    <div style={{
      background: won? 'radial-gradient(circle, rgba(9,6,64,1) 0%, rgba(0,212,255,1) 100%)':
        'radial-gradient(circle, rgba(62,6,64,1) 14%, rgba(255,4,108,1) 100%)',
      borderRadius:'50px',
      maxWidth: '95vw',
    }}>
    <Flex flex_direction="column" flex_alignItems="center" flex_gap={'0'} flex_wrap={'wrap'}>
      <ScoreUser user={user1}/>
      <div style={{
        position: 'relative',
        minWidth: '200px',
        height: '189px',
        // backgroundColor: 'grey',
      }}>
        <div id="score" style={{
          position: 'absolute',
          minWidth: '215px',
          width:'90%',
          minHeight: '215px',
          borderRadius: '50%',
          top: -13,
          left: -7,
          background: 'white',
          color: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <p style={{
            fontSize: 30, 
            minWidth:'8ch', 
            textAlign:'center',
            fontFamily:'title'
            }}>
          {(score1 === -1 ? 'FF' : score1) + ' VS ' + (score2 === -1 ? 'FF' : score2)}
          </p>
        </div>
      </div>
      <ScoreUser user={user2} mirror />
    </Flex>
    </div>
  );

};
export default ScorePannel;
  