import { useEffect, useRef, useState } from 'react';
import { Viewport, Fetch, color } from '../../utils';
import { Background, RoundButton, ChatMessage, ChanUserList, SidePanel } from '..';
import { useUserContext } from '../../contexts';
import { subscribe } from '../../utils/event';
import {
  current_chan,
  GetCurrChan,
  UpdateChannelUsers,
} from '../../utils/channel_functions';
import { ChannelMessage, ChannelUsers, IChatUser, PublicChannelDto } from '../../utils/interfaces';
import ChatUser from './ChatUser';
import { useUIContext } from '../../contexts/UIContext/UIContext';

interface Props {
  viewport: Viewport;
  width: number;
}

// TODO refacto all useEffect (Infinite LOOp)
export function ChatPanel({ viewport, width }: Props) {
  const { setIsProfileOpen, isChatOpen, setIsChatOpen, } = useUIContext();
  const [inputValue, setInputValue] = useState<string>('');
  const [currUser, setCurrUser] = useState<IChatUser>();
  const [channelId, setChannelId] = useState<number>(-1);
  const { id, socket } = useUserContext();
  const [msg, setMessage] = useState<ChannelMessage[]>([]);
  const msgsRef = useRef<HTMLDivElement>();
  const [channel, setChannel] = useState<PublicChannelDto>();
  const [printMsgs, setPrintMsgs] = useState<JSX.Element[]>([]);
  const [users, setUsers] = useState<ChannelUsers[]>([]);
  const [muted, setMuted] = useState<boolean>(false);

  const scrollBottom = () => {
    if (msgsRef.current && msgsRef.current.scrollTop !== undefined) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }

  const getMsg = async (message: ChannelMessage) => {
    if (message.channel_name !== current_chan) return;
    setMessage([...msg, message]);
  };

  useEffect(() => {
    subscribe('enter_chan', async (event: any) => {
      setPrintMsgs([]);
      setMessage(event.detail.value);
      setChannelId(event.detail.id);
      setMuted(false);
    });
    if (isChatOpen)
      document.getElementById('inpt')?.focus();
  }, [isChatOpen])

  useEffect(() => {
    socket?.on('message', getMsg);
    return () => {
      socket?.off('message', getMsg);
    };
  }, [socket, msg]);

  useEffect(() => {
    socket?.on('muted', (end) => {
      if (!muted) {
        const d = new Date(end);
        let time = d.getSeconds() - new Date().getSeconds();
        time *= 1000;
        setMuted(true);
        setTimeout(() => {
          setMuted(false);
        }, time);
      }
    });
  }, [socket]);

  useEffect(() => {
    const getChan = async () => {
      if (channelId === -1) return;
      const chan = (await (Fetch(`channel/public/${channelId}`, 'GET')))?.json
      setChannel(chan);
    }
    async function getUsers() {
      if (channelId < 1) return;
      setUsers((await Fetch('channel/users/' + channelId, 'GET'))?.json);
    }

    subscribe('enter_users', async (event: any) => {
      if (event.detail.id !== channelId) return;
      setUsers(event.detail.value);
    });
    getUsers();
    getChan();
  }, [channelId])

  useEffect(() => {
    socket?.on('join', UpdateChannelUsers);
    return () => {
      socket?.off('join', UpdateChannelUsers);
    };
  }, [socket]);

  useEffect(() => {
    function leaveChannel(msg:{sender_id: number, channel_id: number, channel_name: string}){
      if (msg.channel_name !== current_chan) return;
      if (msg.sender_id === id) {
        setIsChatOpen(false);
        setChannelId(-1);
        setChannel(undefined);
      }
      else
        UpdateChannelUsers(msg.channel_id);
    }

    socket?.on('leave', leaveChannel);
    return () => {
      socket?.off('leave', leaveChannel);
    };
  }, [socket, current_chan]);

  async function onEnterPressed() {
    if (muted)
    {
      setInputValue('');
      return ;
    }
    const ipt = inputValue.trim();
    if (ipt.length <= 0 || ipt.length > 256) return;
    const chan = await GetCurrChan();
    socket?.emit('message', { message: ipt, channel: chan } as any);
    setInputValue('');
  }

  async function OnUserClick(msgs: ChannelMessage) {
    setIsProfileOpen(0);
    setCurrUser(undefined);
    setCurrUser(msgs);
  }

  useEffect(() => {
    subscribe('enter_users', async (event: any) => {
      if (event.detail.id !== channelId) return;
      setUsers(event.detail.value);
    });
    async function getUsers() {
      if (channelId < 1) return;
      setUsers((await Fetch('channel/users/' + channelId, 'GET'))?.json);
    }
    getUsers();
  }, [channelId]);

  useEffect(() => {
    const el = msg.map((data, idx) => (
      <ChatMessage
        key={idx}
        onClick={() => OnUserClick(data)}
        last={idx > 0 ? msg[idx - 1].sender_id : undefined}
        data={data}
      >
        {data.message_content}
      </ChatMessage>
    ))
    setPrintMsgs(el);
  }, [msg]);

  useEffect(() => {
    scrollBottom();
  }, [printMsgs]);

  return (
    <SidePanel viewport={viewport} width={width} isLeftPanel={false} duration_ms={900} contextIsOpen={isChatOpen} setContextIsOpen={setIsChatOpen}>
      <Background>
        <Background bg_color={color.blue} flex_justifyContent={'space-evenly'}>
          {!channel?.priv_msg && <h3>{channel?.channel_name}</h3>}
          {channel?.priv_msg && users.length > 1 && <h3>{users[0].id === id ? users[1].pseudo : users[0].pseudo}</h3>}
          <div style={{ minHeight: '60px', paddingTop: 10 }} />
          <ChanUserList onClick={OnUserClick} chan_id={channelId} users={users} />
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
          {muted && <p style={{
            margin: '0px',
            padding: '0px',
            color: 'Red'
          }}> You are muted </p>}
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
              disabled={muted}
              value={inputValue}
              onChange={(evt) => {
                if (evt.target.value === '\n') return;
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
                height: '40px',
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
            {<ChatUser data={currUser} visibility={currUser !== undefined}
              onClose={() => {
                setCurrUser(undefined);
                setIsProfileOpen(0);
              }}></ChatUser>}
          </div>
        </Background>
      </Background>
    </SidePanel>
  );
}
