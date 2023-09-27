import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Fetch } from '../../utils';
import { useUserContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import { declineInvite } from '../../utils/user_functions';

type GameContextType = {
  hasReceivedInvitationFrom: number | undefined,
  hasSendInvitationTo: number | undefined,
  isInGameWith: number | undefined,

  sendGameInvite: (to: number) => void,
  acceptGameInvite: (from: number) => void,
  declineGameInvite: (from:number) => void,
  cancelGameInvite: () => void,

  fetchGameContext: () => void
}

const GameContext = createContext<GameContextType>({
  hasReceivedInvitationFrom: undefined,
  hasSendInvitationTo: undefined,
  isInGameWith: undefined,

  sendGameInvite: (to: number) => {},
  acceptGameInvite: (from: number) => {},
  declineGameInvite: (from:number) => {},
  cancelGameInvite: () => {},

  fetchGameContext: () => {}
});

export function useGameContext() {
  return useContext(GameContext);
}

interface Props {
  children: ReactNode;
}

export function GameContextProvider({ children }: Props) {
  const navigate = useNavigate();
  const { socket, id } = useUserContext();
  const [hasReceivedInvitationFrom, setHasReceivedInvitationFrom] = useState<number | undefined>();
  const [hasSendInvitationTo, setHasSendInvitationTo] = useState<number | undefined>();
  const [isInGameWith, setIsInGameWith] = useState<number | undefined>();

  async function fetchGameContext(): Promise<void> {
    let gameStatus: {gameInvitationFrom:number, gameInvitationTo:number, isInGameWith:number};
    try{
      gameStatus = (await Fetch('user/get_game_status', 'GET'))?.json;
    } catch (e) {
      console.log(e);
    }
    if (!gameStatus) return;
    setHasReceivedInvitationFrom(gameStatus?.gameInvitationFrom);
    setHasSendInvitationTo(gameStatus?.gameInvitationTo);
    setIsInGameWith(gameStatus?.isInGameWith);
  }

  // Invites Management --------------------------------------------------------------------------------------------- //
  // Invites -- Event emission -------------------------------------------------------------------------------------- //
  function sendGameInvite(to: number){
    if (isInGameWith) return;

    // Auto accept invite (if 'a' invite 'b' and 'b' invite 'a')
    if (hasReceivedInvitationFrom === to)
      return acceptGameInvite(hasReceivedInvitationFrom);

    // Auto cancel and decline other invites
    if (hasReceivedInvitationFrom)
      declineGameInvite(hasReceivedInvitationFrom);
    if (hasSendInvitationTo)
      cancelGameInvite();

    // Set invite and Send it
    socket?.emit('send_invite', { receiver: hasSendInvitationTo, sender: id });
    setHasSendInvitationTo(to);
    console.log('user [' + id + '] SEND game invite to [' + hasSendInvitationTo + ']');
  }

  function acceptGameInvite(from: number){
    // Auto cancel and decline send invites
    if (hasSendInvitationTo && hasSendInvitationTo !== from)
      cancelGameInvite();
    if (hasReceivedInvitationFrom && hasReceivedInvitationFrom !== from)
      declineGameInvite(hasReceivedInvitationFrom)

    socket?.emit('accept_invite', { receiver:hasReceivedInvitationFrom, sender:id });
    setIsInGameWith(from);

    setHasReceivedInvitationFrom(undefined);
    console.log('user [' + id + '] ACCEPTED game invite from [' + hasReceivedInvitationFrom + ']');
  }

  function declineGameInvite(from:number){
    socket?.emit('decline_invite', { receiver:from, sender:id });

    // reset the invite from
    if (hasReceivedInvitationFrom === from)
      setHasReceivedInvitationFrom(undefined);
    console.log('user [' + id + '] DECLINE game invite from [' + from + ']');
  }

  function cancelGameInvite(){
    socket?.emit('cancel_invite', { receiver: hasSendInvitationTo, sender: id });
    setHasSendInvitationTo(undefined);
    console.log('user [' + id + '] CANCEL game invite to [' + hasSendInvitationTo + ']');
  }

  // Invites -- Event reception ------------------------------------------------------------------------------------- //
  function onGameInviteReceived(body:{ sender: number, receiver: number }){
    if (id != body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'send_invite\'');

    if (isInGameWith)
      return declineGameInvite(body.sender);

    // Auto accept invite (if 'a' invite 'b' and 'b' invite 'a')
    if (hasSendInvitationTo === body.sender)
      return acceptGameInvite(body.sender);

    // Auto Decline invite (if already in invite)
    if (hasSendInvitationTo || hasReceivedInvitationFrom)
      return declineGameInvite(body.sender);

    // Update Invitation
    setHasReceivedInvitationFrom(body.sender);
    console.log('user [' + id + '] RECEIVED game invite from [' + body.sender + ']');
  }

  function onGameInviteAccepted(body:{ sender: number, receiver: number }){
    if (id != body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'accept_invite\'');

    if (body.sender !== hasSendInvitationTo)
      return console.warn('user [' + id + '] RECEIVED: \'accept_invite\' form a player not invited');

    setHasReceivedInvitationFrom(undefined);
    setHasSendInvitationTo(undefined);
    setIsInGameWith(body.sender);

    console.log('user [' + body.sender + '] ACCEPTED game invite from [' + id + ']');
  }

  function onGameInviteDeclined(body:{ sender: number, receiver: number }){
    if (id != body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'decline_invite\'');

    if (body.sender !== hasSendInvitationTo)
      return console.warn('user [' + id + '] RECEIVED: \'decline_invite\' form a player not invited');

    setHasSendInvitationTo(undefined);

    console.log('user [' + body.sender + '] DECLINED game invite from [' + id + ']');
  }

  function onGameInviteCanceled(body:{ sender: number, receiver: number }){
    if (id != body.receiver)
      return console.warn('user [' + id + '] RECEIVED message destined to [' + body.receiver + ']: \'cancel_invite\'');

    if (body.sender !== hasReceivedInvitationFrom)
      return console.warn('user [' + id + '] RECEIVED: \'cancel_invite\' form a player who didn\'t invited him');

    setHasReceivedInvitationFrom(undefined);

    console.log('user [' + body.sender + '] CANCELED game invite to [' + id + ']');
  }

  // Invites -- Connection Socket ----------------------------------------------------------------------------------- //
  useEffect(() => {
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
  }, [socket]);

  // Start Game Management ------------------------------------------------------------------------- //
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
        fetchGameContext
      }}>
        {children}
      </GameContext.Provider>
    </>
  );
}
