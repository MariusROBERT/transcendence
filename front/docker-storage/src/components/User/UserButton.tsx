import { color } from "../../utils";
import { RoundButton, Flex } from "..";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { IUser } from "../../utils/interfaces";
import { lookGame, openChat, openOptionDropdown, sendFriendInvite, sendGameInvite } from "../../utils/user_functions";

// TODO : Add Object User insteed of user_name and user icon
interface Props {
	otherUser: IUser
	meUser: IUser| undefined;
	setUserComplete: any;
}

export function UserButton({ otherUser, meUser, setUserComplete }: Props) {
	const jwtToken = Cookies.get('jwtToken');
	const [sendButton, setSendButton] = useState(false);

	useEffect(() => {
		if (meUser && meUser.invited.includes(otherUser.id as number)) {
			setSendButton(true);
		}
		setUserComplete(meUser)
	}, [otherUser, meUser]);

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '12.5px', backgroundColor: color.grey, minWidth: '410px', height: '25px' }}>
				<Flex zIndex={'10'} flex_direction="row" flex_justifyContent={'space-evenly'}>
					{otherUser.is_friend && <RoundButton icon={require('../../assets/imgs/icon_chat.png')} onClick={() => openChat()}></RoundButton>}
					{otherUser.is_friend && <RoundButton icon={require('../../assets/imgs/icon_play.png')} onClick={() => sendGameInvite()}></RoundButton>}
					{otherUser.is_friend && <RoundButton icon={require('../../assets/imgs/icon_look_game.png')} onClick={() => lookGame()}></RoundButton>}
					{!otherUser.is_friend && !sendButton &&
						<RoundButton icon={require('../../assets/imgs/icon_add_friend.png')} onClick={() => sendFriendInvite(otherUser.id, jwtToken)}></RoundButton>
					}
					<RoundButton icon={require('../../assets/imgs/icon_options.png')} onClick={() => openOptionDropdown()}></RoundButton>
				</Flex>
			</div>
		</>
	);
}
