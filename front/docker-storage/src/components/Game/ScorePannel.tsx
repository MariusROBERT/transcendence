import { AuthGuard, Flex, RoundButton, Profil, Popup } from '..';
import { UserButton } from '../User/UserButton';
import { Background, UserBanner } from '..';
import { useUserContext } from '../../contexts';
import { IUser } from '../../utils/interfaces';
import React, { CSSProperties, useState } from 'react';

interface Props {
    user2: IUser;
    user1: IUser;
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
                    <div style={{...nameStyle, color:'blue'}}>
                        {user1.username}
                    </div>
                    <div>
                    <RoundButton icon={user1.urlImg} icon_size={100} 
                            onClick={() => setProfilVisible(true)} />
                    </div>
                </Flex>
                <div>
                    <Flex flex_alignItems='center'>
                        <p>Games Played</p>
                        <p>{user1.gamesPlayed}</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_alignItems='center'>
                        <p>Winrate</p>
                        <p>{user1.winrate} %</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_alignItems='center'>
                        <p>ELO</p>
                        <p>{user1.elo}</p>
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
                        <p>ELO</p>
                        <p>{user2.elo}</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_alignItems='center'>
                        <p>Winrate</p>
                        <p>{user2.winrate} %</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_alignItems='center'>
                        <p>Games Played</p>
                        <p>{user2.gamesPlayed}</p>
                    </Flex>
                </div>
                <div>
                    <Flex flex_direction='column'>
                        <div style={{...nameStyle, color:'red'}}>{user2.username}</div>
                        <div>
                        <RoundButton icon={user2.urlImg} icon_size={100} 
                                onClick={() => setProfilVisible(true)} />
                        </div>
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

  const nameStyle: CSSProperties = {
    marginTop: '5px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px #000000',
    fontSize:'20px',
  };
  