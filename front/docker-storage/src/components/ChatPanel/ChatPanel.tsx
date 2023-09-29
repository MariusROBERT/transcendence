import { useEffect, useState } from 'react';
import { Viewport } from '../../utils/Viewport';
import { color } from '../../utils/Global';
import { Background, RoundButton } from '..';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatMenu } from '../ChanMenu/ChatMenu';
import { useUserContext } from '../../contexts';
import { ChanUserList } from '../ChanUserList/ChanUserList';
import { subscribe } from '../../utils/event';
import {
  GetCurrChan,
  UpdateChannelMessage,
} from '../../utils/channel_functions';
import { ChannelMessage, SocketMessage } from '../../utils/interfaces';
import { Fetch } from '../../utils';

interface Props {
  viewport: Viewport;
  width: number;
}

export function ChatPanel({ viewport, width }: Props) {
  const [inputValue, setInputValue] = useState<string>('');
  const { socket } = useUserContext();
  let [msg, setMessage] = useState<ChannelMessage[]>([]);

  //  See if there is a better way to do this
  const getMsg = async (message: SocketMessage) => {
    if ((await GetCurrChan()) === message.name)
      UpdateChannelMessage(message.id);
    setInputValue('');
  };

  useEffect(() => {
    socket?.on('message', getMsg);
    return () => {
      socket?.off('message', getMsg);
    };
  }, [getMsg]);

  useEffect(() => {
    subscribe('enter_chan', async (event: any) => {
      //  TODO: add check for owner
      setMessage(event.detail.value);
    });
  });

  async function execCommand(command: string, cmd: string) : Promise<boolean> {
    const split = cmd.split(' ');
  
    if (split.length === 3 && split[0] === command) {
      const id_channel = parseInt(split[1], 10);
      const id_user = parseInt(split[2], 10);
      setInputValue("");
      Fetch("channel/" + command + "/" + id_channel, "POST", JSON.stringify({
        id: id_user,
      }),);
      return true;
    }
    return false;
  }

  async function CommandParsing() : Promise<boolean> {
    const command = inputValue;
    const split = command.split(' ');

    if (await execCommand("add_admin", command) == true)
      return true;
    if (await execCommand("kick", command) == true)
      return true;
    if (await execCommand("ban", command) == true)
      return true;
    if (await execCommand("unban", command) == true)
      return true;

    //  Mute
    if (split.length === 4 && split[0] === "mute") {
      const id_channel = parseInt(split[1], 10);
      const id_user = parseInt(split[2], 10);
      const time = parseInt(split[3], 10);
      setInputValue("");
      Fetch("channel/" + "mute" + "/" + id_channel, "POST", JSON.stringify({
        id: id_user,
        time: time,
      }),);
      return true;
    }

    //  Unmute
    if (split.length === 3 && split[0] === "unmute") {
      const id_channel = parseInt(split[1], 10);
      const id_user = parseInt(split[2], 10);
      setInputValue("");
      Fetch("channel/" + "unmute" + "/" + id_channel, "POST", JSON.stringify({
        id: id_user,
      }),);
      return true;
    }
    return false;
  }

  async function onEnterPressed() {
    if (inputValue.length <= 0) return;
    if (await CommandParsing() === true) return; // If its a command do not continue
    const chan = await GetCurrChan();
    socket?.emit('message', { message: inputValue, channel: chan });
  }

  function chat() {
    return (
      <>
        {msg.map((data, idx) => (
          <ChatMessage
            key={idx}
            user_icon={data.sender_urlImg}
            user_name={data.sender_username}
            date={new Date()} //  TODO Change by real dates
            uid={data.sender_id}
          >
            {data.message_content}
          </ChatMessage>
        ))}
      </>
    );
  }

  return (
    <Background flex_justifyContent={'space-evenly'}>
      <ChatMenu></ChatMenu>
      <ChanUserList></ChanUserList>
      <div
        style={{
          height: viewport.height - 125 + 'px',
          width: width - 50 + 'px',
          backgroundColor: color.grey,
          display: 'flex',
          flexDirection: 'column',
          gap: '5px 5px',
          padding: '10px',
          borderRadius: '15px',
          overflow: 'scroll',
        }}
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
        <input
          value={inputValue}
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
        ></input>
        <RoundButton
          icon_size={50}
          icon={require('../../assets/imgs/icon_play.png')}
          onClick={onEnterPressed}
        ></RoundButton>
      </div>
    </Background>
  );
}
