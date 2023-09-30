import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Fetch } from '../../utils';
import { useUserContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';

type GameContextType = {
  hasReceivedInvitationFrom: number | undefined,
  hasSendInvitationTo: number | undefined,
  isInGameWith: number | undefined,

  sendGameInvite: (to: number | undefined, gameType: 'normal' | 'special') => void,
  acceptGameInvite: (from: number) => void,
  declineGameInvite: (from:number) => void,
  cancelGameInvite: () => void,

  joinQueue: (gameType: 'normal' | 'special') => void,
  leaveQueue: () => void,

  startGame: () => void,
  leaveGame: () => void,

  fetchGameContext: () => void
}

const GameContext = createContext<GameContextType>({
  hasReceivedInvitationFrom: undefined,
  hasSendInvitationTo: undefined,
  isInGameWith: undefined,

  sendGameInvite: (to: number | undefined, gameType: 'normal' | 'special') => {},
  acceptGameInvite: (from: number) => {},
  declineGameInvite: (from:number) => {},
  cancelGameInvite: () => {},

  joinQueue: (gameType: 'normal' | 'special') => {},
  leaveQueue: () => {},

  startGame: () => {},
  leaveGame: () => {},

  fetchGameContext: () => {}
});

export function useGameContext() {
  return useContext(GameContext);
}

interface Props {
  children: ReactNode;
}

export function GameContextProvider({ children }: Props) {
  const { socket, id } = useUserContext();
  const navigate = useNavigate();

  const [isInGameWith, setIsInGameWith] = useState<number | undefined>();
  const [isInQueue, setIsInQueue] = useState<'normal' | 'special' | undefined>();
  const [hasReceivedInvitationFrom, setHasReceivedInvitationFrom] = useState<number | undefined>();
  const [hasSendInvitationTo, setHasSendInvitationTo] = useState<number | undefined>();
  const [gameTypeInvitation, setGameTypeInvitation] = useState<'normal' | 'special' | undefined>();

  async function fetchGameContext(): Promise<void> {
    // fetch invite status
    const inviteStatus: {gameInvitationFrom:number, gameInvitationTo:number, isInGameWith:number, gameInviteType:'none' | 'normal' | 'special'} | undefined
      = await (await Fetch('user/game_status/' + id, 'GET'))?.json;
    if (!inviteStatus) return;
    setHasReceivedInvitationFrom((inviteStatus.gameInvitationFrom < 0 ? undefined : inviteStatus.gameInvitationFrom));
    setHasSendInvitationTo((inviteStatus.gameInvitationTo < 0 ? undefined : inviteStatus.gameInvitationTo));
    setIsInGameWith((inviteStatus.isInGameWith < 0 ? undefined : inviteStatus.isInGameWith));
    setGameTypeInvitation((inviteStatus.gameInviteType === 'none' ? undefined : inviteStatus.gameInviteType));

    // check if player is in Queue
    const inQueue: { isInQueue: 'normal' | 'special' | undefined }
      = await (await (await Fetch('game/in_queue/' + id, 'GET'))?.json);
    setIsInQueue(inQueue.isInQueue);

    // move to the current game
    if (isInGameWith) {
      setHasReceivedInvitationFrom(undefined);
      setHasSendInvitationTo(undefined);
      setIsInQueue(undefined);
      navigate('/game');
    }
    // console.log('[', id, '] game Context values: ', {inGame:isInGameWith, inQueue:isInQueue, inviteFrom:hasReceivedInvitationFrom, inviteTo:hasSendInvitationTo, inviteType:gameTypeInvitation});
  }

  // Invites Management --------------------------------------------------------------------------------------------- //
  // Invites -- Event emission -------------------------------------------------------------------------------------- //
  function sendGameInvite(to: number | undefined, gameType:'normal' | 'special'){
    if (isInGameWith || !to) return;

    // Auto accept invite (if 'a' invite 'b' and 'b' invite 'a')
    if (hasReceivedInvitationFrom === to && gameType === gameTypeInvitation)
      return acceptGameInvite(hasReceivedInvitationFrom);

    // Auto cancel and decline other invites and leave queue
    if (hasReceivedInvitationFrom)
      declineGameInvite(hasReceivedInvitationFrom);
    if (hasSendInvitationTo)
      cancelGameInvite();
    if (isInQueue)
      leaveQueue();

    // Set invite and Send it
    // console.log('[', id, '] emit ', 'send_invite', { sender: id, receiver: to, gameType:gameType });
    socket?.emit('send_invite', { sender: id, receiver: to, gameType:gameType });
    setHasSendInvitationTo(to);
    setGameTypeInvitation(gameType);
    // console.log('user [' + id + '] SEND game invite to [' + hasSendInvitationTo + ']');
  }

  function acceptGameInvite(from: number | undefined = undefined){
    // Auto cancel and decline send invites
    if (hasSendInvitationTo && hasSendInvitationTo !== from)
      cancelGameInvite();
    if (hasReceivedInvitationFrom && hasReceivedInvitationFrom !== from)
      declineGameInvite(hasReceivedInvitationFrom)

    // console.log('[', id, '] emit ', 'accept_invite', { sender:id, receiver:from ? from : hasReceivedInvitationFrom, gameType:gameTypeInvitation });
    socket?.emit('accept_invite', { sender:id, receiver:from ? from : hasReceivedInvitationFrom, gameType:gameTypeInvitation });

    setHasReceivedInvitationFrom(undefined);
    // console.log('user [' + id + '] ACCEPTED game invite from [' + from ? from : hasReceivedInvitationFrom + ']');
  }

  function declineGameInvite(from:number){
    // console.log('[', id, '] emit ', 'decline_invite', { receiver:from, sender:id });
    socket?.emit('decline_invite', { receiver:from, sender:id });

    // reset the invite from
    if (hasReceivedInvitationFrom === from)
      setHasReceivedInvitationFrom(undefined);
    // console.log('user [' + id + '] DECLINE game invite from [' + from + ']');
  }

  function cancelGameInvite(){
    // console.log('[', id, '] emit ', 'cancel_invite', { receiver: hasSendInvitationTo, sender: id });
    socket?.emit('cancel_invite', { receiver: hasSendInvitationTo, sender: id });
    setHasSendInvitationTo(undefined);
    // console.log('user [' + id + '] CANCEL game invite to [' + hasSendInvitationTo + ']');
  }

  // Invites -- Event reception ------------------------------------------------------------------------------------- //
  function onGameInviteReceived(body: { sender: number, receiver: number, gameType:'normal' | 'special' }) {
    // console.log('[', id, '] received \'send_invite\'', body);
    if (id !== body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'send_invite\'');

    if (isInGameWith)
      return declineGameInvite(body.sender);

    // Auto accept invite (if 'a' invite 'b' and 'b' invite 'a')
    if (hasSendInvitationTo === body.sender && gameTypeInvitation === body.gameType)
      return acceptGameInvite(body.sender);

    // Auto Decline invite (if already in invite)
    if (hasSendInvitationTo || hasReceivedInvitationFrom || isInQueue)
      return declineGameInvite(body.sender);

    // Update Invitation
    setHasReceivedInvitationFrom(body.sender);
    setGameTypeInvitation(body.gameType)
    // console.log('user [' + id + '] RECEIVED game invite from [' + body.sender + ']');
  }

  function onGameInviteAccepted(body: { sender: number, receiver: number }){
    // console.log('[', id, '] received \'accept_invite\'', body);
    if (id !== body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'accept_invite\'');

    if (body.sender !== hasSendInvitationTo)
      return console.warn('user [' + id + '] RECEIVED: \'accept_invite\' form a player not invited');

    setHasReceivedInvitationFrom(undefined);
    setHasSendInvitationTo(undefined);

    // console.log('user [' + body.sender + '] ACCEPTED game invite from [' + id + ']');
  }

  function onGameInviteDeclined(body: { sender: number, receiver: number }){
    // console.log('[', id, '] received \'decline_invite\'', body);
    if (id !== body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'decline_invite\'');

    if (body.sender !== hasSendInvitationTo)
      return console.warn('user [' + id + '] RECEIVED: \'decline_invite\' form a player not invited');

    setHasSendInvitationTo(undefined);

    // console.log('user [' + body.sender + '] DECLINED game invite from [' + id + ']');
  }

  function onGameInviteCanceled(body: { sender: number, receiver: number }){
    // console.log('[', id, '] received \'cancel_invite\'', body);
    if (id !== body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'cancel_invite\'');

    if (body.sender !== hasReceivedInvitationFrom)
      return console.warn('user [' + id + '] RECEIVED: \'cancel_invite\' form a player who didn\'t invited him');

    setHasReceivedInvitationFrom(undefined);

    // console.log('user [' + body.sender + '] CANCELED game invite to [' + id + ']');
  }

  useEffect(() => {
    if (id === 0) return;
    // Invites -- Connection Socket --------------------------------------------------------------------------------- //
    // console.log('[', id, '] subscribed to send_invite');
    socket?.on('send_invite', onGameInviteReceived);
    // console.log('[', id, '] subscribed to accept_invite');
    socket?.on('accept_invite', onGameInviteAccepted);
    // console.log('[', id, '] subscribed to decline_invite');
    socket?.on('decline_invite', onGameInviteDeclined);
    // console.log('[', id, '] subscribed to cancel_invite');
    socket?.on('cancel_invite', onGameInviteCanceled);

    return () => {
      socket?.off('send_invite', onGameInviteReceived);
      socket?.off('accept_invite', onGameInviteAccepted);
      socket?.off('decline_invite', onGameInviteDeclined);
      socket?.off('cancel_invite', onGameInviteCanceled);
    };
    // eslint-disable-next-line
  }, [socket]);

  // Queue Management ----------------------------------------------------------------------------------------------- //
  // Queue -- Event emission ---------------------------------------------------------------------------------------- //
  function joinQueue(gameType: 'normal' | 'special'){
    // console.log('[', id, '] game Context values: ', {inGame:isInGameWith, inQueue:isInQueue, inviteFrom:hasReceivedInvitationFrom, inviteTo:hasSendInvitationTo, inviteType:gameTypeInvitation});
    if (isInGameWith)
      return;
    if (hasReceivedInvitationFrom)
      declineGameInvite(hasReceivedInvitationFrom);
    if (hasSendInvitationTo)
      cancelGameInvite();
    if (isInQueue && isInQueue !== gameType)
      leaveQueue();

    // console.log('[', id, '] emit ', 'join_queue', { sender: id, gameType: gameType });
    socket?.emit('join_queue', { sender: id, gameType: gameType });
    setIsInQueue(gameType);

  }

  function leaveQueue(){
    if (!isInQueue) return;
    // console.log('[', id, '] emit ', 'leave_queue', { sender: id, gameType: isInQueue });
    socket?.emit('leave_queue', { sender: id, gameType: isInQueue });
    setIsInQueue(undefined);
  }

  // Game Start / End Management ------------------------------------------------------------------------------------ //
  // Game Start / End -- Event emission ----------------------------------------------------------------------------- //
  function startGame(){
    // console.log('[', id, '] emit ', 'start_game', { sender: id });
    socket?.emit('start_game', { sender: id });
  }

  function leaveGame(){
    if (!isInGameWith) return;
    // console.log('[', id, '] emit ', 'leave_game', { sender: id });
    socket?.emit('leave_game', { sender: id });
    setHasReceivedInvitationFrom(undefined);
    setHasSendInvitationTo(undefined);
    setIsInQueue(undefined);
    navigate('/game/score');
  }

  // Game Start / End -- Event reception ---------------------------------------------------------------------------- //
  function onOpenGame(body: { p1: number, p2: number}){
    // console.log('[', id, '] received \'open_game\'', body);
    setHasReceivedInvitationFrom(undefined);
    setHasSendInvitationTo(undefined);
    setIsInQueue(undefined);
    setIsInGameWith(id === body.p1 ? body.p2 : body.p1);
    navigate('/game');
  }

  function onGameEnds(){
    // console.log('[', id, '] received \'end_game\'');
    setHasReceivedInvitationFrom(undefined);
    setHasSendInvitationTo(undefined);
    setIsInQueue(undefined);
    setIsInGameWith(undefined);
    navigate('/game/score');
  }

  useEffect(() => {
    if (id === 0) return;
    // Game Start / End -- Connection Socket ------------------------------------------------------------------------ //
    // console.log('[', id, '] subscribed to open_game');
    socket?.on('open_game', onOpenGame);
    // console.log('[', id, '] subscribed to end_game');
    socket?.on('end_game', onGameEnds);

    return () => {
      socket?.off('open_game', onOpenGame);
      socket?.off('end_game', onGameEnds);
    };
    // eslint-disable-next-line
  }, [socket]);

  return (
    <>
      <GameContext.Provider value={{
        hasReceivedInvitationFrom,
        hasSendInvitationTo,
        isInGameWith,

        sendGameInvite,
        acceptGameInvite,
        declineGameInvite,
        cancelGameInvite,

        joinQueue,
        leaveQueue,

        startGame,
        leaveGame,

        fetchGameContext
      }}>
        {children}
      </GameContext.Provider>
    </>
  );
}
