import { useState } from 'react';
import { Fetch, color } from '../../utils';
import { RoundButton } from '../RoundButton/RoundButton';
import { Button } from '../Button/Button';
import { IChatUser } from '../../utils/interfaces';

interface Props {
  data: IChatUser | undefined;
}

export default function ChatUser({ data }: Props) {
  const [muteTime, setmuteTime] = useState<string>('');

  async function OnProfilClick() {}

  async function execCommand(command: string) {
    Fetch(
      'channel/' + command + '/' + data?.channel_id,
      'POST',
      JSON.stringify({
        id: data?.sender_id,
      }),
    );
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
    if (isnum)
    {
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
    }
  }

  async function OnUnMute() {
    execCommand('unmute');
  }

  async function OnAddAdmin() {
    execCommand('add_admin');
  }

  async function OnRemAdmin() {
    execCommand('rem_admin');
    console.log("salut");
  }

  return (
    <div style={createChatStyle}>
      <h2>
        {data?.sender_username}#{data?.sender_id}
      </h2>
      <RoundButton
        icon_size={100}
        icon={String(data?.sender_urlImg)}
        onClick={OnProfilClick}
      ></RoundButton>
      <p>
        <Button onClick={OnKick}> Kick </Button>
      </p>
      <p>
        <Button onClick={OnBan}> Ban </Button>
      </p>
      <p>
        <Button onClick={OnUnBan}> UnBan </Button>
      </p>
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
      <p>
        <Button onClick={OnUnMute}> UnMute </Button>
      </p>
      <p>
        <Button onClick={OnAddAdmin}> Add as Admin </Button>
      </p>
      <p>
        <Button onClick={OnRemAdmin}> Rem as Admin </Button>
      </p>
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