import {Flex} from '..';
import {IUser} from '../../utils/interfaces';
import React from 'react';
import ScoreUser from './ScoreUser';

interface Props {
  user2: IUser;
  user1: IUser;
  score1: number;
  score2: number;
}

const ScorePannel = ({user1, user2, score1, score2}: Props) => {
  return (
    <Flex flex_direction="row" flex_alignItems="center" flex_gap={'0'}>
      <ScoreUser user={user1}/>
      <div style={{
        position: 'relative',
        minWidth: '200px',
        height: '189px',
        backgroundColor: 'grey',
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
          <p style={{fontSize: 30}}>
            {score1 === -1 ? 'FF' : score1} VS {score2 === -1 ? 'FF' : score2}
          </p>
        </div>
      </div>
      <ScoreUser user={user2} mirror/>
    </Flex>
  );

};
export default ScorePannel;
  