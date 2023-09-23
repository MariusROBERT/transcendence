import { color } from "../../utils";
import { RoundButton, Flex } from "..";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { IUser, IUserComplete } from "../../utils/interfaces";
import { lookGame, openChat, openOptionDropdown, sendFriendInvite, sendGameInvite } from "../../utils/user_functions";
import { useUserContext } from "../../contexts";

// TODO : Add Object User insteed of user_name and user icon
interface Props {
	otherUser: IUser;
	meUser: IUserComplete| undefined;
}

export function UserButton({ otherUser, meUser }: Props) {
	const jwtToken = Cookies.get('jwtToken');
	const [sendButton, setSendButton] = useState(false);
	const { setUser } = useUserContext();

	useEffect(() => {
		console.log("user has been updated in UserButton", meUser);
		if (meUser && meUser.invited.includes(otherUser.id as number)) {
			setSendButton(true);
		}
	}, [meUser]);

	const onClick = () => {
		if (!meUser)
			return 
		sendFriendInvite(otherUser.id, jwtToken);
		let usercpy = [...meUser.invited, otherUser.id];
		setUser({...meUser, invited: usercpy});
	}

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '12.5px', backgroundColor: color.grey, minWidth: '410px', height: '25px' }}>
				<Flex zIndex={'10'} flex_direction="row" flex_justifyContent={'space-evenly'}>
					{otherUser.is_friend && <RoundButton icon={require('../../assets/imgs/icon_chat.png')} onClick={() => openChat()}></RoundButton>}
					{otherUser.is_friend && <RoundButton icon={require('../../assets/imgs/icon_play.png')} onClick={() => sendGameInvite()}></RoundButton>}
					{otherUser.is_friend && <RoundButton icon={require('../../assets/imgs/icon_look_game.png')} onClick={() => lookGame()}></RoundButton>}
					{!otherUser.is_friend && !sendButton && 
						<RoundButton icon={require('../../assets/imgs/icon_add_friend.png')} onClick={onClick}></RoundButton>
					}
					<RoundButton icon={require('../../assets/imgs/icon_options.png')} onClick={() => openOptionDropdown()}></RoundButton>
				</Flex>
			</div>
		</>
	);
}
