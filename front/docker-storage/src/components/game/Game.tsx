import { useEffect, useState } from 'react';
import { DrawGame } from './DrawGame';
import { gameRoom, start, State } from './game.utils';
import { useUserContext } from '../../contexts';

interface Props {
  inGame: boolean,
  setInGame: (value: boolean) => void
}

export function Game({ inGame, setInGame }: Props) {
  const [state, setState] = useState<State>(start);
  const { id, socket } = useUserContext();

  function stateListener(game: gameRoom) {
    if (game.playerIds[0] !== id && game.playerIds[1] !== id) return;
    setState(game.state);
  }

  function openGame() {
    setInGame(true);
  }

  useEffect(() => {
    socket?.on('sendState', stateListener);
    return () => {
      socket?.off('sendState', stateListener);
    };
  }, [stateListener]);

  useEffect(() => {
    socket?.on('open_game', openGame);
    return () => {
      socket?.off('open_game', openGame);
    };
  }, [openGame]);

  return (
    <div style={{
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: inGame ? '100%' : '0px',
      height: inGame ? '100%' : '0px',
    }}>
      {inGame && <DrawGame state={state}/>}
    </div>
  );
}