import ChannelElement from './ChannelElement';
import ChatInput from './ChatInput';
import { createChatStyle } from './CreateChat';

interface Props {
  input: string;
  setInput: (isVisible: string) => void;
}

export default function JoinChat({ input, setInput }: Props) {
  function OnClick() {
    console.log('click');
  }

  function List() {
    return (
      <div style={{height:'400px', overflow:'scroll'}}>
        <ChannelElement></ChannelElement>
        <ChannelElement></ChannelElement>
        <ChannelElement></ChannelElement>
        <ChannelElement></ChannelElement>
        <ChannelElement></ChannelElement>
        <ChannelElement></ChannelElement>
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
