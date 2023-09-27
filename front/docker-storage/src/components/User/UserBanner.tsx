import { RoundButton, Flex, AuthGuard } from "..";
import { UserButton } from "./UserButton";
import { handleOpenProfil } from "../../utils/user_functions";
import { IUser, IUserComplete } from "../../utils/interfaces";
import { CSSProperties, useState } from "react";
import Profil from "../Profil/profil";

interface Props {
  otherUser: IUser
  meUser: IUserComplete
}

const UserBanner = ({ otherUser, meUser }: Props) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);

  const closeProfil = () => {
    setSelectedUser(null);
    setProfilVisible(!profilVisible);
  };

  return (
    <div>
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
              src={otherUser?.user_status == 'on' ? require('../../assets/imgs/icon_green_connect.png') : require('../../assets/imgs/icon_red_disconnect.png')}
              alt={otherUser?.user_status ? 'connected' : 'disconnected'} />
            <RoundButton icon={otherUser.urlImg} icon_size={50}
              onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, otherUser)}></RoundButton>
            <p onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, otherUser)}>{otherUser.username}</p>
          </Flex>
          <UserButton otherUser={otherUser} meUser={meUser}></UserButton>
        </div>
        
      )}
       {profilVisible && (
        <AuthGuard isAuthenticated>
          <Profil otherUser={otherUser} meUser={meUser} onClose={closeProfil} />
        </AuthGuard>
      )}
    </div>
  );
}
export default UserBanner;

const UserBannerContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '400px'
}

const statusStyle: CSSProperties = {
  position: 'absolute',
  left: "0px",
  top: "0px",
  width: '10px',
  height: '10px',
};
