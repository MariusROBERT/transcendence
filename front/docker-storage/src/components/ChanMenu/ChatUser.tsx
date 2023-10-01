import { useEffect, useState } from 'react';
import { Fetch, color } from '../../utils';
import { Btn } from '../Settings/settings';
import { RoundButton } from '../RoundButton/RoundButton';
import { publish } from '../../utils/event';
import { Button } from '../Button/Button';

interface Props {
  user_icon: string;
  user_name: string;
}

export default function ChatUser({ user_icon, user_name }: Props) {
  const [muteTime, setmuteTime] = useState<string>('');

  async function OnButtonClick() {
  }

  return (
    <div style={createChatStyle}>
      <h2>{user_name}</h2>
      <RoundButton icon_size={100} icon={user_icon} onClick={() => console.log("click")}></RoundButton>
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
