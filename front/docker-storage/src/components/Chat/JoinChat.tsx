import { useState } from 'react';
import { ChannelPublicPass } from '../../utils/interfaces';
import ChannelElement from './ChannelElement';
import ChatInput from './ChatInput';
import { createChatStyle } from './CreateChat';
import { Button } from '../ComponentBase/Button';
import Popup from '../ComponentBase/Popup';
import EnterPassword from './EnterPassword';
import { useUIContext } from '../../contexts';


export default function JoinChat() {
  const { isChatMenuOpen, setIsChatMenuOpen, channels, setIsCreateChannelOpen } = useUIContext();
  const [input, setInput] = useState<string>('');

  const [channelStatus, SetChannelStatus] = useState<
    'all' | 'public' | 'protected'
  >('all');
  const [enterPassword, setEnterPassword] = useState<boolean>(false);
  const [currentChannel, setCurrentChannel] = useState<
    ChannelPublicPass | undefined
  >(undefined);

  const filteredChannels = channels
    ? channels.filter((channel) => {
      const name = channel?.channel_name
        .toLowerCase()
        .startsWith(input.toLowerCase());

      const status =
        channelStatus === 'all' || (channelStatus === 'public' && !channel.has_password) || (channelStatus === 'protected' && channel.has_password);
      return name && status;
    })
    : [];

  function List() {
    return (
      <div style={{ height: '400px', overflow: 'scroll', width: '100%', padding: '5px' }}>
        {filteredChannels.length === 0 ? (
          <p style={{ textAlign: 'center' }}>
            Found nothing...
            <br />
            But you can create your own channel :D
          </p>
        ) : (
          filteredChannels?.map((data, idx) => (
            <ChannelElement
              key={idx}
              data={data}
              visible={enterPassword}
              setVisible={setEnterPassword}
              setCurrent={setCurrentChannel}
            />
          ))
        )}
      </div>
    );
  }

  if (!isChatMenuOpen) return (<></>);

  return (
    <Popup isVisible={isChatMenuOpen} onClose={() => setIsChatMenuOpen(false)}>
      <div style={createChatStyle}>
        <ChatInput
          input={input}
          setInput={setInput}
          OnClick={() => null}
          OnEnter={() => null}
        />
        <select
          value={channelStatus}
          onChange={(e) =>
            SetChannelStatus(e.target.value as 'all' | 'public' | 'protected')
          }
          style={{ borderRadius: '5px', margin: '10px' }}
        >
          <option value='all'>Tous</option>
          <option value='public'>Public</option>
          <option value='protected'>Protected</option>
        </select>
        {List()}
        <div style={{ margin: '10px' }}>
          <Button
            onClick={() => {
              setInput('');
              setIsCreateChannelOpen(true);
              setIsChatMenuOpen(false);
            }}
          >
            Create Channel
          </Button>
        </div>
        <Popup isVisible={enterPassword} onClose={() => setEnterPassword(false)}>
          <EnterPassword
            visible={enterPassword}
            setVisible={setEnterPassword}
            current={currentChannel}
          />
        </Popup>
      </div>
    </Popup>
  );
}
