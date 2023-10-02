import { useEffect, useState } from 'react';
import { Fetch, unsecureFetch } from '../../utils';
import {
  UpdateChannelMessage,
  UpdateChannelUsers,
  SetCurrChan,
} from '../../utils/channel_functions';
import { color } from '../../utils';
import Popup from '../ComponentBase/Popup';
import CreateChat from './CreateChat';
import { subscribe } from '../../utils/event';
import { useUserContext } from '../../contexts';

/*
  //  If channel exist just join it and open right pannel
  //  If channel is private just send an error
  //  If channel protected by password, open ask for password pannel
        //  If right ^ go to first option, if not ^ go to second option
  //  If channel not exist open channel creation
    //  In channel creation you can set name, password, type, and directly add users/admin
*/
export function ChatMenu() {
  const [inputValue, setInputValue] = useState<string>('');
  const [chatVisible, setChatVisible] = useState<boolean>(false);
  const { socket } = useUserContext();
  var current_id = -1;

  async function AddUserInChannel() {
    await Fetch('channel/add_user/' + current_id, 'POST');
    UpdateChannelMessage(current_id);
    UpdateChannelUsers(current_id);
  }

  //  TODO: clean here
  async function OnJoinChannel() {
    if (inputValue === '') return;
    const path = 'channel/name/' + inputValue;
    const res = await unsecureFetch(path, 'GET');
    if (res?.ok) {
      var data = await res?.json();
      current_id = data.id;
      AddUserInChannel();
      SetCurrChan(inputValue);
      socket?.emit('join', { channel: inputValue });
    } else {
      setChatVisible(true);
    }
    setInputValue('');
  }

  useEffect(() => {
    subscribe('chat_created', async () => {
      console.log('here');
      setChatVisible(false);
    });
  });

  //const OnEnterUser = () => {
  //  //console.log(event.detail.value.uid);
  //};

  //useEffect(() => {
  //  subscribe('enter_users', OnEnterUser);
  //});

  return (
    <div
      style={{
        margin: '30px',
        borderRadius: '10px',
        backgroundColor: color.white,
        height: '60px',
        width: '400px',
      }}
      className={'text cursor_pointer'}
    >
      <img
        style={{
          height: '80px',
          width: '80px',
          position: 'relative',
          top: '-10px',
          left: '-15px',
        }}
        src={require('../../assets/imgs/icon_search.png')}
        alt={'search'}
      />
      <label>
        <input
          style={{
            outline: 'none',
            borderRadius: '10px',
            border: '0',
            position: 'relative',
            left: '0px',
            top: '-45px',
            height: '55px',
            width: '315px',
            backgroundColor: color.white,
          }}
          placeholder="Search Channel"
          value={inputValue}
          onChange={(evt) => {
            setInputValue(evt.target.value);
          }}
          onKeyDown={(e) => {
            if (e.keyCode !== 13) return;
            OnJoinChannel();
          }}
        />
      </label>
      <Popup isVisible={chatVisible} setIsVisible={setChatVisible}>
        <CreateChat name={inputValue} visible={chatVisible}></CreateChat>
      </Popup>
    </div>
  );
}
