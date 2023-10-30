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
            flexDirection: isMe ? 'row' : 'row-reverse',
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
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
          flex: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          marginTop: '5px',
        }}
      >
        <Background
          bg_color={isMe ? '#CCFF00' : color.white2}
          flex_direction={'column'}
          flex_alignItems={'stretch'}
          flex_justifyContent={'flex-start'}
        >
          <p style={{
            padding: '4px',
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
