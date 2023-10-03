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
  function OnClick() {
    console.log('click');
  }

  function List() {
    return (
      <div style={{ height: '400px', overflow: 'scroll' }}>
        {channels?.map((data, idx) => (
          <ChannelElement key={idx} name={data.channel_name}></ChannelElement>
        ))}
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
      <div>{List()}</div>
    </div>
  );
}
