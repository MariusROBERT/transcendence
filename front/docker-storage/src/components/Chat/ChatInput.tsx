import { color } from '../../utils';

interface Props {
  input: string;
  setInput: (isVisible: string) => void;
  OnEnter: () => void;
  OnClick: () => void;
}

export default function ChatInput({
                                    input,
                                    setInput,
                                    OnEnter,
                                    OnClick,
                                  }: Props) {

  const mobile = window.innerWidth < 500;

  return (
    <div
      style={{
        margin: '30px',
        borderRadius: '10px',
        backgroundColor: color.white,
        height: mobile ? 40 : 60,
        width: mobile ? 250 : 400,
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
      }}
      className={'text cursor_pointer'}
    >
      <img
        style={{
          height: mobile ? 50 : 80,
          width: mobile ? 50 : 80,
          position: 'relative',
          top: mobile ? -5 : -10,
          left: mobile ? -5 : -15,
        }}
        src={require('../../assets/imgs/icon_search.png')}
        alt={'search'}
      />
      <input
        style={{
          outline: 'none',
          borderRadius: '10px',
          border: '0',
          position: 'relative',
          width: mobile ? 180 : 315,
          backgroundColor: color.white,
        }}
        placeholder='Search Channel'
        value={input}
        onChange={(evt) => {
          setInput(evt.target.value);
        }}
        onKeyDown={(e) => {
          if (e.keyCode !== 13) return;
          OnEnter();
        }}
        onClick={() => {
          OnClick();
        }}
      />
    </div>
  );
}
