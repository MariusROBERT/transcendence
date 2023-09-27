import { RoundButton, Flex, AuthGuard } from "..";
import { UserButton } from "./UserButton";
import { handleOpenProfil } from "../../utils/user_functions";
import { IUser, IUserComplete } from "../../utils/interfaces";
import { useState } from "react";
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
    <>
      {meUser && meUser.id === otherUser.id ?
        (<>
          <RoundButton icon={meUser.urlImg} icon_size={50} onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, meUser)}></RoundButton>
          <p onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, meUser)}>coucou cest moi: {meUser.username}</p>
        </>
        ) : (
          <>
            <Flex zIndex={'10'} flex_direction="row">
              <RoundButton icon={otherUser.urlImg} icon_size={50} onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, otherUser)}></RoundButton>
              <p onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, otherUser)}>{otherUser.username}</p>
            </Flex>
            {otherUser.user_status == 'on' ?
              <img style={statusStyle} src={require('../../assets/imgs/icon_green_connect.png')} />
              :
              <img style={statusStyle} src={require('../../assets/imgs/icon_red_disconnect.png')} />
            }
            <UserButton otherUser={otherUser} meUser={meUser}></UserButton>
          </>
        )}

      {profilVisible && (
        <AuthGuard isAuthenticated>
          <Profil otherUser={otherUser} meUser={meUser} onClose={closeProfil} />
        </AuthGuard>
      )}
    </>
  );
}
export default UserBanner;

const statusStyle = {
  width: '10px',
  height: '10px',
}
