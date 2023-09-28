import { ReactNode, useEffect, useState } from "react";
import { Viewport } from "../../utils/Viewport";
import { color } from "../../utils/Global";
import { Background, RoundButton } from "..";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { ChatMenu } from "../ChanMenu/ChatMenu";
import {Contexts, useUserContext} from "../../contexts";
import { Fetch, unsecureFetch } from '../../utils';
import { ChanUserList } from "../ChanUserList/ChanUserList";
import { subscribe, unsubscribe } from '../../utils/event';
import { publish } from '../../utils/event';
import { GetCurrChan } from "../../utils/channel_functions";

interface Props {
  viewport: Viewport;
  width: number;
}

export function ChatPanel({ viewport, width }: Props) {
  const [inputValue, setInputValue] = useState<string>("");
  const { socket, id } = useUserContext();

  // this should be in the back
  let [msg, setMessage] = useState<any[]>([]);

  const getMsg = async (message: any) => {
    console.log(message);
    console.log("here");
    const res2 = await Fetch("channel/msg/" + message.id, 'GET');

    var len = res2?.json.length;
    var msgs = res2?.json;
    console.log(res2?.json);
    publish('enter_chan', {
            detail: {
                value: msgs,
            }
    });
    setInputValue("");
  };

  useEffect(() => {
    socket?.on("message", getMsg);
    return () => {
      socket?.off("message", getMsg);
    };
  }, [getMsg]);

  useEffect(() => {
    subscribe('enter_chan', async (event: any) => {
      //  TODO: add check for owner
      setMessage(event.detail.value);
    });
    return () => {
      unsubscribe("enter_chan", null);
    }
  })

  async function onEnterPressed() {
    if (inputValue.length <= 0) return;
    const chan = await GetCurrChan();
    console.log("send message to " +chan);
    socket?.emit("message", { message: inputValue, channel: chan });
  }

  function chat() {
    return (
      <>
        {msg.map((data, idx) => (
          <ChatMessage
            key={idx}
            user_icon={data.sender_urlImg}
            user_name={data.sender_username}
            date={new Date()}
            uid={data.sender_id}
          >
            {data.message_content}
          </ChatMessage>
        ))}
      </>
    );
  }


return (
  <Background flex_justifyContent={'space-evenly'}>
    <ChatMenu></ChatMenu>
    <ChanUserList></ChanUserList>
      <div style={{
        height: viewport.height - 125 + 'px',
        width: width - 50 + 'px',
        backgroundColor: color.grey,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px 5px',
        padding: '10px',
        borderRadius: '15px',
        overflow: 'scroll',
      }}>
        {chat()}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width - 30 + 'px',
      }}>
        <input value={inputValue}
               onChange={(evt) => {
                 setInputValue(evt.target.value);
               }}
               onKeyDown={(e) => {
                 if (e.keyCode !== 13) return;
                 onEnterPressed();
               }}
               style={{
                 height: 50 + 'px',
                 flex: 'auto',
                 backgroundColor: color.grey,
                 borderRadius: '15px',
                 border: '0',
               }}
        >
        </input>
        <RoundButton icon_size={50} icon={require('../../assets/imgs/icon_play.png')}
                     onClick={onEnterPressed}></RoundButton>
      </div>
    </Background>
  );
}
