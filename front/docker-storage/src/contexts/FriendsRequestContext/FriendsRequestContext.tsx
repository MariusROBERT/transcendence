import { ReactNode, Suspense, createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "../UserContext/UserContext";
import { Fetch } from "../../utils";

type FriendsRequestType = {
	recvInvitesFrom: number[] | undefined,
	sendInvitesTo: number[] | undefined,
	friends: number[] | undefined,
	blocked: number[] | undefined,

	sendFriendRequest: (to: number) => void,
	acceptFriendRequest: (from: number, to: number) => void,
	declineFriendRequest: (from: number, to: number) => void,
	blockUser: (to: number, from: number) => void,

	fetchFriendsRequestContext: () => void,
}

const FriendsRequestContext = createContext<FriendsRequestType>({
	recvInvitesFrom: [],
	sendInvitesTo: [],
	friends: [],
	blocked: [],

	sendFriendRequest: (to: number) => { },
	acceptFriendRequest: (from: number, to: number) => { },
	declineFriendRequest: (from: number, to: number) => { },
	blockUser: (to: number, from: number) => {},

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
	const [recvInvitesFrom, setRecvInvitesFrom] = useState<number[]>([]);
	const [sendInvitesTo, setSendInvitesTo] = useState<number[]>([]);
	const [friends, setFriends] = useState<number[]>([]);
	const [blocked, setBlocked] = useState<number[]>([]);

	useEffect(() => {
		console.log("friends : ", friends);
		console.log("recvInvitesFrom : ", recvInvitesFrom);
		console.log("sendInvitesTo: ", sendInvitesTo);
	}, [friends, recvInvitesFrom, sendInvitesTo])

	async function fetchFriendsRequestContext(): Promise<void> {
		let user = (await Fetch('user/', 'GET'))?.json;
		if (!user) return;
		setFriends(user?.friends);
		setRecvInvitesFrom(user?.recvInvitesFrom);
		setSendInvitesTo(user?.sentInvitesTo);
		setBlocked(user?.blocked);
	}

	// Invites -- Event emission -----------------------------------------------------------
	function sendFriendRequest(to: number) {
		// let tmp2 = blocked as number[];
		// const index = tmp2.indexOf(to)
		// if (index !== -1) {
		// 	tmp2.splice(index, 1);
		// 	setBlocked(tmp2);
		// }

		socket?.emit('send_friend_request', { sender: id, receiver: to });
		setSendInvitesTo([...sendInvitesTo, to]);
	}

	function acceptFriendRequest( to: number, from: number ) {
		socket?.emit('accept_friend_request', { sender: from, receiver: id });
		setFriends([...friends, from]);
		let tmp2 = recvInvitesFrom as number[];
		const index = tmp2.indexOf(from)
		if (index !== -1)
			tmp2.splice(index, 1);
		setRecvInvitesFrom(tmp2);
	}

	function declineFriendRequest( to: number, from: number ) {
		socket?.emit('decline_friend_request', { sender: from, receiver: id });
		let tmp2 = recvInvitesFrom as number[];
		let patch: number[] = [...friends as number[]]
		setFriends(patch)
		const index = tmp2.indexOf(from)
		if (index !== -1)
			tmp2.splice(index, 1);
		setRecvInvitesFrom(tmp2);
	}

	function blockUser( to: number, from: number ) {
		console.log("wesh c quoi le bail");
		console.log("in Context : TO : ", to);
		socket?.emit('block_user', { receiver: to, sender: from });
	}

	// Invites -- Event reception ------------------------------------------------
	function onSendFriendRequest(body: { sender: number, receiver: number }) {
		let tmp = recvInvitesFrom;
		tmp = [...recvInvitesFrom as number[], body.sender];
		setRecvInvitesFrom(tmp);
	}
	
	function onAcceptFriendRequest(body: { receiver: number, sender: number }) {
		setFriends([...friends, body.receiver]);

		let tmp2 = sendInvitesTo as number[];
		const index = tmp2.indexOf(body.receiver)
		if (index !== -1)
			tmp2.splice(index, 1);
		setSendInvitesTo(tmp2);
	}

	function onDeclineFriendRequest(body: { sender: number, receiver: number }) {
		console.log("sender: ", body.sender);
		console.log("receiver: ", body.receiver);
	}

	function onBlockUser(body: { to: number }) {
		
	}

	useEffect(() => {
		console.log("SOCKET:", socket);
		
		socket?.on('send_friend_request', onSendFriendRequest);
		socket?.on('accept_friend_request', onAcceptFriendRequest);
		socket?.on('decline_friend_request', onDeclineFriendRequest); 
		socket?.on('block_user', onBlockUser); 

		return () => {
			socket?.off('send_friend_request', onSendFriendRequest);
			socket?.off('accept_friend_request', onAcceptFriendRequest);
			socket?.off('decline_friend_request', onDeclineFriendRequest);
			socket?.off('block_user', onBlockUser); 
		};

	}, [socket, friends, recvInvitesFrom, sendInvitesTo, blocked]);

	return (
		<>
			<FriendsRequestContext.Provider value={
				{
					blocked,
					recvInvitesFrom,
					sendInvitesTo,
					friends,
					sendFriendRequest,
					acceptFriendRequest,
					declineFriendRequest,
					fetchFriendsRequestContext,
					blockUser
				}
			}>
				{children}
			</FriendsRequestContext.Provider>
		</>
	)
}