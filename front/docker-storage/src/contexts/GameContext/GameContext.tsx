import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Fetch } from '../../utils';
import { useUserContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import {useUIContext} from '../UIContext/UIContext';

type GameContextType = {
  inviteFrom: number | undefined,
  inviteTo: number | undefined,
  isInGameWith: number | undefined,
  isInQueue: undefined | 'normal' | 'special',
  gameType: undefined | 'normal' | 'special',

  sendGameInvite: (to: number, gameType: 'normal' | 'special') => void,
  acceptGameInvite: (from: number) => void,
  declineGameInvite: (from: number) => void,
  cancelGameInvite: () => void,

  joinQueue: (gameType: 'normal' | 'special') => void,
  leaveQueue: () => void,

  startGame: () => void,
  leaveGame: () => void,

  fetchGameContext: () => void
}


const GameContext = createContext<GameContextType>({
  inviteFrom: undefined,
  inviteTo: undefined,
  isInGameWith: undefined,
  isInQueue: undefined,
  gameType: undefined,

  sendGameInvite: (to: number, gameType: 'normal' | 'special') => {
    void (gameType);
    return;
  },
  acceptGameInvite: (from: number) => {
    void (from);
    return;
  },
  declineGameInvite: (from: number) => {
    void (from);
    return;
  },
  cancelGameInvite: () => {
    return;
  },

  joinQueue: (gameType: 'normal' | 'special') => {
    void (gameType);
    return;
  },
  leaveQueue: () => {
    return;
  },

  startGame: () => {
    return;
  },
  leaveGame: () => {
    return;
  },

  fetchGameContext: () => {
    return;
  },
});

export function useGameContext() {
  return useContext(GameContext);
}

interface Props {
  children: ReactNode;
}

export function GameContextProvider({ children }: Props) {
  const { setIsLeaderboardOpen, setIsSettingsOpen, setIsProfileOpen, setIsChatMenuOpen, setIsChatOpen, setIsContactOpen, setPaused } = useUIContext();
  const { socket, id } = useUserContext();
  const navigate = useNavigate();

  const [isInGameWith, setIsInGameWith] = useState<number | undefined>();
  const [isInQueue, setIsInQueue] = useState<'normal' | 'special' | undefined>();
  const [inviteFrom, setInviteFrom] = useState<number | undefined>();
  const [inviteTo, setInviteTo] = useState<number | undefined>();
  const [gameType, setGameType] = useState<'normal' | 'special' | undefined>();

  useEffect(() => {
    if (id !== 0 && socket)
      fetchGameContext();
    // eslint-disable-next-line
  }, [id, socket, navigate]);

  async function fetchGameContext(): Promise<void> {
    if (id <= 0) return;
    // fetch invite status
    const inviteStatus: {
      gameInvitationFrom: number,
      gameInvitationTo: number,
      gameInviteType: 'none' | 'normal' | 'special'
    } | undefined
      = await (await Fetch('user/game_status/' + id, 'GET'))?.json;
    if (!inviteStatus) return;
    setInviteFrom((inviteStatus.gameInvitationFrom < 0 ? undefined : inviteStatus.gameInvitationFrom));
    setInviteTo((inviteStatus.gameInvitationTo < 0 ? undefined : inviteStatus.gameInvitationTo));
    setGameType((inviteStatus.gameInviteType === 'none' ? undefined : inviteStatus.gameInviteType));

    // check if player is in Queue
    const inQueue: { isInQueue: 'normal' | 'special' | undefined }
      = await (await (await Fetch('game/in_queue/' + id, 'GET'))?.json);
    setIsInQueue(inQueue.isInQueue);

    const inGame: { isInGameWith: number | undefined }
      = await (await (await Fetch('game/is_in_game/' + id, 'GET'))?.json);
    setIsInGameWith(inGame?.isInGameWith);

    // move to the current game
    if (inGame?.isInGameWith) {
      setInviteFrom(undefined);
      setInviteTo(undefined);
      setIsInQueue(undefined);
      navigate('/game');
    }
  }

  // Invites Management --------------------------------------------------------------------------------------------- //
  // Invites -- Event emission -------------------------------------------------------------------------------------- //
  function sendGameInvite(to: number, inviteGameType: 'normal' | 'special') {
    if (isInGameWith) return;

    // Auto accept invite (if 'a' invite 'b' and 'b' invite 'a')
    if (inviteFrom === to && gameType === inviteGameType)
      return acceptGameInvite(inviteFrom);

    // Auto cancel and decline other invites and leave queue
    if (inviteFrom)
      declineGameInvite(inviteFrom);
    if (inviteTo)
      cancelGameInvite();
    if (isInQueue)
      leaveQueue();

    // Set invite and Send it
    setInviteTo(to);
    setGameType(inviteGameType);
    socket?.emit('send_invite', { sender: id, receiver: to, gameType: gameType });
  }

  function acceptGameInvite(from: number) {
    if (isInGameWith)
      return declineGameInvite(from);
    // Auto cancel and decline send invites
    if (inviteTo && inviteTo !== from)
      cancelGameInvite();
    if (inviteFrom && inviteFrom !== from)
      declineGameInvite(inviteFrom);

    setInviteFrom(undefined);
    socket?.emit('accept_invite', { sender: id, receiver: from ? from : inviteFrom, gameType: gameType });
  }

  function declineGameInvite(from: number) {
    socket?.emit('decline_invite', { sender: id, receiver: from });

    // reset the invite from
    if (inviteFrom === from)
      setInviteFrom(undefined);
  }

  function cancelGameInvite() {
    socket?.emit('cancel_invite', { sender: id, receiver: inviteTo });
    setInviteTo(undefined);
  }

  // Invites -- Event reception ------------------------------------------------------------------------------------- //
  function onGameInviteReceived(body: { sender: number, receiver: number, gameType: 'normal' | 'special' }) {
    if (id !== body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'send_invite\'');

    if (isInGameWith)
      return declineGameInvite(body.sender);

    // Auto accept invite (if 'a' invite 'b' and 'b' invite 'a')
    if (inviteTo === body.sender && gameType === body.gameType)
      return acceptGameInvite(body.sender);

    // Auto Decline invite (if already in invite)
    if (inviteTo || inviteFrom || isInQueue)
      return declineGameInvite(body.sender);

    // Update Invitation
    setInviteFrom(body.sender);
    setGameType(body.gameType);
  }

  function onGameInviteAccepted(body: { sender: number, receiver: number }) {
    if (id !== body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'accept_invite\'');

    if (body.sender !== inviteTo)
      return console.warn('user [' + id + '] RECEIVED: \'accept_invite\' form a player not invited');

    setInviteFrom(undefined);
    setInviteTo(undefined);
  }

  function onGameInviteDeclined(body: { sender: number, receiver: number }) {
    if (id !== body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'decline_invite\'');

    if (body.sender !== inviteTo)
      return console.warn('user [' + id + '] RECEIVED: \'decline_invite\' form a player not invited');

    setInviteTo(undefined);
  }

  function onGameInviteCanceled(body: { sender: number, receiver: number }) {
    if (id !== body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'cancel_invite\'');

    if (body.sender !== inviteFrom)
      return console.warn('user [' + id + '] RECEIVED: \'cancel_invite\' form a player who didn\'t invited him');

    setInviteFrom(undefined);
  }

  useEffect(() => {
    if (id === 0) return;
    // Invites -- Connection Socket --------------------------------------------------------------------------------- //
    socket?.on('send_invite', onGameInviteReceived);
    socket?.on('accept_invite', onGameInviteAccepted);
    socket?.on('decline_invite', onGameInviteDeclined);
    socket?.on('cancel_invite', onGameInviteCanceled);

    return () => {
      socket?.off('send_invite', onGameInviteReceived);
      socket?.off('accept_invite', onGameInviteAccepted);
      socket?.off('decline_invite', onGameInviteDeclined);
      socket?.off('cancel_invite', onGameInviteCanceled);
    };
    // eslint-disable-next-line
  }, [socket, inviteTo, inviteFrom, gameType, isInGameWith, isInQueue, id]);

  // Queue Management ----------------------------------------------------------------------------------------------- //
  // Queue -- Event emission ---------------------------------------------------------------------------------------- //
  function joinQueue(gameType: 'normal' | 'special') {
    if (isInGameWith)
      return;
    if (inviteFrom)
      declineGameInvite(inviteFrom);
    if (inviteTo)
      cancelGameInvite();
    if (isInQueue)
      leaveQueue();

    socket?.emit('join_queue', { sender: id, gameType: gameType });
    setIsInQueue(gameType);
  }

  function leaveQueue() {
    if (!isInQueue) return;
    socket?.emit('leave_queue', { sender: id });
    setIsInQueue(undefined);
  }

  // Game Start / End Management ------------------------------------------------------------------------------------ //
  // Game Start / End -- Event emission ----------------------------------------------------------------------------- //
  function startGame() {
    socket?.emit('start_game', { sender: id });
  }

  function leaveGame() {
    if (!isInGameWith) return;
    socket?.emit('leave_game', { sender: id });
  }

  // Game Start / End -- Event reception ---------------------------------------------------------------------------- //
  function onOpenGame(body: { p1: number, p2: number }) {
    setIsLeaderboardOpen(false);
    setIsSettingsOpen(false);
    setIsProfileOpen(0);
    setIsChatMenuOpen(false);
    setIsChatOpen(false);
    setIsContactOpen(false);
    setInviteFrom(undefined);
    setInviteTo(undefined);
    setIsInQueue(undefined);
    setPaused(true);
    setIsInGameWith(id === body.p1 ? body.p2 : body.p1);
    navigate('/game');
  }

  function onGameEnds() {
    setInviteFrom(undefined);
    setInviteTo(undefined);
    setIsInQueue(undefined);
    setIsInGameWith(undefined);
    navigate('/game/score');
  }

  useEffect(() => {
    if (id === 0) return;
    // Game Start / End -- Connection Socket ------------------------------------------------------------------------ //
    socket?.on('open_game', onOpenGame);
    socket?.on('end_game', onGameEnds);

    return () => {
      socket?.off('open_game', onOpenGame);
      socket?.off('end_game', onGameEnds);
    };
    // eslint-disable-next-line
  }, [socket, id, navigate]);

  return (
    <>
      <GameContext.Provider value={{
        inviteFrom,
        inviteTo,
        isInGameWith,
        isInQueue,
        gameType,

        sendGameInvite,
        acceptGameInvite,
        declineGameInvite,
        cancelGameInvite,

        joinQueue,
        leaveQueue,

        startGame,
        leaveGame,

        fetchGameContext,
      }}>
        {children}
      </GameContext.Provider>
    </>
  );
}