import { color } from '../../utils';
import { Background, RoundButton } from '..';
import { useUserContext } from '../../contexts';
import { ChannelMessage } from '../../utils/interfaces';
import { useState } from 'react';

interface Props {
  children: string;
  data: ChannelMessage;
  last: number | undefined;
  onClick: (name: ChannelMessage) => void;
}

export function ChatMessage({ children, data, last, onClick }: Props) {
  const { id } = useUserContext();
  const [isMe] = useState<boolean>(data.sender_id === id);
  // const isMe = data.sender_id === id;

  return (
    <div style={{
      paddingRight: isMe ? 5 : 20,
      paddingLeft: isMe ? 20 : 5,
    }}>
      {
        last !== data.sender_id &&
        <div
          style={{
            display: 'flex',
            flexDirection: isMe ? 'row-reverse' : 'row',
          }}
        >
          <RoundButton
            icon={data.sender_urlImg}
            onClick={() => onClick(data)}
          />
          <p style={{ fontSize: '15px' }}> {data.sender_username} </p>
        </div>
      }
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
          bg_color={isMe ? color.white2 : color.white}
          flex_direction={'column'}
          flex_alignItems={'stretch'}
          flex_justifyContent={'flex-start'}
        >
          <p style={{
            margin: '10px',
            color: color.black,
            textShadow: 'none',
            wordWrap: 'break-word',
          }}>
            {children}
          </p>
        </Background>
      </div>
    </div>
  );
}
