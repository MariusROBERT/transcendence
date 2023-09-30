import { useEffect, useState } from 'react';
import { color } from '../../utils';
import { Btn } from '../Settings/settings';
import { RoundButton } from '../RoundButton/RoundButton';

interface Props {
  name: string;
}

export default function CreateChat({name}: Props) {
  const [channelName, setChannelName] = useState<string>(name);
  const [password, setPassword] = useState<string>('');

  async function OnButtonClick() {
    console.log('creating channel');
  }

  return (
    <div style={createChatStyle}>
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
        <input type="radio" value="Public" name="type" /> Public
        <input type="radio" value="Private" name="type" /> Private
      </div>

      <h4>Add admins</h4>
      <RoundButton
        icon={require('../../assets/imgs/icon_add_friend.png')}
        icon_size={42}
        onClick={() => console.log('add admin')}
      ></RoundButton>

      <h4>Add users</h4>
      <RoundButton
        icon={require('../../assets/imgs/icon_add_friend.png')}
        icon_size={42}
        onClick={() => console.log('add user')}
      ></RoundButton>
      <br></br>

      <button style={Btn} onClick={OnButtonClick}>
        <p style={{ margin: 'auto' }}>Save</p>
      </button>
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
  top: '-12px',
  height: '32px',
  width: '315px',
  backgroundColor: color.white,
};
