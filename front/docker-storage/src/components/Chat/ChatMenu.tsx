import { useEffect, useState } from 'react';
import { Fetch } from '../../utils';
import Popup from '../ComponentBase/Popup';
import JoinChat from './JoinChat';
import ChatInput from './ChatInput';
import { ChannelPublicPass } from '../../utils/interfaces';
import { subscribe, unsubscribe } from '../../utils/event';

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
  const [joinChatVisible, setJoinChatVisible] = useState<boolean>(false);
  const [channels, setChannels] = useState<ChannelPublicPass[] | undefined>(
    undefined,
  );

  //  TODO: clean here
  async function OnJoinChannel() {
    const res = await Fetch('channel/public_all', 'GET');
    setChannels(res?.json);
    setJoinChatVisible(true);
  }

  useEffect(() => {
    subscribe('update_chan', () => {
      OnJoinChannel()
    });
    return () => {
      unsubscribe('update_chan', () => {});
    };
  }, [channels]);

  return (
    <div>
      <ChatInput
        input={inputValue}
        setInput={setInputValue}
        OnClick={OnJoinChannel}
        OnEnter={() => {}}
      ></ChatInput>
      <Popup isVisible={joinChatVisible} setIsVisible={setJoinChatVisible}>
        <JoinChat
          input={inputValue}
          setInput={setInputValue}
          channels={channels}
        ></JoinChat>
      </Popup>
    </div>
  );
}
