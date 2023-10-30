import { useEffect, useRef, useState } from 'react';
import { Viewport, Fetch } from '../../utils';
import { Background, RoundButton, ChatMessage, ChanUserList } from '..';
import { useUserContext } from '../../contexts';
import { subscribe } from '../../utils/event';
import {
  GetCurrChan,
  UpdateChannelUsers,
  current_chan,
} from '../../utils/channel_functions';
import { ChannelMessage, IChatUser } from '../../utils/interfaces';
import ChatUser from './ChatUser';

interface Props {
  viewport: Viewport;
  width: number;
}

interface PublicChannelDto {
  id: number;
  channel_name: string;
  channel_priv_msg: boolean;
}

// TODO refacto all useEffect (Infinite LOOp)
export function ChatPanel({ viewport, width }: Props) {
  const [inputValue, setInputValue] = useState<string>('');
  const [userVisible, setUserVisible] = useState<boolean>(false);
  const [currUser, setCurrUser] = useState<IChatUser>();
  const [id, setId] = useState<number>(-1);
  const { socket } = useUserContext();
  const [msg, setMessage] = useState<ChannelMessage[]>([]);
  const msgsRef = useRef<HTMLDivElement>();
  const [channel, setChannel] = useState<PublicChannelDto>();
  const [printMsgs, setPrintMsgs] = useState<JSX.Element[]>([]);


  //  See if there is a better way to do this
  const getMsg = async (message: ChannelMessage) => {
    if (message.channel_id !== id) return;
    setMessage([...msg, message]);
  };

  useEffect(() => {
    document.getElementById('inpt')?.focus();
  }, [])

  useEffect(() => {

    socket?.on('message', getMsg);
    return () => {
      socket?.off('message', getMsg);
    };
  });

  useEffect(() => {
    const getChan = async () => {
      if (id === -1) return;
      const chan = (await (Fetch(`channel/public/${id}`, 'GET')))?.json
      setChannel(chan);
      // console.log(chan);
    }
    getChan();
  }, [id])

  useEffect(() => {
    socket?.on('join', UpdateChannelUsers);
    return () => {
      socket?.off('join', UpdateChannelUsers);
    };
  }, [socket]);

  useEffect(() => {
    subscribe('enter_chan', async (event: any) => {
      setPrintMsgs([]);
      //console.log(event.detail.value)
      setMessage(event.detail.value);
      //console.log(event.detail.id);
      setId(event.detail.id);
    });
  }, []);

  async function onEnterPressed() {
    if (inputValue.length <= 0 || inputValue.length > 256) return;
    const chan = await GetCurrChan();
    socket?.emit('message', { message: inputValue, channel: chan } as any);
    setInputValue('');
  }

  async function OnUserClick(msgs: ChannelMessage) {
    setCurrUser(msgs);
    setUserVisible(true);
    // TODO show profile here if not admin
  }

  useEffect(() => {
    // Faites défiler automatiquement vers le bas à chaque mise à jour du composant
    if (msgsRef.current && msgsRef.current.scrollTop !== undefined) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  });

  useEffect(() => {
    const el = msg.map((data, idx) => (
      <ChatMessage
        key={idx}
        data={data}
        onClick={OnUserClick}
        last={idx > 0 ? msg[idx - 1].sender_id : undefined}
      >
        {data.message_content}
      </ChatMessage>
    ))
    setPrintMsgs(el);
  }, [msg])

  function inputMessage() {
    if (current_chan != '') {
      return (
        <>

        </>
      );
    }
    return <></>;
  }

  return (
    <Background bg_color={'#00375Cbb'} flex_justifyContent={'space-evenly'}>
      {!channel?.channel_priv_msg && <h3>{channel?.channel_name}</h3>}
      <div style={{ minHeight: '60px', paddingTop: 10 }} />
      <ChanUserList onClick={OnUserClick} chan_id={id} />
      <div
        style={{
          border: '5px solid transparent',
          borderTop: '5px solid rgba(0, 0, 0, 0.2)',
          paddingTop: '5px',
          padding: '10px',
          height: viewport.height - 125 + 'px',
          width: width - 50 + 'px',
          margin: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px 5px',
          overflow: 'scroll',
        }}
        ref={msgsRef as React.RefObject<HTMLDivElement>}
      >
        {printMsgs}
      </div>
      <div
        style={{
          marginTop: '5px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: width - 30 + 'px',
        }}
      >
        <textarea id='inpt'
                  value={inputValue}
                  onChange={(evt) => {
                    setInputValue(evt.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode !== 13) return;
                    onEnterPressed();
                  }}
                  maxLength={256}
                  style={{
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
                    background: 'white',
                    outline: 'none',
                    height: '50px',
                    fontSize: '1.3em',
                    flex: 'auto',
                    borderRadius: '15px',
                    paddingLeft: '15px',
                    paddingTop: '15px',
                    paddingBottom: '10px',
                    marginBottom: '5px',
                    overflowWrap: 'break-word',
                    resize: 'none',
                  }}
        />
        <RoundButton
          icon_size={50}
          icon={require('../../assets/imgs/icon_play.png')}
          onClick={onEnterPressed}
        />
        <ChatUser data={currUser} visibility={userVisible} onClose={() => setUserVisible(false)}></ChatUser>
      </div>
    </Background>
  );
}
