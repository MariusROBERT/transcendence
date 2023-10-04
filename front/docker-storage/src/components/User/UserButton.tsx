import { color } from '../../utils';
import { RoundButton, Flex } from '..';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { IUser } from '../../utils/interfaces';
import { lookGame, openChat } from '../../utils/user_functions';
import { useGameContext, useUserContext } from '../../contexts';
import { useFriendsRequestContext } from '../../contexts/FriendsRequestContext/FriendsRequestContext';

interface Props {
	otherUser: IUser;
}

export function UserButton({ otherUser }: Props) {
	const { sendGameInvite } = useGameContext();
	const { sendFriendRequest, acceptFriendRequest, declineFriendRequest, blockUser, sendInvitesTo, recvInvitesFrom, friends, blocked } = useFriendsRequestContext();
	const { id, user } = useUserContext();
	const [isBlocked, setIsBlocked] = useState(blocked?.includes(otherUser.id));

	useEffect(() => {
		blocked?.includes(otherUser.id) ? setIsBlocked(true) : setIsBlocked(false);
	}, [blocked, otherUser.id])
	
	return (
		<div style={UserbUttonContainer}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '12.5px', backgroundColor: color.grey, minWidth: '100px', height: '25px' }}>
				<Flex zIndex={'10'} flex_direction="row" flex_justifyContent={'space-evenly'}>
					{friends?.includes(otherUser.id) && <RoundButton icon={require('../../assets/imgs/icon_chat.png')} onClick={() => openChat()} />}
					{friends?.includes(otherUser.id) && <RoundButton icon={require('../../assets/imgs/icon_play.png')} onClick={() => sendGameInvite(otherUser.id, 'normal')} />}
					{friends?.includes(otherUser.id) && <RoundButton icon={require('../../assets/imgs/icon_look_game.png')} onClick={() => lookGame()} />}
					{!friends?.includes(otherUser.id) && !sendInvitesTo?.includes(otherUser.id) &&
						<RoundButton icon={require('../../assets/imgs/icon_add_friend.png')} onClick={() => sendFriendRequest(otherUser.id)} />
					}
					{user && <RoundButton icon={require('../../assets/imgs/icon_block.png')} onClick={() => {
						setIsBlocked(true);
						blockUser(otherUser.id, user.id);
					}} isDisabled={isBlocked} />}
					{recvInvitesFrom?.includes(otherUser.id) && !friends?.includes(otherUser.id) && !isBlocked &&
						<div style={askStyle}>
							<RoundButton icon={require('../../assets/imgs/icon_accept.png')} onClick={() => acceptFriendRequest(id, otherUser.id)} />
							<RoundButton icon={require('../../assets/imgs/icon_denied.png')} onClick={() => declineFriendRequest(id, otherUser.id)} />
						</div>
					}
				</Flex>
			</div>
		</div>
	);
}

const UserbUttonContainer: React.CSSProperties = {
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
