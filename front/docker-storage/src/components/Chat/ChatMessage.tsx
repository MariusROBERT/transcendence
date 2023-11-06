import { color } from '../../utils';
import { Background, RoundButton } from '..';
import { useUserContext } from '../../contexts';
import { ChannelMessage } from '../../utils/interfaces';
import { useState } from 'react';

interface Props {
  children: string;
  data: ChannelMessage;
  last: number | undefined;
  onClick: () => void;
}

export function ChatMessage({ children, data, last, onClick }: Props) {
  const { id } = useUserContext();
  const [isMe] = useState<boolean>(data.sender_id === id);

  return (
    <div style={{
      paddingRight: isMe ? 5 : 20,
      paddingLeft: isMe ? 20 : 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMe ? 'flex-end' : 'flex-start',
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
            onClick={() => onClick()}
          />
          <p style={{ fontSize: '15px' }}> {data.sender_pseudo} </p>
        </div>
      }
      <div
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
          display: 'flex',
          alignItems: isMe ? 'flex-start' : 'flex-end',
          borderRadius: '20px',
          overflow: 'hidden',
          marginTop: '5px',
          width: 'fit-content',
          maxWidth: '100%',
        }}
      >
        <Background
          bg_color={isMe ? color.green : color.white2}
          flex_direction={'column'}
          flex_alignItems={'stretch'}
          flex_justifyContent={isMe ? 'flex-start' : 'flex-end'}
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
