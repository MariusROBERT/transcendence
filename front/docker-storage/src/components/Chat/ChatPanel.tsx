import { useEffect, useRef, useState } from 'react';
import { Viewport, color, Fetch } from '../../utils';
import { Background, RoundButton, ChatMessage, ChanUserList } from '..';
import { useUserContext } from '../../contexts';
import { subscribe } from '../../utils/event';
import {
  GetCurrChan,
  UpdateChannelUsers,
  current_chan,
} from '../../utils/channel_functions';
import { ChannelMessage, IChatUser } from '../../utils/interfaces';
import ChatUser from './ChatUser';

interface Props {
  viewport: Viewport;
  width: number;
}

export function ChatPanel({ viewport, width }: Props) {
  const [inputValue, setInputValue] = useState<string>('');
  const [userVisible, setUserVisible] = useState<boolean>(false);
  const [currUser, setCurrUser] = useState<IChatUser>();
  const [id, setId] = useState<number>(-1);
  const { socket } = useUserContext();
  const [msg, setMessage] = useState<ChannelMessage[]>([]);
  const msgsRef = useRef<HTMLDivElement | null>(null);

  //  See if there is a better way to do this
  const getMsg = async (message: ChannelMessage) => {
    setMessage([...msg, message]);
    setInputValue('');
  };

  useEffect(() => {
    socket?.on('message', getMsg);
    return () => {
      socket?.off('message', getMsg);
    };
  });

  const updateUsers = async (id: number) => {
    UpdateChannelUsers(id);
  };

  useEffect(() => {
    socket?.on('join', updateUsers);
    return () => {
      socket?.off('join', updateUsers);
    };
  }, []);

  useEffect(() => {
    subscribe('enter_chan', async (event: any) => {
      //console.log(event.detail.value)
      setMessage(event.detail.value);
      //console.log(event.detail.id);
      setId(event.detail.id);
    });
  }, []);

  async function execCommand(command: string, cmd: string): Promise<boolean> {
    const split = cmd.split(' ');

    if (split.length === 3 && split[0] === command) {
      const id_channel = parseInt(split[1], 10);
      const id_user = parseInt(split[2], 10);
      setInputValue('');
      Fetch(
        'channel/' + command + '/' + id_channel,
        'POST',
        JSON.stringify({
          id: id_user,
        }),
      );
      return true;
    }
    return false;
  }

  async function CommandParsing(): Promise<boolean> {
    const command = inputValue;
    const split = command.split(' ');

    if (await execCommand('add_admin', command)) return true;
    if (await execCommand('kick', command)) return true;
    if (await execCommand('ban', command)) return true;
    if (await execCommand('unban', command)) return true;

    //  Mute
    if (split.length === 4 && split[0] === 'mute') {
      const id_channel = parseInt(split[1], 10);
      const id_user = parseInt(split[2], 10);
      const time = parseInt(split[3], 10);
      setInputValue('');
      Fetch(
        'channel/mute/' + id_channel,
        'POST',
        JSON.stringify({
          id: id_user,
          time: time,
        }),
      );
      return true;
    }

    //  Unmute
    if (split.length === 3 && split[0] === 'unmute') {
      const id_channel = parseInt(split[1], 10);
      const id_user = parseInt(split[2], 10);
      setInputValue('');
      Fetch(
        'channel/unmute/' + id_channel,
        'POST',
        JSON.stringify({
          id: id_user,
        }),
      );
      return true;
    }
    return false;
  }

  async function onEnterPressed() {
    if (inputValue.length <= 0 || inputValue.length > 256) return;
    if (await CommandParsing()) return; // If it's a command do not continue
    const chan = await GetCurrChan();
    socket?.emit('message', { message: inputValue, channel: chan });
  }

  async function OnUserClick(msgs: ChannelMessage) {
    setCurrUser(msgs);
    setUserVisible(true);
  }

  useEffect(() => {
    // Faites défiler automatiquement vers le bas à chaque mise à jour du composant
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [msg]);

  function chat() {
    return (
      <>
        {msg.map((data, idx) => (
          <ChatMessage
            key={idx}
            data={data}
            onClick={OnUserClick}
            last={idx > 0 ? msg[idx - 1].sender_id : undefined}
          >
            {data.message_content}
          </ChatMessage>
        ))}
      </>
    );
  }

  function inputMessage() {
    if (current_chan != '') {
      return (
        <>
          <input
            value={inputValue}
            onChange={(evt) => {
              setInputValue(evt.target.value);
            }}
            onKeyDown={(e) => {
              if (e.keyCode !== 13) return;
              onEnterPressed();
            }}
            maxLength={256}
            style={{
              height: 50 + 'px',
              flex: 'auto',
              backgroundColor: color.grey,
              borderRadius: '15px',
              border: '0',
            }}
          ></input>
          <RoundButton
            icon_size={50}
            icon={require('../../assets/imgs/icon_play.png')}
            onClick={onEnterPressed}
          ></RoundButton>
        </>
      );
    }
    return <></>;
  }

  return (
    <Background flex_justifyContent={'space-evenly'}>
      <div style={{ minHeight: '60px', paddingTop: 10 }} />
      <ChanUserList onClick={OnUserClick} chan_id={id} />
      <div
        style={{
          height: viewport.height - 125 + 'px',
          width: width - 50 + 'px',
          backgroundColor: '#00375Cbb',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px 5px',
          padding: '10px',
          borderRadius: '15px',
          overflow: 'scroll',
        }}
        ref={msgsRef as React.RefObject<HTMLDivElement>}
      >
        {chat()}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: width - 30 + 'px',
        }}
      >
        {inputMessage()}
        <ChatUser data={currUser} visibility={userVisible} onClose={() => setUserVisible(false)}></ChatUser>
      </div>
    </Background>
  );
}
