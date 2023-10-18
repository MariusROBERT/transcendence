import { useState } from 'react';
import { RoundButton } from '../ComponentBase/RoundButton';
import { Button } from '../ComponentBase/Button';
import { ChannelPublic } from '../../utils/interfaces';
import { createChatStyle, inputStyle } from './CreateChat';
import { Popup } from '../index';

interface Props {
  data: ChannelPublic | undefined;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export default function EditChat({ isVisible, setIsVisible }: Props) {
  const [password, setPassword] = useState<string>('');

  return (
    <Popup isVisible={isVisible} setIsVisible={setIsVisible}>
      <div style={createChatStyle}>
        <h2>Edit Channel</h2>

        <p style={{ textAlign: 'center', fontSize: '14px' }}>
          <input
            placeholder='New password'
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
          <input type='radio' value='Public' name='type' /> Public
          <input type='radio' value='Private' name='type' /> Private
        </div>
        <h4>User List</h4>
        <RoundButton
          icon={require('../../assets/imgs/icon_add_friend.png')}
          icon_size={42}
          onClick={() => void 0}
        />
        <h4>Admins Users</h4>
        <RoundButton
          icon={require('../../assets/imgs/icon_add_friend.png')}
          icon_size={42}
          onClick={() => void 0}
        />
        <h4>Banned users</h4>
        <RoundButton
          icon={require('../../assets/imgs/icon_add_friend.png')}
          icon_size={42}
          onClick={() => void 0}
        />
        <br />
        <Button onClick={() => void 0}>Save</Button>
      </div>
    </Popup>
  );
}
