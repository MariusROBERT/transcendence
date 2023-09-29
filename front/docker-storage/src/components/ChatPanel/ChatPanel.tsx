import { useEffect, useState } from 'react';
import { color, Viewport } from '../../utils';
import { Background, RoundButton } from '..';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatMenu, current_chan } from '../ChanMenu/ChatMenu';
import { useUserContext } from '../../contexts';
import { ChanUserList } from '../ChanUserList/ChanUserList';
import { subscribe, unsubscribe } from '../../utils/event';

interface Props {
  viewport: Viewport;
  width: number;
}

export function ChatPanel({ viewport, width }: Props) {
  const [inputValue, setInputValue] = useState<string>('');
  const { socket } = useUserContext();

  // this should be in the back
  let [msg, setMessage] = useState<any[]>([]);

  useEffect(() => {
    const getMsg = (message: any) => {
      setMessage([...msg, { message_content: message.msg, user_name: 'Test' }]);
      setInputValue('');
    };

    socket?.on('message', getMsg);
    return () => {
      socket?.off('message', getMsg);
    };
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    subscribe('enter_chan', async (event: any) => {
      //  TODO: add check for owner
      setMessage(event.detail.value);
    });
    return () => {
      unsubscribe('enter_chan', null);
    };
  });

  function onEnterPressed() {
    if (inputValue.length <= 0) return;
    console.log('send message to ' + current_chan);
    socket?.emit('message', { message: inputValue, channel: current_chan });
  }

  function chat() {
    return (
      <>
        {msg.map((data, idx) => (
          <ChatMessage
            key={idx}
            user_icon={require('../../assets/imgs/icon_chat.png')}
            user_name={data.sender_username}
            date={new Date()}
          >
            {data.message_content}
          </ChatMessage>
        ))}
      </>
    );
  }


  return (
    <Background flex_justifyContent={'space-evenly'}>
      <div style={{minHeight:'70px'}} />
      <ChatMenu/>
      <ChanUserList/>
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
                 if (e.keyCode !== 13) return;
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
                     onClick={onEnterPressed}/>
      </div>
    </Background>
  );
}
