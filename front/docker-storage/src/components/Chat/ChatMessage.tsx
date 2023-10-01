import { color } from '../../utils';
import { Background, RoundButton } from '../index';
import { useUserContext } from '../../contexts';

interface Props {
  children: string;
  user_icon: string;
  user_name: string;
  date: Date;
  uid: number;
}

export function ChatMessage({
  children,
  user_icon,
  user_name,
  date,
  uid,
}: Props) {
  const { id } = useUserContext();
  function viewProfile() {
    // TODO: link the profile to the icon btn
    // to do so in the Props, get the User ID
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: uid === id ? 'row' : 'row-reverse',
      }}
    >
      <RoundButton icon={user_icon} onClick={viewProfile}></RoundButton>
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
          bg_color={color.white}
          flex_direction={'column'}
          flex_alignItems={'stretch'}
          flex_justifyContent={true ? 'flex-start' : 'flex-end'}
        >
          <p style={{ margin: '10px', color: color.black, textShadow: 'none' }}>
            {children}
          </p>
        </Background>
        <p
          style={{
            margin: '10px',
            color: color.black,
            textShadow: 'none',
            fontSize: '12px',
          }}
        >
          {date.toUTCString()}
        </p>
      </div>
    </div>
  );
}
