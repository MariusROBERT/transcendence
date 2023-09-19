import { color } from "../../utils";
import { RoundButton, Flex } from "..";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { UserInfos } from "../../utils/interfaces";
import { lookGame, openChat, openOptionDropdown, sendFriendInvite, sendGameInvite } from "../../utils/user_functions";

// TODO : Add Object User insteed of user_name and user icon
interface Props {
	icon_url?: string
	user_name?: string
	is_friend?: boolean
	id?: number
}

export function UserButton({ id, icon_url = require('../../assets/imgs/icon_user.png'), user_name = 'Jean Michel', is_friend = false }: Props) {
	const jwtToken = Cookies.get('jwtToken');
	const [sendButton, setSendButton] = useState(false);
	const [userInfos, setUserInfos] = useState<UserInfos | null>(null);

	useEffect(() => {
		const fetchUserInfos = async () => {
			try {
				const response = await fetch('http://localhost:3001/api/user', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${jwtToken}`,
					},
				});

				if (response.ok) {
					const userData = await response.json();
					setUserInfos(userData);
				} else {
					console.log('Réponse non OK');
				}
			} catch (error) {
				console.error(
					'Erreur lors de la récupération des données utilisateur:',
					error,
				);
			}
		};

		if (jwtToken) {
			fetchUserInfos();
		}
	}, [jwtToken]);

	useEffect(() => {
		if (userInfos && userInfos.invited.includes(id as number)) {
			setSendButton(true);
		}
	}, [id, userInfos]);

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '12.5px', backgroundColor: color.grey, minWidth: '410px', height: '25px' }}>
				<Flex zIndex={'10'} flex_direction="row" flex_justifyContent={'space-evenly'}>
					{is_friend && <RoundButton icon={require('../../assets/imgs/icon_chat.png')} onClick={() => openChat()}></RoundButton>}
					{is_friend && <RoundButton icon={require('../../assets/imgs/icon_play.png')} onClick={() => sendGameInvite()}></RoundButton>}
					{is_friend && <RoundButton icon={require('../../assets/imgs/icon_look_game.png')} onClick={() => lookGame()}></RoundButton>}
					{!is_friend && !sendButton &&
						<RoundButton icon={require('../../assets/imgs/icon_add_friend.png')} onClick={() => sendFriendInvite(id, jwtToken)}></RoundButton>
					}
					<RoundButton icon={require('../../assets/imgs/icon_options.png')} onClick={() => openOptionDropdown()}></RoundButton>
				</Flex>
			</div>
		</>
	);
}
