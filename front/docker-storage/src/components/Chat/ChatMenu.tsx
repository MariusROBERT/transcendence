import { useEffect } from 'react';
import { Fetch } from '../../utils';
import ChatInput from './ChatInput';
import { subscribe, unsubscribe } from '../../utils/event';
import { useUIContext } from '../../contexts/UIContext/UIContext';

/*
  //  If channel exist just join it and open right pannel
  //  If channel is private just send an error
  //  If channel protected by password, open ask for password pannel
        //  If right ^ go to first option, if not ^ go to second option
  //  If channel not exist open channel creation
    //  In channel creation you can set name, password, type, and directly add users/admin
*/
export function ChatMenu() {
  const { inputValueChatMenu, setInputValueChatMenu, setIsChatMenuOpen, channels, setChannels } = useUIContext();

  //  TODO: clean here
  async function OnJoinChannel() {
    const res = await Fetch('channel/public_all', 'GET');
    setChannels(res?.json);
    setIsChatMenuOpen(true);
  }

  //useEffect(() => {
  //  subscribe('update_chan', () => {
  //    //OnJoinChannel();
  //  });
  //  return () => {
  //    unsubscribe('update_chan', () => void 0);
  //  };
  //}, [channels]);

  return (
    <div>
      <ChatInput
        input={inputValueChatMenu}
        setInput={setInputValueChatMenu}
        OnClick={OnJoinChannel}
        OnEnter={() => void 0}
      />
    </div>
  );
}
