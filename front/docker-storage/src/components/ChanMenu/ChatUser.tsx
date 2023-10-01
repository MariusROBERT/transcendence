import { useState } from 'react';
import { color } from '../../utils';
import { RoundButton } from '../RoundButton/RoundButton';
import { Button } from '../Button/Button';
import { IChatUser } from '../../utils/interfaces';

interface Props {
  data: IChatUser | undefined;
}

export default function ChatUser({ data }: Props) {
  const [muteTime, setmuteTime] = useState<string>('');

  async function OnButtonClick() {}

  async function OnKick() {}

  async function OnBan() {}

  async function OnUnBan() {}

  async function OnMute() {}

  async function OnAddAdmin() {}

  async function OnRemAdmin() {}

  return (
    <div style={createChatStyle}>
      <h2>
        {data?.sender_username}#{data?.sender_id}
      </h2>
      <RoundButton
        icon_size={100}
        icon={String(data?.sender_urlImg)}
        onClick={() => console.log('click')}
      ></RoundButton>
      <p>
        <Button onClick={OnButtonClick}> Kick </Button>
      </p>
      <p>
        <Button onClick={OnButtonClick}> Ban </Button>
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
        <Button onClick={OnButtonClick}> Mute </Button>
      </p>
      <p>
        <Button onClick={OnButtonClick}> Add as Admin </Button>
      </p>
      <p>
        <Button onClick={OnButtonClick}> Rem as Admin </Button>
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
