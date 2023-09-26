import { FormEvent, useEffect, useState } from 'react';
import { Fetch, unsecureFetch } from '../../utils';

//  TODO: Move this
export var current_chan = "";

export function ChatMenu() {
    const [inputValue, setInputValue] = useState<string>("");
    var current_id = -1;

    //  TODO: clean here
    async function OnJoinChannel()
    {
        if (inputValue == "")
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


        //  TODO: Clean
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

        const path3 = "channel/users/" + current_id;
        const res3 = await Fetch(path3, 'GET');
        const usrs = res3?.json;
        let event2 = new CustomEvent('enter_users', {
            detail: {
                value: usrs,
            },
        })
        console.log(usrs);
        dispatchEvent(event2);
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