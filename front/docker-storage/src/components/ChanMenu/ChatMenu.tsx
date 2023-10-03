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
import JoinChat from './JoinChat';
import ChatInput from './ChatInput';

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
  const [createChatVisible, setCreChatVisible] = useState<boolean>(false);
  const [joinChatVisible, setJoinChatVisible] = useState<boolean>(true);
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
      setCreChatVisible(true);
    }
    setInputValue('');
  }

  useEffect(() => {
    subscribe('chat_created', async () => {
      console.log('here');
      setCreChatVisible(false);
    });
  });

  //const OnEnterUser = () => {
  //  //console.log(event.detail.value.uid);
  //};

  //useEffect(() => {
  //  subscribe('enter_users', OnEnterUser);
  //});

  return (
    <div>
      <ChatInput input={inputValue} setInput={setInputValue} OnClick={OnJoinChannel}></ChatInput>
      <Popup isVisible={createChatVisible} setIsVisible={setCreChatVisible}>
        <CreateChat name={inputValue} visible={createChatVisible}></CreateChat>
      </Popup>
      <Popup isVisible={joinChatVisible} setIsVisible={setJoinChatVisible}>
        <JoinChat input={inputValue} setInput={setInputValue}></JoinChat>
      </Popup>
    </div>
  );
}
