import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "../UserContext/UserContext";
import { Fetch } from "../../utils";

type FriendsRequestType = {
	recvInvitesFrom: number[] | undefined,
	sendInvitesTo: number[] | undefined,
	friends: number[] | undefined,

	sendFriendRequest: (to: number) => void,
	acceptFriendRequest: (from: number, to: number) => void,
	declineFriendRequest: (from: number, to: number) => void,

	fetchFriendsRequestContext: () => void,
}

const FriendsRequestContext = createContext<FriendsRequestType>({
	recvInvitesFrom: [],
	sendInvitesTo: [],
	friends: [],

	sendFriendRequest: (to: number) => { },
	acceptFriendRequest: (from: number, to: number) => { },
	declineFriendRequest: (from: number, to: number) => { },

	fetchFriendsRequestContext: () => { },
})

export function useFriendsRequestContext() {
	return useContext(FriendsRequestContext);
}

interface Props {
	children: ReactNode;
}

export function FriendsRequestProvider({ children }: Props) {
	const { socket, id } = useUserContext();
	const [recvInvitesFrom, setRecvInvitesFrom] = useState<number[]>();
	const [sendInvitesTo, setSendInvitesTo] = useState<number[]>();
	const [friends, setFriends] = useState<number[]>();

	async function fetchFriendsRequestContext(): Promise<void> {
		let user = (await Fetch('user/', 'GET'))?.json;
		if (!user) return;
		setFriends(user?.friends);
		setRecvInvitesFrom(user?.invites);
		setSendInvitesTo(user?.invited);

	}

	// Invites -- Event emission -----------------------------------------------------------
	function sendFriendRequest(to: number) {
		console.log("TO : ", to);
		console.log("FROM : ", id);
		console.log("socket in client: ", socket);
		
		socket?.emit('send_friend_request', { sender: id, receiver: to });
		let tmp: number[] = [...sendInvitesTo as number[], to];
		setSendInvitesTo(tmp);

		console.log("send", sendInvitesTo);
		
	}

	function acceptFriendRequest( to: number, from: number ) {
		console.log("from : ", from);
		socket?.emit('accept_friend_request', { sender: from, receiver: id });
		let tmp: number[] = [...friends as number[], from];
		setFriends(tmp);
		let tmp2 = recvInvitesFrom as number[];
		const index = tmp2.indexOf(from)
		if (index !== -1)
			tmp2.splice(index, 1);
		setRecvInvitesFrom(tmp2);
	}

// ca fonctionne faut juste bien maj dans le front pour que ca refresh bien en fonction de recvInvitesFrom dans userButton
	function declineFriendRequest( to: number, from: number ) {
		console.log("from : ", from);
		socket?.emit('decline_friend_request', { sender: from, receiver: id });
		// let tmp2 = recvInvitesFrom as number[];
		// const index = tmp2.indexOf(from)
		// if (index !== -1)
		// 	tmp2.splice(index, 1);
		// setRecvInvitesFrom(tmp2);
	}

	// Invites -- Event reception ------------------------------------------------
	function onSendFriendRequest(body: { sender: number, receiver: number }) {
		// console.log("RECV sender: ", body.sender);
		// console.log("RECV receiver: ", body.receiver);
		// let tmp2: number[] = [...recvInvitesFrom as number[], body.sender];
		// setRecvInvitesFrom(tmp2);
	}

	function onAcceptFriendRequest(body: { sender: number, receiver: number }) {
		console.log("sender: ", body.sender);
		console.log("receiver: ", body.receiver);
	}

	function onDeclineFriendRequest(body: { sender: number, receiver: number }) {
		console.log("sender: ", body.sender);
		console.log("receiver: ", body.receiver);
	}

	useEffect(() => {
		console.log("SOCKET:", socket);
		
		socket?.on('send_friend_request', onSendFriendRequest);
		socket?.on('accept_friend_request', onAcceptFriendRequest);
		socket?.on('decline_friend_request', onDeclineFriendRequest);

		return () => {
			socket?.off('send_friend_request', onSendFriendRequest);
			socket?.off('accept_friend_request', onAcceptFriendRequest);
			socket?.off('decline_friend_request', onDeclineFriendRequest);
		};
	}, [socket]);

	return (
		<>
			<FriendsRequestContext.Provider value={
				{
					recvInvitesFrom,
					sendInvitesTo,
					friends,
					sendFriendRequest,
					acceptFriendRequest,
					declineFriendRequest,
					fetchFriendsRequestContext
				}
			}>
				{children}
			</FriendsRequestContext.Provider>
		</>
	)
}
