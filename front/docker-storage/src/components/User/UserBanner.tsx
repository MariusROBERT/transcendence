import { color } from "../../utils";
import { RoundButton, Flex } from "..";
import { UserButton } from "./UserButton";
import { handleOpenProfil, openProfile } from "../../utils/user_functions";
import { IUser, IUserComplete } from "../../utils/interfaces";
import { useEffect } from "react";

// TODO : Add Object User insteed of user_name and user icon
interface Props{
    otherUser: IUser
    meUser: IUserComplete|undefined
    setSelectedUser?: any
    setProfilVisible?: any
}

const UserBanner = ({ otherUser, meUser, setSelectedUser, setProfilVisible }: Props) => {

    return (
	<>
		<Flex zIndex={'10'} flex_direction="row">
		<RoundButton icon={otherUser.urlImg} icon_size={50} onClick={() => handleOpenProfil( setSelectedUser, setProfilVisible, otherUser)}></RoundButton>
		<p onClick={() => handleOpenProfil( setSelectedUser, setProfilVisible, otherUser)}>{otherUser.username}</p>
		</Flex>
		{otherUser.user_status ? 
			<img style={statusStyle} src={require('../../assets/imgs/icon_status_connected.png')} />
			:
			<img style={imgStyle} src={require('../../assets/imgs/icon_status_disconnected.png')} />
		}
		<UserButton otherUser={otherUser} meUser={meUser}></UserButton>
	</>
	);
}
export default UserBanner;

const imgStyle = {
    width: '100px',
    height: '100px',
    border: '1px solid red',
  };
  
  const statusStyle = {
    width: '10px',
    height: '10px',
  }
  