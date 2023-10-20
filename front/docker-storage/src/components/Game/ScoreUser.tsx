import {Flex} from '../ComponentBase/FlexBox';
import {RoundButton} from '../ComponentBase/RoundButton';
import React, {CSSProperties} from 'react';
import {IUser} from '../../utils/interfaces';

interface Props {
  user: IUser;
  mirror?: boolean;
}

export default function ScoreUser({user, mirror}: Props) {
  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: mirror ? 'row-reverse' : 'row',
        justifyContent: 'space-evenly',
        margin: '30px 0',
        padding: '0 20px',
        background: 'grey',
        borderRadius: mirror ? '0 30px 30px 0' : '30px 0 0 30px',
      }}>
        <Flex flex_direction="column">
          <div style={nameStyle}>
              {user.username}
          </div>
          <div>
            <RoundButton icon={user.urlImg} icon_size={130}
                         onClick={() => null}/>
          </div>
        </Flex>
        <Flex flex_alignItems="center">
          <p>Games Played</p>
          <p>{user.gamesPlayed}</p>
        </Flex>
        <Flex flex_alignItems="center">
          <p>Winrate</p>
          <p>{user.winrate} %</p>
        </Flex>
        <Flex flex_alignItems="center">
          <p>ELO</p>
          <p>{user.elo}</p>
        </Flex>
      </div>
    </div>
  );
}

const nameStyle: CSSProperties = {
  marginTop: '5px',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px #000000',
  fontSize: 20,
  fontFamily: 'robot_font, sans-serif'
};
