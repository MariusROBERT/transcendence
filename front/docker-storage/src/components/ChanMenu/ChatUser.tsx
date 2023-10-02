import { useEffect, useState } from 'react';
import { Fetch, color } from '../../utils';
import { RoundButton } from '../RoundButton/RoundButton';
import { Button } from '../Button/Button';
import { IChatUser } from '../../utils/interfaces';
import { ErrorPanel } from '../Error/ErrorPanel';

interface Props {
  data: IChatUser | undefined;
  visibility: boolean
}

export default function ChatUser({ data, visibility }: Props) {
  const [muteTime, setmuteTime] = useState<string>('');
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, seterrorMessage] = useState<string>('Error');

  useEffect(() => {
    if (visibility === false)
      setErrorVisible(false);
  })

  async function OnProfilClick() {}

  async function execCommand(command: string) {
    const rep = await Fetch(
      'channel/' + command + '/' + data?.channel_id,
      'POST',
      JSON.stringify({
        id: data?.sender_id,
      }),
    );
    if (rep?.json.statusCode === 400) {
      seterrorMessage(rep?.json.message);
      setErrorVisible(true);
    }
  }

  async function OnKick() {
    execCommand('kick');
  }

  async function OnBan() {
    execCommand('ban');
  }

  async function OnUnBan() {
    execCommand('unban');
  }

  async function OnMute() {
    if (muteTime === '') return;
    let isnum = /^\d+$/.test(muteTime);
    if (isnum) {
      const number = Number(muteTime);
      Fetch(
        'channel/mute/' + data?.channel_id,
        'POST',
        JSON.stringify({
          id: data?.sender_id,
          time: number,
        }),
      );
      setmuteTime('');
      return;
    }
    setErrorVisible(true);
    seterrorMessage('mute time is number only')
  }

  async function OnUnMute() {
    execCommand('unmute');
  }

  async function OnAddAdmin() {
    execCommand('add_admin');
  }

  async function OnRemAdmin() {
    execCommand('rem_admin');
    console.log('salut');
  }

  return (
    <div style={createChatStyle}>
      <div style={{ visibility: errorVisible ? 'inherit' : 'hidden' }}>
        <ErrorPanel text={errorMessage}></ErrorPanel>
      </div>
      <h2>
        {data?.sender_username}#{data?.sender_id}
      </h2>
      <RoundButton
        icon_size={100}
        icon={String(data?.sender_urlImg)}
        onClick={OnProfilClick}
      ></RoundButton>
      <Button onClick={OnKick}> Kick </Button>
      <Button onClick={OnBan}> Ban </Button>
      <Button onClick={OnUnBan}> UnBan </Button>
      <p>
        <input
          placeholder="Time in second"
          style={inputStyle}
          value={muteTime}
          onChange={(evt) => {
            setmuteTime(evt.target.value);
          }}
        ></input>
        <Button onClick={OnMute}> Mute </Button>
      </p>
      <Button onClick={OnUnMute}> UnMute </Button>
      <Button onClick={OnAddAdmin}> Add as Admin </Button>
      <Button onClick={OnRemAdmin}> Rem as Admin </Button>
    </div>
  );
}

const createChatStyle: React.CSSProperties = {
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

const inputStyle: React.CSSProperties = {
  outline: 'none',
  borderRadius: '10px',
  border: 'none',
  position: 'relative',
  top: '0px',
  left: '-10px',
  height: '32px',
  width: '200px',
  backgroundColor: color.white,
};
