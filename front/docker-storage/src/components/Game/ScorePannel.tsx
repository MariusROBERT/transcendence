import { AuthGuard, Flex, RoundButton, Profil, Popup } from '..';
import { UserButton } from '../User/UserButton';
import { Background, UserBanner } from '..';
import { useUserContext } from '../../contexts';
import { IUser, IUserComplete } from '../../utils/interfaces';
import React, { CSSProperties, useState } from 'react';

interface Props {
    user2: IUser;
    user1: IUserComplete;
    score1:number;
    score2:number;
  }

const ScorePannel = ({ user1, user2, score1, score2 }: Props) => {

    const [profilVisible, setProfilVisible] = useState<boolean>(false);

  return (
    <div style={{background:'grey'}}>
        <Flex flex_direction='row' flex_gap='5px 30px' flex_alignItems='space-around' flex_justifyContent='center'>
        <div>
            <Flex flex_direction='row' flex_gap='5px 20px'>
                <Flex flex_direction='column'>
                    <div>
                        {user1.username}
                    </div>
                    <div>
                    <RoundButton icon={user1.urlImg} icon_size={100} 
                            onClick={() => setProfilVisible(true)} />
                    </div>
                </Flex>
                <div>
                    <Flex flex_alignItems='center'>
                        <p style={tdStyle}>Games Played</p>
                        <p style={tdStyle}>{user1.gamesPlayed}</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_alignItems='center'>
                        <p style={tdStyle}>Winrate</p>
                        <p style={tdStyle}>{user1.winrate} %</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_alignItems='center'>
                        <p style={tdStyle}>ELO</p>
                        <p style={tdStyle}>{user1.elo}</p>
                    </Flex>
                </div>
            </Flex>
        </div>
        <div id='score' style={{width: '150px', maxHeight:'100 px', borderRadius:'50%', background: 'white', color:'black', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'30px'}}>
            {score1} VS {score2}
        </div>
        <div>
            <Flex flex_direction='row' flex_gap='5px 20px'>
                <div>
                    <Flex flex_alignItems='center'>
                        <p style={tdStyle}>ELO</p>
                        <p style={tdStyle}>{user2.elo}</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_alignItems='center'>
                        <p style={tdStyle}>Winrate</p>
                        <p style={tdStyle}>{user2.winrate} %</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_alignItems='center'>
                        <p style={tdStyle}>Games Played</p>
                        <p style={tdStyle}>{user2.gamesPlayed}</p>
                    </Flex>
                </div>
                <div style={{position:'relative'}}>
                    <Flex flex_direction='column' flex_alignItems='center' flex_gap='30px 5px'>
                        {<img style={{...statusStyle, position: 'absolute'}}
                                    src={user2.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') : 
                                    require('../../assets/imgs/icon_red_disconnect.png')}
                                    alt={user2.user_status ? 'connected' : 'disconnected'} />}
                        <div style={{position:'absolute', top: -20}}>{user2.username}</div>
                        <RoundButton icon={user2.urlImg} icon_size={100} 
                                onClick={() => setProfilVisible(true)} />
                    </Flex>
                </div>
            </Flex>
        </div>
        </Flex>
    </div>
  )  

}
export default ScorePannel;

const UserBannerContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '400px',
};

const statusStyle: CSSProperties = {
    position: 'absolute',
    right: '0px',
    top: '0px',
    width: '10px',
    height: '10px',
  };

  const tdStyle = {

  };
  