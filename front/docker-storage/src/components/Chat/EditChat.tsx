import { useState } from 'react';
import { RoundButton } from '../ComponentBase/RoundButton';
import { Button } from '../ComponentBase/Button';
import { ChannelPublic } from '../../utils/interfaces';
import { createChatStyle, inputStyle } from './CreateChat';

interface Props {
  data: ChannelPublic | undefined;
}

export default function EditChat({ data }: Props) {
  const [password, setPassword] = useState<string>('');

  return (
    <div style={createChatStyle}>
      <h2>Edit Channel</h2>

      <p style={{ textAlign: 'center', fontSize: '14px' }}>
        <input
          placeholder="New password"
          style={inputStyle}
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        ></input>
        <br />
        leave empty to remove password
      </p>

      <div>
        <input type="radio" value="Public" name="type" /> Public
        <input type="radio" value="Private" name="type" /> Private
      </div>

      <h4>User List</h4>
      <RoundButton
        icon={require('../../assets/imgs/icon_add_friend.png')}
        icon_size={42}
        onClick={() => {}}
      ></RoundButton>

      <h4>Admins Users</h4>
      <RoundButton
        icon={require('../../assets/imgs/icon_add_friend.png')}
        icon_size={42}
        onClick={() => {}}
      ></RoundButton>

      <h4>Banned users</h4>
      <RoundButton
        icon={require('../../assets/imgs/icon_add_friend.png')}
        icon_size={42}
        onClick={() => {}}
      ></RoundButton>
      <br></br>

      <Button onClick={() => {}}>Save</Button>
    </div>
  );
}
