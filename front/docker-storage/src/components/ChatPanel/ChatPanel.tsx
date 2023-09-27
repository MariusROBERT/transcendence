import { useEffect, useState } from 'react';
import { color, Viewport } from '../../utils';
import { Background, RoundButton } from '..';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatMenu, current_chan } from '../ChanMenu/ChatMenu';
import { useUserContext } from '../../contexts';

interface Props {
  viewport: Viewport;
  width: number;
}

export function ChatPanel({ viewport, width }: Props) {
  const [inputValue, setInputValue] = useState<string>('');
  const { socket } = useUserContext();

  // this should be in the back
  let [msg, setMessage] = useState<{ msg: string; owner: boolean }[]>([]);

  const getMsg = (message: any) => {
    var owner = false;

    if (message.sock_id === socket?.id) owner = true;
    setMessage([...msg, { msg: message.msg, owner: owner }]);
    setInputValue('');
  };

  useEffect(() => {
    socket?.on('message', getMsg);
    return () => {
      socket?.off('message', getMsg);
    };
  }, [getMsg]);

  function onEnterPressed() {
    if (inputValue == '') return;
    console.log('send message to ' + current_chan);
    socket?.emit('message', { message: inputValue, user: 0, channel: current_chan });
  }

  function chat() {
    //TODO: get message from the DB and display them here.
    return (
      <>
        {msg.map((txt, idx) => (
          <ChatMessage
            key={idx}
            user_icon={require('../../assets/imgs/icon_chat.png')}
            isOwnMessage={txt.owner}
          >
            {txt.msg}
          </ChatMessage>
        ))}
      </>
    );
  }


  return (
    <Background flex_justifyContent={'space-evenly'}>
      <ChatMenu></ChatMenu>
      <div style={{
        height: viewport.height - 125 + 'px',
        width: width - 50 + 'px',
        backgroundColor: color.grey,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px 5px',
        padding: '10px',
        borderRadius: '15px',
        overflow: 'scroll',
      }}>
        {chat()}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width - 30 + 'px',
      }}>
        <input value={inputValue}
               onChange={(evt) => {
                 setInputValue(evt.target.value);
               }}
               onKeyDown={(e) => {
                 if (e.keyCode != 13) return;
                 onEnterPressed();
               }}
               style={{
                 height: 50 + 'px',
                 flex: 'auto',
                 backgroundColor: color.grey,
                 borderRadius: '15px',
                 border: '0',
               }}
        >
        </input>
        <RoundButton icon_size={50} icon={require('../../assets/imgs/icon_play.png')}
                     onClick={onEnterPressed}></RoundButton>
      </div>
    </Background>
  );
}
