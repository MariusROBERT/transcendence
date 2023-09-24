import { Fetch, color } from "../../utils";
import { RoundButton, Flex } from "..";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { IUser, IUserComplete } from "../../utils/interfaces";
import { blockAUser, lookGame, openChat, sendFriendInvite, sendGameInvite } from "../../utils/user_functions";
import { useUserContext } from "../../contexts";

// TODO : Add Object User insteed of user_name and user icon
interface Props {
	otherUser: IUser;
	meUser: IUserComplete | undefined;
	askYouInFriend: boolean;
	isFriend: boolean;
	isBlocked: boolean;
}

export function UserButton({ otherUser, meUser, askYouInFriend, isFriend, isBlocked }: Props) {
	const jwtToken = Cookies.get('jwtToken');
	const [sendButton, setSendButton] = useState(false);
	const [handledAskRemove, setHandleAskRemove] = useState<boolean>(false);
	const { setUser } = useUserContext();
	const [isOpen, setIsOptionOpen] = useState<boolean>(false);

	useEffect(() => {
		console.log("user has been updated in UserButton", meUser);
		if (meUser && meUser.invited.includes(otherUser.id as number)) {
			setSendButton(true);
		}
	}, [meUser]);

	const askFriend = () => {
		if (!meUser)
			return
		sendFriendInvite(otherUser.id, jwtToken);
		let usercpy = [...meUser.invited, otherUser.id];
		setUser({ ...meUser, invited: usercpy });
	}

	const handleRequestsFriend = async (bool: boolean) => {
		if (!meUser)
			return
			console.log(handledAskRemove);
		// check if otherUser isn't include in meUser.blocked => if he is: go fuck yourself, if not: go on
		if (meUser && meUser.blocked?.includes(otherUser.id as number)) 
			return ;
		const res = await Fetch(`user/handle_ask/${otherUser.id}/${bool}`, 'PATCH');
		if (bool == true)
		{
			let friendscopy = [...meUser.friends, otherUser.id];
			let usercpy = [...meUser.invited, otherUser.id];
			setUser({ ...meUser, invited: usercpy, friends: friendscopy });
		}
		setHandleAskRemove(true);
	}
	// todo metre a jour profil et ses btns
	// todo enlever la notif en haut a droite

	const openOptions = () => {
		setIsOptionOpen(!isOpen);
	}

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '12.5px', backgroundColor: color.grey, minWidth: '410px', height: '25px' }}>
				<Flex zIndex={'10'} flex_direction="row" flex_justifyContent={'space-evenly'}>
					{isFriend && <RoundButton icon={require('../../assets/imgs/icon_chat.png')} onClick={() => openChat()}></RoundButton>}
					{isFriend && <RoundButton icon={require('../../assets/imgs/icon_play.png')} onClick={() => sendGameInvite()}></RoundButton>}
					{isFriend && <RoundButton icon={require('../../assets/imgs/icon_look_game.png')} onClick={() => lookGame()}></RoundButton>}
					{!otherUser.is_friend && !sendButton &&
						<RoundButton icon={require('../../assets/imgs/icon_add_friend.png')} onClick={askFriend}></RoundButton>
					}
					<RoundButton icon={require('../../assets/imgs/icon_options.png')} onClick={() => openOptions()}></RoundButton>
					{isOpen && (
						<div style={optionStyle}>
							<button onClick={() => blockAUser(otherUser.id)}>block</button>
						</div>
					)}
					{!isBlocked && !otherUser.is_friend && askYouInFriend && !handledAskRemove &&
						<div style={askStyle}>
							<RoundButton icon={require('../../assets/imgs/icon_accept.png')} onClick={() => handleRequestsFriend(true)}></RoundButton>
							<RoundButton icon={require('../../assets/imgs/icon_denied.png')} onClick={() => handleRequestsFriend(false)}></RoundButton>
						</div>
					}
				</Flex>
			</div>
		</>
	);
}

const askStyle = {
	display: 'flex',
	borderRadius: '100px',
	alignItem: 'center',
	justifyContent: 'center',
	background: 'white',
	width: '80px',
	height: '40px',
	border: '1px solid red',
};

const optionStyle:React.CSSProperties = {
	position: 'relative',
	top: '-50px',
	left: '20%',
	transform: 'translateX(-50%)',
	backgroundColor: 'white',
	color: 'black',
	borderRadius: '6px',
	padding: '10px',
	boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
}