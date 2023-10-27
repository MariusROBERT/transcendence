import { GameHistory, IUser } from '../../utils/interfaces';
import { AuthGuard, Flex, RoundButton, Profil, Popup } from '..';
import React, { CSSProperties, useState } from 'react';
import { useUIContext } from '../../contexts/UIContext/UIContext';

interface Props {
    game:GameHistory;
}

const GameHistoryBanner = ({game }: Props) => {
  const { setIsProfileOpen } = useUIContext();
    return (
        <div style={{marginBottom:'5px', alignItems:'column', justifyContent: 'center', display: 'flex', position:'relative'}}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            margin: '4px 0',
            padding: '0 4px',
            background:game.scoreUser>game.scoreOpponent? 'radial-gradient(circle, rgba(9,6,64,1) 0%, rgba(0,212,255,1) 100%)':
            'radial-gradient(circle, rgba(62,6,64,1) 14%, rgba(255,4,108,1) 100%)',
            borderRadius: '30px',
          }}>
            <Flex flex_direction="column">
              <div style={nameStyle}>
                  {game.user}
              </div>
              <div>
                <RoundButton icon={game.urlImgUser} icon_size={60}
                             onClick={() => null}/>
              </div>
            </Flex>
            <Flex flex_alignItems="center">
              <p style={{marginRight:'20px', marginLeft:'15px'}}>{game.eloUser}</p>
            </Flex>
            <Flex flex_alignItems="center">
              <p style={{marginRight:'20px', fontSize:'35px'}}>{game.scoreUser === -1 ? 'FF' : game.scoreUser} - {game.scoreOpponent=== -1 ? 'FF' : game.scoreOpponent}</p>
            </Flex>
            <Flex flex_alignItems="center">
              <p style={{marginRight:'15px'}}>{game.eloOpponent}</p>
            </Flex>
            <Flex flex_direction="column">
              <div style={nameStyle} onClick={() => setIsProfileOpen(game.idOpponent || 0)}>
                  {game.opponent}
              </div>
              <div>
                <RoundButton icon={game.urlImgOpponent} icon_size={60}
                             onClick={() => setIsProfileOpen(game.idOpponent || 0)}/>
              </div>
            </Flex>
          </div>
          <p style={{marginRight:'20px', fontSize:'8px', position:'absolute', bottom:'0'}}>{game.date.toLocaleString().slice(0,10)}</p>
        </div>
      );
    }
    
    const nameStyle: CSSProperties = {
      marginTop: '5px',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px #000000',
      fontSize: 20,
      minWidth: '11ch',
      textAlign:'center',
      fontFamily: 'robot_font, sans-serif'
    };
    
    export default GameHistoryBanner;