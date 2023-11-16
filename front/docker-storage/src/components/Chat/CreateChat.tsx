import React, { useEffect, useState } from 'react';
import { Fetch, color } from '../../utils';
import { publish } from '../../utils/event';
import { Button } from '../ComponentBase/Button';
import { ErrorPanel } from '../Error/ErrorPanel';
import SwitchToggle from '../ComponentBase/SwitchToggle';
import { Flex } from '../ComponentBase/FlexBox';
import {
  UpdateChannelMessage,
  UpdateChannelUsers,
  SetCurrChan,
  UpdateChannels,
} from '../../utils/channel_functions';
import { useUserContext, useUIContext } from '../../contexts';
import {Popup} from '../index';



export default function CreateChat() {
  const [channelName, setChannelName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [errorMessage, seterrorMessage] = useState<string>('Error');
  const mobile = window.innerWidth < 500;
  const { socket } = useUserContext();
  const { isCreateChannelOpen, setIsCreateChannelOpen } = useUIContext();

  async function OnJoinChannel(channelName: string) {
    const chan: {channel_id: number} = (await Fetch(`channel/name/${channelName}`, 'GET'))?.json;
    UpdateChannelMessage(chan.channel_id);
    UpdateChannelUsers(chan.channel_id);
    SetCurrChan(channelName);
    socket?.emit('join', { channel: channelName } as any);
    publish('open_chat', undefined);
  }

  useEffect(() => {
    if (!isCreateChannelOpen) {
      setChannelName('');
      setPassword('');
      setErrorVisible(false);
    }
  }, [isCreateChannelOpen]);

  async function OnButtonClick() {
    if (password != '' && !passwordRegex.test(password)) return;
    if (channelName === '') return;
    const rep = await Fetch(
      'channel',
      'POST',
      JSON.stringify({
        channel_name: channelName,
        priv_msg: false,
        password: password === '' ? undefined : password,
        chan_status: checked ? 'private' : 'public',
      }),
    );
    if (rep?.json.statusCode === 409 || rep?.json.statusCode === 400) {
      seterrorMessage(rep?.json.message);
      setErrorVisible(true);
      return;
    }
    publish('chat_created', undefined);
    UpdateChannels();
    OnJoinChannel(channelName);
    setIsCreateChannelOpen(false);
    setPasswordError('');
  }

  function OnChange() {
    setChecked(!checked);
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const [passwordError, setPasswordError] = useState<string>('');

  return (
    <Popup isVisible={isCreateChannelOpen} onClose={() => setIsCreateChannelOpen(false)}>
      <div style={{ ...createChatStyle, padding: mobile ? 10 : 42 }}>
        <div style={{ visibility: errorVisible ? 'inherit' : 'hidden' }}>
          <ErrorPanel text={errorMessage}></ErrorPanel>
        </div>
        <h2>Create Channel</h2>
        <p>
          <input
            placeholder='Name'
            style={inputStyle}
            value={channelName}
            onChange={(evt) => {
              setChannelName(evt.target.value);
            }}
          ></input>
        </p>
        <p style={{ display: 'flex', flexDirection: 'column'}}>
          <input
            placeholder='Optional password'
            style={inputStyle}
            value={password}
            onChange={(evt) => {
              setPassword(evt.target.value);
              setPasswordError(''); 
            }}
            pattern={passwordRegex.source} 
            onBlur={() => {
              if (!passwordRegex.test(password))
                setPasswordError('Password doit contenir 1 Maj, 1 Min, et 8 char mini');
              else 
                setPasswordError('');
            }}
          ></input>
          <span style={{ color: 'red', fontSize: '12px' }}>{passwordError}</span>
        </p>
        <Flex flex_direction={'row'}>
          <p>Private Channel:</p>
          <SwitchToggle onChange={OnChange} checked={checked}></SwitchToggle>
        </Flex>
        <p>
          <Button onClick={OnButtonClick}>Save</Button>
        </p>
      </div>
    </Popup>
  );
}

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

export const createChatStyle: React.CSSProperties = {
  borderRadius: '10px',
  padding: window.innerWidth < 500 ? 10 : 42,
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: color.blue,
  height: '100%',
  color: 'white',
  margin: '10px',
  cursor: 'pointer',
  minWidth: '300px',
};