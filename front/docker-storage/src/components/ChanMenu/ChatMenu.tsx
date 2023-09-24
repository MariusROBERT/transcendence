import { useState } from 'react';
import { Fetch, unsecureFetch } from '../../utils';

/*
    THIS FILE IS ONLY FOR TESTING AND SHOULD BE REMOVE LATER
*/

export var current_chan = '';

export function ChatMenu() {
  const [inputValue, setInputValue] = useState<string>('');

  async function OnJoinChannel() {
    if (inputValue == '')
      return;
    // console.log("You are joining " + inputValue);
    setInputValue('');
    //request create channel
    //check if chan exist

    const path = 'channel/name/' + inputValue;
    const res = await unsecureFetch(path, 'GET');
    //const res = await unsecureFetch('channel', 'GET', JSON.stringify({channel_name: "a"}));
    if (res?.ok) {
      console.log('found');
    } else {
      console.log('not found... Creating channel');
      Fetch('channel', 'POST',
        JSON.stringify({
          channel_name: inputValue,
          priv_msg: false,
        }));
    }
    current_chan = inputValue;
  }

  return (
    <div>
      <label>
        <input value={inputValue}
               onChange={(evt) => {
                 setInputValue(evt.target.value);
               }}
        />
      </label>
      <button onClick={OnJoinChannel}>
        Join chat
      </button>
    </div>
  );
}