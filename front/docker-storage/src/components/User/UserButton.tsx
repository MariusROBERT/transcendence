import { color } from "../../utils";
import { RoundButton, Flex } from "..";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { IUser, IUserComplete } from "../../utils/interfaces";
import { lookGame, openChat, sendFriendInvite, sendGameInvite } from "../../utils/user_functions";
import { useUserContext } from "../../contexts";

// TODO : Add Object User insteed of user_name and user icon
interface Props {
	otherUser: IUser;
	meUser: IUserComplete | undefined;
}

export function UserButton({ otherUser, meUser }: Props) {
	const jwtToken = Cookies.get('jwtToken');
	const [sendButton, setSendButton] = useState(false);
	const [isOpen, setIsOptionOpen] = useState<boolean>(false);
	const [requestReceived, setRequestReceived] = useState<boolean>(false);
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const { setUser } = useUserContext();

	const blockAUser = async (id: number) => {
		const jwtToken = Cookies.get('jwtToken');
		try {

			const res = await fetch(`http://localhost:3001/api/user/block/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwtToken}`,
				},
			})
			if (res.ok) {
				console.log(`user ${id} blocked`);
				if (!meUser)
					return
				let blockedCpy = [...meUser.blocked, otherUser.id];
				setUser({ ...meUser, blocked: blockedCpy });
			}
			else
				console.log(`user ${id} already blocked`);
		} catch (e) {
			console.log(e);
		}
	}

	const askFriend = () => {
		if (!meUser)
			return
		if (meUser && meUser.blocked?.includes(otherUser.id as number)) {
			const indexToRemove = meUser.blocked.indexOf(otherUser.id);
			if (indexToRemove !== -1) {
				console.log("user remove from blocked list"); // todo : to test
				meUser.blocked.splice(indexToRemove, 1);
			}
		}
		sendFriendInvite(otherUser.id, jwtToken);
		let usercpy = [...meUser.invited, otherUser.id];
		setUser({ ...meUser, invited: usercpy });
	}
	
	useEffect(() => {
		if (meUser && meUser.invited.includes(otherUser.id as number))
			setSendButton(true);
		if (meUser && meUser.invites.includes(otherUser.id as number))
			setRequestReceived(true);
		if (meUser && meUser.friends.includes(otherUser.id as number))
			setIsFriend(true);
	}, [meUser, otherUser.id]);

	const openOptions = () => {
		setIsOptionOpen(!isOpen);
	}

	// const handleRequestsFriend = async (bool: boolean) => {
	// 	setRequestReceived(false);
	// 	if (!meUser || !otherUser)
	// 		return
	// 	if (meUser && meUser.blocked?.includes(otherUser.id as number))
	// 		return;
	// 	await Fetch(`user/handle_ask/${otherUser.id}/${bool}`, 'PATCH');
	// 	fetchContext()
	// }

	return (
		<div style={UserbUttonContainer}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '12.5px', backgroundColor: color.grey, minWidth: '100px', height: '25px' }}>
				<Flex zIndex={'10'} flex_direction="row" flex_justifyContent={'space-evenly'}>
					{isFriend && <RoundButton icon={require('../../assets/imgs/icon_chat.png')} onClick={() => openChat()}/>}
					{isFriend && <RoundButton icon={require('../../assets/imgs/icon_play.png')} onClick={() => sendGameInvite()}/>}
					{isFriend && <RoundButton icon={require('../../assets/imgs/icon_look_game.png')} onClick={() => lookGame()}/>}
					{!isFriend && !sendButton &&
						<RoundButton icon={require('../../assets/imgs/icon_add_friend.png')} onClick={askFriend}/>
					}
					<RoundButton icon={require('../../assets/imgs/icon_options.png')} onClick={() => openOptions()}/>
					{isOpen && (
						<div style={optionStyle}>
							<button onClick={() => blockAUser(otherUser.id)}>block</button>
						</div>
					)}
					{requestReceived && !isFriend &&
						<div style={askStyle}>
							<RoundButton icon={require('../../assets/imgs/icon_accept.png')} onClick={() => {
								// handleRequestsFriend(true);
							}}/>
							<RoundButton icon={require('../../assets/imgs/icon_denied.png')} onClick={() => {
								// handleRequestsFriend(false);
							}}/>
						</div>
					}
				</Flex>
			</div>
		</div>
	);
}

const UserbUttonContainer: React.CSSProperties = { 
	// border: '4px solid red',
	width: '60%'
}

const askStyle = {
	
	display: 'flex',
	borderRadius: '100px',
	alignItem: 'center',
	justifyContent: 'center',
	background: 'white',
	width: '80px',
	height: '40px',
	border: '4px solid green',
};

const optionStyle: React.CSSProperties = {
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
