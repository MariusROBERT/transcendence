import { FormEvent, useEffect, useState } from 'react';
import { Fetch, unsecureFetch } from '../../utils';

/*
    THIS FILE IS ONLY FOR TESTING AND SHOULD BE REMOVE LATER
*/

export var current_chan = "";

export function ChatMenu() {
    const [inputValue, setInputValue] = useState<string>("");
    var current_id = -1;

    async function OnJoinChannel()
    {
        if (inputValue == "")
            return ;
        setInputValue("");
        const path = "channel/name/" + inputValue;
        const res = await unsecureFetch(path, 'GET');
        if (res?.ok)
        {
            console.log("found");
            var data = await res.json();
            console.log(data.id);
            current_id = data.id;
        }
        else
        {
            console.log("not found... Creating channel");
            Fetch('channel', 'POST',
            JSON.stringify({
                channel_name: inputValue, 
                priv_msg: false,
            }));
            current_id = -1;
        }
        current_chan = inputValue;
        const path2 = "channel/msg/" + current_id;
        const res2 = await Fetch(path2, 'GET');
        var len = res2?.json.length;
        var msgs = [];
        for (var i = 0; i < len; i++)
        {
          const mess = res2?.json[i].content;
          msgs.push({ msg: mess, owner: true })
        }
        let event = new CustomEvent('enter_chan', {
            detail: {
                value: msgs,
            },
        })
        dispatchEvent(event);
    }

    return (
        <div>
            <label>
                <input value={inputValue}
                    onChange={(evt) => {setInputValue(evt.target.value);}}
                />
            </label>
            <button onClick={OnJoinChannel}>
                Join chat
            </button>
        </div>
    )
}