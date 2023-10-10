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
  return (
    <div
      style={{
        margin: '30px',
        borderRadius: '10px',
        backgroundColor: color.white,
        height: '60px',
        width: '400px',
      }}
      className={'text cursor_pointer'}
    >
      <img
        style={{
          height: '80px',
          width: '80px',
          position: 'relative',
          top: '-10px',
          left: '-15px',
        }}
        src={require('../../assets/imgs/icon_search.png')}
        alt={'search'}
      />
      <label>
        <input
          style={{
            outline: 'none',
            borderRadius: '10px',
            border: '0',
            position: 'relative',
            left: '0px',
            top: '-45px',
            height: '55px',
            width: '315px',
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
      </label>
    </div>
  );
}
