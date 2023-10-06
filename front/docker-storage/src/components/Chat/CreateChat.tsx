import { useEffect, useState } from 'react';
import { Fetch, color } from '../../utils';
import { publish } from '../../utils/event';
import { Button } from '../ComponentBase/Button';
import { ErrorPanel } from '../Error/ErrorPanel';
import { UpdateChannels } from '../../utils/channel_functions';

interface Props {
  name: string; //  Pass the user name in ChatMenu
  visible: boolean;
  setVisible: (b: boolean) => void;
}

export default function CreateChat({ name, visible, setVisible }: Props) {
  const [channelName, setChannelName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, seterrorMessage] = useState<string>('Error');
  const [channelStatus, setChannelStatus] = useState('public');

  useEffect(() => {
    if (visible === false) {
      setChannelName('');
      setPassword('');
      setErrorVisible(false);
    }
  }, [visible]);

  async function OnButtonClick() {
    if (channelName === '') return;
    const rep = await Fetch(
      'channel',
      'POST',
      JSON.stringify({
        channel_name: channelName,
        priv_msg: false,
        password: password === '' ? undefined : password,
        chan_status: channelStatus,
      }),
    );
    if (rep?.json.statusCode === 409 || rep?.json.statusCode === 400) {
      seterrorMessage(rep?.json.message);
      setErrorVisible(true);
      return;
    }
    setVisible(false);
    publish('chat_created', undefined);
    UpdateChannels();
  }

  return (
    <div style={createChatStyle}>
      <div style={{ visibility: errorVisible ? 'inherit' : 'hidden' }}>
        <ErrorPanel text={errorMessage}></ErrorPanel>
      </div>

      <h2>Create Channel</h2>

      <p>
        <input
          placeholder="Name"
          style={inputStyle}
          value={channelName}
          onChange={(evt) => {
            setChannelName(evt.target.value);
          }}
        ></input>
      </p>

      <p>
        <input
          placeholder="Optional password"
          style={inputStyle}
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        ></input>
      </p>

      <div>
        <input
          type="radio"
          value="Public"
          name="type"
          checked={true}
          onChange={() => setChannelStatus('public')}
        />{' '}
        Public
        <input type="radio" value="Private" name="type" onChange={() => setChannelStatus('private')}/> Private
      </div>
      <p>
        <Button onClick={OnButtonClick}>Save</Button>
      </p>
    </div>
  );
}

export const createChatStyle: React.CSSProperties = {
  borderRadius: '10px',
  padding: '42px',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  background: 'grey',
  height: '100%',
  color: 'white',
  margin: '10px',
  cursor: 'pointer',
  minWidth: '300px',
};

export const inputStyle: React.CSSProperties = {
  outline: 'none',
  borderRadius: '10px',
  border: 'none',
  position: 'relative',
  top: '-12px',
  height: '32px',
  width: '315px',
  backgroundColor: color.white,
};
