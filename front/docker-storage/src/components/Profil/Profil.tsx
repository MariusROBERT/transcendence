import {GameHistory, IUser} from '../../utils/interfaces';
import React, {CSSProperties, useEffect, useState} from 'react';
import {UserButton} from '../User/UserButton';
import {useUserContext} from '../../contexts';
import {Flex, Popup, RoundButton} from '../index';
import {useUIContext} from '../../contexts/UIContext/UIContext';
import {Fetch} from '../../utils';
import GameHistoryBanner from './GameHistoryBanner';


export default function Profil() {
  const {isProfileOpen, setIsProfileOpen} = useUIContext();
  const {id, user} = useUserContext();
  const [games, setGames] = useState<GameHistory[]>([]);
  const mobile = window.innerWidth < 500;
  const [profilUser, setProfilUser] = useState<IUser | undefined>(undefined);


  useEffect(() => {
    async function setProfil() {
      const profil = (await Fetch('user/get_public_profile_by_id/' + isProfileOpen, 'GET'))?.json;
      if (profil)
        return setProfilUser(profil);
      return setProfilUser(undefined);
    }

    if (isProfileOpen === 0)
      return setProfilUser(undefined);
    if (isProfileOpen === id)
      return setProfilUser(user);
    setProfil();
  }, [isProfileOpen]);

  const profilContainer: React.CSSProperties = {
    borderRadius: '50px',
    padding: mobile ? 15 : 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    background: '#00375C',
    height: '100%',
    color: 'white',
    margin: mobile ? 5 : 10,
    cursor: 'pointer',
    minWidth: '300px',
  };

  useEffect(() => {
    if (profilUser)
      getGames();
  }, [profilUser]);

  const imgStyle = {
    width: '200px',
    borderRadius: '5px',
    border: '2px solid',
  };

  const statusStyle = {
    width: '10px',
    height: '10px',
  };

  async function getGames() {
    const tmp: { gameHist: GameHistory[] } = (await Fetch('Game/get_game/' + profilUser?.id, 'GET'))?.json;
    setGames(tmp.gameHist);
  }

  if (isProfileOpen === 0)
    return (<></>);

  return (
    <Popup isVisible={isProfileOpen !== 0} onClose={() => setIsProfileOpen(0)}>
      <div style={profilContainer}>
        {mobile ?
          <h3 style={nameStyle}>{profilUser?.username}</h3> :
          <h2 style={nameStyle}>{profilUser?.username}</h2>
        }
        <Flex flex_direction="row">
          <div style={{alignItems: 'center'}}>
            {profilUser ? <RoundButton icon={profilUser.urlImg} icon_size={250} onClick={() => null}/> : <p>No Image</p>}
            <img style={isProfileOpen !== id ? statusStyle : (profilUser?.user_status ? statusStyle : imgStyle)}
                 src={profilUser?.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') :
                   require('../../assets/imgs/icon_red_disconnect.png')}
                 alt={profilUser?.user_status === 'on' ? 'connected' : 'disconnected'}/>
          </div>
          <div style={{marginLeft: '50px'}}>
            <div style={{flexDirection: 'row', display: 'flex'}}>
              <p style={ProfilStyle}>Rank </p> <p style={ProfilStyle}> : {user?.rank}</p>
            </div>
            <div style={{flexDirection: 'row', display: 'flex'}}>
              <p style={ProfilStyle}>Elo </p><p style={ProfilStyle}>: {user?.elo}</p>
            </div>
            <div style={{flexDirection: 'row', display: 'flex'}}>
              <p style={ProfilStyle}>Winrate</p><p style={ProfilStyle}> : {user?.winrate} %</p>
            </div>
            <div style={{flexDirection: 'row', display: 'flex'}}>
              <p style={ProfilStyle}>Games played </p><p style={ProfilStyle}> : {user?.gamesPlayed}</p>
            </div>
          </div>
        </Flex>
        <hr style={{width: '100%'}}/>
        <div>
          <p style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            margin: '10px 0',
            padding: '1px 0',
            fontSize: '60px'
          }}>MATCH HISTORY</p>
          {
            games?.length === 0 ?
              <p style={{display: 'flex', justifyContent: 'center', margin: '10px 0'}}>No games played yet</p>
              :
              <div style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                margin: '1px 0',
              }}>
                <Flex flex_alignItems="center">
                  <p style={{
                    fontSize: '25px',
                    paddingRight: '30px',
                    paddingLeft: '30px',
                    minWidth: '8ch',
                    textAlign: 'center'
                  }}>You</p>
                </Flex>
                <Flex flex_alignItems="center">
                  <p style={{fontSize: '25px', paddingRight: '30px'}}>Elo</p>
                </Flex>
                <Flex flex_alignItems="center">
                  <p style={{fontSize: '35px', paddingRight: '30px'}}>Score</p>
                </Flex>
                <Flex flex_alignItems="center">
                  <p style={{fontSize: '25px', paddingRight: '30px'}}>Elo</p>
                </Flex>
                <Flex flex_alignItems="center">
                  <p style={{fontSize: '25px', paddingRight: '30px'}}>Opponent</p>
                </Flex>
              </div>
          }
        </div>
        <div style={{maxHeight: '400px', overflowY: 'scroll'}}>
          {games?.map((game) => (
            <GameHistoryBanner game={game} key={game.id}/>
          ))}
        </div>
        {isProfileOpen !== id && profilUser && <UserButton otherUser={profilUser}/>}
      </div>
    </Popup>
  );

}

const ProfilStyle: CSSProperties = {
  minWidth: '13ch',
  fontSize:'20px'
};

const nameStyle: CSSProperties = {
  fontSize:'80px'
};