import { useEffect, useState } from 'react';
import { Button } from '../ComponentBase/Button';
import { ErrorPanel } from '../Error/ErrorPanel';
import { createChatStyle, inputStyle } from './CreateChat';
import { ChannelPublicPass } from '../../utils/interfaces';
import {
  SetCurrChan,
  UpdateChannelMessage,
  UpdateChannelUsers,
  current_chan,
} from '../../utils/channel_functions';
import { Fetch } from '../../utils';
import { useUserContext } from '../../contexts';
import { publish } from '../../utils/event';

interface Props {
  visible: boolean;
  setVisible: (b: boolean) => void;
  current: ChannelPublicPass | undefined;
}

export default function EnterPassword({ visible, setVisible, current }: Props) {
  const [password, setPassword] = useState<string>('');
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, seterrorMessage] = useState<string>('Error');
  const { socket } = useUserContext();

  async function AddUserInChannel() {
    if (current?.channel_name === current_chan) return;
    const res = await Fetch(
      'channel/add_user/' + current?.id,
      'POST',
      JSON.stringify({
        password: password,
      }),
    );
    if (res?.json?.statusCode === 400) return 400;
    UpdateChannelMessage(Number(current?.id));
    UpdateChannelUsers(Number(current?.id));
    publish('open_chat', undefined);
    return 0;
  }

  useEffect(() => {
    if (!visible) {
      setPassword('');
      setErrorVisible(false);
    }
  }, [visible]);

  async function OnJoinChannel(id:number, name: string) {
    UpdateChannelMessage(id);
    UpdateChannelUsers(id);
    SetCurrChan(name);
    socket?.emit('join', { channel: name } as any);
    publish('open_chat', undefined);
    document.getElementById('inpt')?.focus();
  }

  async function OnButtonClick() {
    if (current === undefined) return;
    if ((await AddUserInChannel()) === 400) {
      seterrorMessage('Wrong password');
      setErrorVisible(true);
    } else {
      setVisible(false);
      if (current.channel_name) {
        OnJoinChannel(current.id, current.channel_name);
        // socket?.emit('join', { channel: current?.channel_name });
      }
    }
  }

  return (
    <div style={createChatStyle}>
      <div style={{ visibility: errorVisible ? 'inherit' : 'hidden' }}>
        <ErrorPanel text={errorMessage}></ErrorPanel>
      </div>
      <h2>Enter Password</h2>

      <p>
        <input
          placeholder='Password'
          style={inputStyle}
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        ></input>
      </p>
      <p>
        <Button onClick={OnButtonClick}>Enter Channel</Button>
      </p>
    </div>
  );
}
