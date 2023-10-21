import { IUser } from '../../utils/interfaces';
import React, { useEffect, useState } from 'react';
import { UserButton } from '../User/UserButton';
import { useUserContext } from '../../contexts';
import { Popup } from '../index';
import { useUIContext } from '../../contexts/UIContext/UIContext';
import { Fetch } from '../../utils';


export default function Profil() {
  const { isProfileOpen, setIsProfileOpen } = useUIContext();
  const { id, user } = useUserContext();
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
    borderRadius: '10px',
    padding: mobile ? 15 : 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    background: 'grey',
    height: '100%',
    color: 'white',
    margin: mobile ? 5 : 10,
    cursor: 'pointer',
    minWidth: '300px',
  };

  const imgStyle = {
    width: '200px',
    borderRadius: '5px',
    border: '2px solid',
  };

  const statusStyle = {
    width: '10px',
    height: '10px',
  };

  if (isProfileOpen === 0)
    return (<></>);

  return (
    <Popup isVisible={isProfileOpen !== 0} onClose={() => setIsProfileOpen(0)}>
      <div style={profilContainer}>
        {mobile ?
          <h3>{profilUser?.username}</h3> :
          <h2>{profilUser?.username}</h2>
        }
        <p>ID : {profilUser?.id}</p>
        <img style={imgStyle} src={profilUser?.urlImg} alt={'user'} />
        <img style={isProfileOpen !== id ? statusStyle : (profilUser?.user_status ? statusStyle : imgStyle)}
             src={profilUser?.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') :
               require('../../assets/imgs/icon_red_disconnect.png')}
             alt={profilUser?.user_status === 'on' ? 'connected' : 'disconnected'} />
        <hr style={{ width: '100%' }} />
        <p>LAST MATCHS</p>
        <p>--------------</p>
        <p>--------------</p>
        <p>LAST MATCHS</p>
        <p>Winrate : {profilUser?.winrate}</p>
        {isProfileOpen !== id && profilUser && <UserButton otherUser={profilUser} />}
      </div>
    </Popup>
  );

}

