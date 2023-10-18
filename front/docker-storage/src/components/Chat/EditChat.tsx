import { useEffect, useState } from 'react';
import { Button } from '../ComponentBase/Button';
import { ChannelPublic } from '../../utils/interfaces';
import { createChatStyle, inputStyle } from './CreateChat';
import SwitchToggle from '../ComponentBase/SwitchToggle';
import { Flex } from '../ComponentBase/FlexBox';
import { Fetch } from '../../utils';
import { ErrorPanel } from '../Error/ErrorPanel';
import { channel } from 'diagnostics_channel';
import { Popup } from '../index';

interface Props {
  data: ChannelPublic | undefined;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export default function EditChat({ data, isVisible, setIsVisible }: Props) {
  const [password, setPassword] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errVisible, setErrVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible) {
      if (data?.channel_status === 'private') setChecked(true);
      else setChecked(false);
    } else {
      setPassword('');
      setErrVisible(false);
    }
  }, [isVisible, data?.channel_status]);

  async function OnSave() {
    if (password.length > 300) {
      setErrVisible(true);
      setError('Password is too long');
      return;
    }
    console.log(data);
    await Fetch(
      'channel/edit/' + data?.channel_id,
      'PATCH',
      JSON.stringify({
        password: password,
        chan_status: checked ? 'private' : 'public',
      }),
    );
    setIsVisible(false);
  }

  return (
    <Popup isVisible={isVisible} setIsVisible={setIsVisible}>
      <div style={createChatStyle}>
      <div style={{ visibility: errVisible ? 'inherit' : 'hidden' }}>
        <ErrorPanel text={error}></ErrorPanel>
      </div>
      <h2>Edit Channel</h2>

      <p style={{ textAlign: 'center', fontSize: '14px' }}>
        <input
          placeholder='New password'
          style={inputStyle}
          value={password}
          maxLength={300}
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
    </Popup>
  );
}
