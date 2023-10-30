import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from '../UserContext/UserContext';
import { Fetch } from '../../utils';

type FriendsRequestType = {
  recvInvitesFrom: number[],
  sendInvitesTo: number[],
  friends: number[],
  blocked: number[],
  msgs: NotifMsg[],
  setMsgs: React.Dispatch<React.SetStateAction<NotifMsg[]>>,


  sendFriendRequest: (to: number) => void,
  acceptFriendRequest: (from: number) => void,
  declineFriendRequest: (from: number) => void,
  blockUser: (to: number) => void,
  unblockUser: (to: number) => void,
  cancelFriendRequest: (to: number) => void,

  fetchFriendsRequestContext: () => Promise<void>,
}

const FriendsRequestContext = createContext<FriendsRequestType>({
  recvInvitesFrom: [],
  sendInvitesTo: [],
  friends: [],
  blocked: [],
  msgs: [],
  setMsgs: (msgs) => {void msgs},

  sendFriendRequest: (to: number) => {
    void to;
  },
  acceptFriendRequest: (from: number) => {
    void from;
  },
  declineFriendRequest: (from: number) => {
    void from;
  },
  blockUser: (to: number) => {
    void to;
  },
  unblockUser: (to: number) => {
    void to;
  },
  cancelFriendRequest: (to: number) => {
    void to;
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
  const [msgs, setMsgs] = useState<Array<NotifMsg>>([]);

  // useEffect(() => {
  //   console.log('invite From: ', recvInvitesFrom, 'invite To:', sendInvitesTo,'friends:', friends, 'blocked: ', blocked);
  // }, [recvInvitesFrom, sendInvitesTo, friends, blocked]);

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
    unblockUser(to);
    if (friends.includes(to))
      return;
    if (recvInvitesFrom.includes(to))
      acceptFriendRequest(to);
    if (sendInvitesTo.includes(to))
      return;
    setSendInvitesTo([...sendInvitesTo, to]);
    socket?.emit('send_friend_request', { sender: id, receiver: to });
  }

  function acceptFriendRequest(from: number) {
    setFriends([...friends, from]);
    setRecvInvitesFrom(recvInvitesFrom.filter((id) => id !== from));
    socket?.emit('accept_friend_request', { sender: id, receiver: from });
  }

  function declineFriendRequest(from: number) {
    setRecvInvitesFrom(recvInvitesFrom.filter((id) => id !== from));
    socket?.emit('decline_friend_request', { sender: id, receiver: from });
  }

  // cancel invite
  function cancelFriendRequest(to: number) {
    setSendInvitesTo(sendInvitesTo.filter((id) => id !== to));
    socket?.emit('cancel_friend_request', { sender: id, receiver: to });
  }

  function blockUser(to: number) {
    setFriends(friends.filter((id) => id !== to));
    if (sendInvitesTo.includes(to))
      cancelFriendRequest(to);
    if (recvInvitesFrom.includes(to))
      declineFriendRequest(to);
    setBlocked([...blocked, to]);
    socket?.emit('block_user', { sender: id, receiver: to });
  }

  function unblockUser(to: number) {
    setBlocked(blocked.filter((id) => id !== to));
    socket?.emit('unblock_user', { sender: id, receiver: to });
  }

  // Invites -- Event reception ------------------------------------------------
  function onReceiveFriendRequest(body: { sender: number, receiver: number }) {
    if (blocked.includes(body.sender))
      return declineFriendRequest(body.sender);
    if (sendInvitesTo.includes(body.sender))
      return acceptFriendRequest(body.sender);
    if (friends.includes(body.sender))
      return;

    setRecvInvitesFrom([...recvInvitesFrom as number[], body.sender]);
  }

  function onAcceptFriendRequest(body: { receiver: number, sender: number }) {
    setFriends([...friends, body.sender]);
    setSendInvitesTo(sendInvitesTo.filter((id) => id !== body.sender));
  }

  function onDeclineFriendRequest(body: { sender: number, receiver: number }) {
    setSendInvitesTo(sendInvitesTo.filter((id) => id !== body.sender));
  }

  function onCancelFriendRequest(body: { sender: number, receiver: number }) {
    setRecvInvitesFrom(recvInvitesFrom.filter((id) => id !== body.sender));
  }

  function onBlockReceived(body: { sender: number, receiver: number }) {
    setSendInvitesTo(sendInvitesTo.filter((id) => id !== body.sender));
    setRecvInvitesFrom(recvInvitesFrom.filter((id) => id !== body.sender));
    setFriends(friends.filter((id) => id !== body.sender));
  }

  useEffect(() => {

    socket?.on('send_friend_request', onReceiveFriendRequest);
    socket?.on('accept_friend_request', onAcceptFriendRequest);
    socket?.on('decline_friend_request', onDeclineFriendRequest);
    socket?.on('cancel_friend_request', onCancelFriendRequest);
    socket?.on('blocked', onBlockReceived);

    return () => {
      socket?.off('send_friend_request', onReceiveFriendRequest);
      socket?.off('accept_friend_request', onAcceptFriendRequest);
      socket?.off('decline_friend_request', onDeclineFriendRequest);
      socket?.off('cancel_friend_request', onCancelFriendRequest);
      socket?.off('blocked', onBlockReceived);
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

          msgs,
          setMsgs,

          sendFriendRequest,
          acceptFriendRequest,
          declineFriendRequest,
          blockUser,
          unblockUser,
          cancelFriendRequest,

          fetchFriendsRequestContext,
        }
      }>
        {children}
      </FriendsRequestContext.Provider>
    </>
  );
}