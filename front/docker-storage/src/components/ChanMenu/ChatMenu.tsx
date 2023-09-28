import { useState } from 'react';
import { Fetch, unsecureFetch } from '../../utils';
import { publish } from '../../utils/event';

//  TODO: Move this
export var current_chan = "";

export function ChatMenu() {
    const [inputValue, setInputValue] = useState<string>("");
    var current_id = -1;

    //  TODO: clean here
    async function OnJoinChannel()
    {
        if (inputValue === "")
            return ;
        setInputValue("");
        const path = "channel/name/" + inputValue;
        const res = await unsecureFetch(path, 'GET');
        if (res?.ok)
        {
            console.log("Channel Found, connecting to channel...");
            var data = await res.json();
            console.log(data.id);
            current_id = data.id;
            //  Adding user to channel if not in it
            await Fetch('channel/add_user/' + data.id , 'POST',
            JSON.stringify({
                id: -1 //current user id
            }));
        }
        else
        {
            console.log("not found... Creating channel");
            const r = await Fetch('channel', 'POST',
            JSON.stringify({
                channel_name: inputValue, 
                priv_msg: false,
            }));
            current_id = r?.json.id;
        }
        current_chan = inputValue;
        const res2 = await Fetch("channel/msg/" + current_id, 'GET');
        const msgs = res2?.json;
        console.log(res2?.json);
        publish('enter_chan', {
                detail: {
                    value: msgs,
                }
        });
        const res3 = await Fetch("channel/users/" + current_id, 'GET');
        const usrs = res3?.json;
        publish('enter_users', {
            detail: {
                value: usrs,
            },
        })
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