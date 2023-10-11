import { useEffect, useState } from 'react';
import { RoundButton } from '../ComponentBase/RoundButton';
import { Button } from '../ComponentBase/Button';
import { ChannelPublic } from '../../utils/interfaces';
import { createChatStyle, inputStyle } from './CreateChat';
import SwitchToggle from '../ComponentBase/SwitchToggle';
import { Flex } from '../ComponentBase/FlexBox';
import { Fetch } from '../../utils';
import { ErrorPanel } from '../Error/ErrorPanel';

interface Props {
  data: ChannelPublic | undefined;
  visibility: boolean;
  setVisible: (b: boolean) => void;
}

export default function EditChat({ data, visibility, setVisible }: Props) {
  const [password, setPassword] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errVisible, setErrVisible] = useState<boolean>(false);

  useEffect(() => {
    if (visibility === true) {
      if (data?.channel_status === 'private') setChecked(true);
      else setChecked(false);
    } else {
      setPassword('');
      setErrVisible(false);
    }
  }, [visibility]);

  async function OnSave() {
    if (password.length > 300) {
      setErrVisible(true);
      setError('Password is too long');
      return;
    }
    const res = await Fetch(
      'channel/edit/' + data?.channel_id,
      'PATCH',
      JSON.stringify({
        password: password,
        chan_status: checked ? 'private' : 'public',
      }),
    );
    setVisible(false);
  }

  return (
    <div style={createChatStyle}>
      <div style={{ visibility: errVisible ? 'inherit' : 'hidden' }}>
        <ErrorPanel text={error}></ErrorPanel>
      </div>
      <h2>Edit Channel</h2>

      <p style={{ textAlign: 'center', fontSize: '14px' }}>
        <input
          placeholder="New password"
          style={inputStyle}
          value={password}
          maxLength={5}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        ></input>
        <br />
        leave empty to remove password
      </p>

      <Flex flex_direction={'row'}>
        <p>Private Channel:</p>
        <SwitchToggle
          onChange={() => {
            setChecked(!checked);
          }}
          checked={checked}
        ></SwitchToggle>
      </Flex>

      <Button onClick={OnSave}>Save</Button>
    </div>
  );
}
