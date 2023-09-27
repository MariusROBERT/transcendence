import { Flex, RoundButton } from '..';
import { UserButton } from './UserButton';
import { handleOpenProfil } from '../../utils/user_functions';
import { IUser, IUserComplete } from '../../utils/interfaces';
import { CSSProperties } from 'react';

// TODO : Add Object User insteed of user_name and user icon
interface Props {
  otherUser: IUser;
  meUser: IUserComplete | undefined;
  setSelectedUser?: any;
  setProfilVisible?: any;
}

const UserBanner = ({ otherUser, meUser, setSelectedUser, setProfilVisible }: Props) => {

  return (
    <div >
      {otherUser.id === meUser?.id ? (
        <div style={UserBannerContainer}>
          <Flex zIndex={'10'} flex_direction='row'>
            <RoundButton icon={meUser.urlImg} icon_size={50}
              onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, meUser)}></RoundButton> {/* go to own profil */}
            <p onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, meUser)}>coucou cest
              moi: {meUser.username}</p>
          </Flex>
        </div>
      ) : (
        <div style={UserBannerContainer}>
          <Flex zIndex={'10'} flex_direction='row'>
            <img style={statusStyle}
              src={otherUser?.user_status == 'on' ? require('../../assets/imgs/icon_status_connected.png') : require('../../assets/imgs/icon_status_disconnected.png')}
              alt={otherUser?.user_status ? 'connected' : 'disconnected'} />
            <RoundButton icon={otherUser.urlImg} icon_size={50}
              onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, otherUser)}></RoundButton>
            <p onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, otherUser)}>{otherUser.username}</p>
          </Flex>
          <UserButton otherUser={otherUser} meUser={meUser}></UserButton>
        </div>
      )}
    </div>
  );
};
export default UserBanner;

const UserBannerContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  border: '1px solid blue',
  width: '500px'
}

const statusStyle: CSSProperties = {
  position: 'absolute',
  left: "0px",
  top: "0px",
  width: '10px',
  height: '10px',
};
