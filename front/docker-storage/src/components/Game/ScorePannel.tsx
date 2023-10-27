import {Flex} from '..';
import {IUser} from '../../utils/interfaces';
import React from 'react';
import ScoreUser from './ScoreUser';

interface Props {
  user2: IUser;
  user1: IUser;
  score1: number;
  score2: number;
  won:boolean;
}

const ScorePannel = ({user1, user2, score1, score2, won}: Props) => {
  return (
    <div style={{
      background: won? 'radial-gradient(circle, rgba(9,6,64,1) 0%, rgba(0,212,255,1) 100%)':
        'radial-gradient(circle, rgba(62,6,64,1) 14%, rgba(255,4,108,1) 100%)',
      borderRadius:'50px',
    }}>
    <Flex flex_direction="row" flex_alignItems="center" flex_gap={'0'}>
      {<ScoreUser user={user1} won={won}/>}
      <div style={{
        position: 'relative',
        minWidth: '200px',
        height: '189px',
        // backgroundColor: 'grey',
      }}>
        <div id="score" style={{
          position: 'absolute',
          minWidth: '215px',
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
          {/* {(score1 === -1 ? 'FF' : score1) + ' VS ' + (score2 === -1 ? 'FF' : score2)} */}
            {won ? ((score1 === -1 ? 'FF' : score1) + ' VS ' + (score2 === -1 ? 'FF' : score2)):
              ((score2 === -1 ? 'FF' : score2) + ' VS ' + (score1 === -1 ? 'FF' : score1))}
          </p>
        </div>
      </div>
      <ScoreUser user={user2} mirror won={!won} />
    </Flex>
    </div>
  );

};
export default ScorePannel;
  