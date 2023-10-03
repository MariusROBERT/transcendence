import { useState } from 'react';
import { Fetch, unsecureFetch } from '../../utils';
import {
  UpdateChannelMessage,
  UpdateChannelUsers,
  SetCurrChan,
} from '../../utils/channel_functions';

export function ChatMenu() {
  const [inputValue, setInputValue] = useState<string>('');
  var current_id = -1;

  //  TODO: clean here
  async function OnJoinChannel() {
    if (inputValue === '') return;
    setInputValue('');
    const path = 'channel/name/' + inputValue;
    const res = await unsecureFetch(path, 'GET');
    if (res?.ok) {
      var data = await res.json();
      current_id = data.id;
      //  Adding user to channel if not in it
      await Fetch(
        'channel/add_user/' + data.id,
        'POST',
        JSON.stringify({
          id: -1, //current user id
        }),
      );
    } else {
      const r = await Fetch(
        'channel',
        'POST',
        JSON.stringify({
          channel_name: inputValue,
          priv_msg: false,
        }),
      );
      current_id = r?.json.id;
    }
    SetCurrChan(inputValue);
    UpdateChannelMessage(current_id);
    UpdateChannelUsers(current_id);
  }

  return (
    <div>
      <label>
        <input
          value={inputValue}
          onChange={(evt) => {
            setInputValue(evt.target.value);
          }}
        />
      </label>
      <button onClick={OnJoinChannel}>Join chat</button>
    </div>
  );
}
