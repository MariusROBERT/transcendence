import { useState } from 'react';
import { ChannelPublicPass } from '../../utils/interfaces';
import ChannelElement from './ChannelElement';
import ChatInput from './ChatInput';
import { createChatStyle } from './CreateChat';

interface Props {
  input: string;
  setInput: (isVisible: string) => void;
  channels: ChannelPublicPass[] | undefined;
}

export default function JoinChat({ input, setInput, channels }: Props) {
  const [channelStatus, SetChannelStatus] = useState<
    'all' | 'public' | 'protected'
  >('all');

  function OnClick() {
    console.log('click');
  }

  const filteredChannels = channels
    ? channels.filter((channel) => {
        const name = channel?.channel_name.startsWith(input);

        const status =
          channelStatus === 'all' ||
          (channelStatus === 'public' && channel.has_password === false) ||
          (channelStatus === 'protected' && channel.has_password === true);
        return name && status;
      })
    : [];

  function List() {
    return (
      <div style={{ height: '400px', overflow: 'scroll' }}>
        {filteredChannels.length === 0 ? (
          <p style={{ textAlign: 'center' }}>
            Found nothing...
            <br />
            But you can create your own channel :D
          </p>
        ) : (
          filteredChannels?.map((data, idx) => (
            <ChannelElement key={idx} data={data}></ChannelElement>
          ))
        )}
      </div>
    );
  }

  return (
    <div style={createChatStyle}>
      <ChatInput
        input={input}
        setInput={setInput}
        OnClick={OnClick}
      ></ChatInput>
      <select
        value={channelStatus}
        onChange={(e) =>
          SetChannelStatus(e.target.value as 'all' | 'public' | 'protected')
        }
        style={{ borderRadius: '5px' }}
      >
        <option value="all">Tous</option>
        <option value="public">Public</option>
        <option value="protected">Protected</option>
      </select>
      <div>{List()}</div>
    </div>
  );
}
