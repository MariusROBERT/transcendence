import { color } from '../../utils';
import { Background, RoundButton } from '..';
import { useUserContext } from '../../contexts';
import { ChannelMessage } from '../../utils/interfaces';

interface Props {
  children: string;
  data: ChannelMessage;
  last: number | undefined;
  onClick: (name: ChannelMessage) => void;
}

export function ChatMessage({ children, data, last, onClick }: Props) {
  const { id } = useUserContext();

  function User() {
    if (last === data.sender_id) return;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: data.sender_id === id ? 'row' : 'row-reverse',
        }}
      >
        <RoundButton
          icon={data.sender_urlImg}
          onClick={() => onClick(data)}
        ></RoundButton>
        <p style={{ fontSize: '15px' }}> {data.sender_username} </p>
      </div>
    );
  }

  return (
    <div>
      {User()}
      <div
        style={{
          flex: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 10 + 'px',
          overflow: 'hidden',
          border: 'solid ' + color.black + ' ' + 2 + 'px',
        }}
      >
        <Background
          bg_color={data.sender_id === id ? color.white2 : color.white}
          flex_direction={'column'}
          flex_alignItems={'stretch'}
          flex_justifyContent={true ? 'flex-start' : 'flex-end'}
        >
          <p style={{ margin: '10px', color: color.black, textShadow: 'none', wordWrap: 'break-word' }}>
            {children}
          </p>
        </Background>
      </div>
    </div>
  );
}
