import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from '../UserContext/UserContext';
import { Fetch } from '../../utils';

type FriendsRequestType = {
  recvInvitesFrom: number[],
  sendInvitesTo: number[],
  friends: number[],
  blocked: number[],

  sendFriendRequest: (to: number) => void,
  acceptFriendRequest: (from: number, to: number) => void,
  declineFriendRequest: (from: number, to: number) => void,
  blockUser: (to: number, from: number) => void,

  fetchFriendsRequestContext: () => Promise<void>,
}

const FriendsRequestContext = createContext<FriendsRequestType>({
  recvInvitesFrom: [],
  sendInvitesTo: [],
  friends: [],
  blocked: [],

  sendFriendRequest: (to: number) => {
    void to;
  },
  acceptFriendRequest: (from: number, to: number) => {
    void to;
  },
  declineFriendRequest: (from: number, to: number) => {
    void to;
  },
  blockUser: (to: number, from: number) => {
    void from;
  },

  fetchFriendsRequestContext: async () => {
    return;
  },
});

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
    return;
  }, [friends, recvInvitesFrom, sendInvitesTo]);

  async function fetchFriendsRequestContext(): Promise<void> {
    const user = (await Fetch('user', 'GET'))?.json;
    if (!user) return;
    setFriends(user?.friends);
    setRecvInvitesFrom(user?.recvInvitesFrom);
    setSendInvitesTo(user?.sentInvitesTo);
    setBlocked(user?.blocked);
  }

  // Invites -- Event emission -----------------------------------------------------------
  function sendFriendRequest(to: number) {
    const index = blocked.indexOf(to);
    if (index !== -1) {
      blocked.splice(index, 1);
      setBlocked(blocked);
      socket?.emit('unblock_user', { sender: id, receiver: to });
    }

    socket?.emit('send_friend_request', { sender: id, receiver: to });
    setSendInvitesTo([...sendInvitesTo, to]);
  }

  function acceptFriendRequest(to: number, from: number) {
    socket?.emit('accept_friend_request', { sender: from, receiver: id });
    setFriends([...friends, from]);

    const tmp2 = recvInvitesFrom as number[];
    const index = tmp2.indexOf(from);
    if (index !== -1)
      tmp2.splice(index, 1);
    setRecvInvitesFrom(tmp2);
  }

  function declineFriendRequest(to: number, from: number) {
    socket?.emit('decline_friend_request', { sender: from, receiver: id });
    const tmp2 = recvInvitesFrom as number[];
    const patch: number[] = [...friends as number[]];
    setFriends(patch);

    const index = tmp2.indexOf(from);
    if (index !== -1)
      tmp2.splice(index, 1);
    setRecvInvitesFrom(tmp2);
  }

  function blockUser(to: number, from: number) {
    socket?.emit('block_user', { receiver: to, sender: from });
    setBlocked([...blocked, to]);
  }

  // Invites -- Event reception ------------------------------------------------
  function onSendFriendRequest(body: { sender: number, receiver: number }) {
    if (blocked.includes(body.sender))
      return;
    let tmp = recvInvitesFrom;
    tmp = [...recvInvitesFrom as number[], body.sender];
    setRecvInvitesFrom(tmp);
  }

  function onAcceptFriendRequest(body: { receiver: number, sender: number }) {
    if (blocked.includes(body.sender))
      return;
    setFriends([...friends, body.receiver]);

    const tmp2 = sendInvitesTo as number[];
    const index = tmp2.indexOf(body.receiver);
    if (index !== -1)
      tmp2.splice(index, 1);
    setSendInvitesTo(tmp2);
  }

  function onDeclineFriendRequest(body: { sender: number, receiver: number }) {
    const tmp2 = sendInvitesTo as number[];
    const index = tmp2.indexOf(body.receiver);
    if (index !== -1)
      tmp2.splice(index, 1);
    setSendInvitesTo(tmp2);
  }

  function onBlockUser(body: { to: number, from: number }) {
    void body;
  }

  useEffect(() => {

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
    // eslint-disable-next-line
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
          blockUser,
        }
      }>
        {children}
      </FriendsRequestContext.Provider>
    </>
  );
}
