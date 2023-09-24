import { color } from '../../utils';
import { Background, RoundButton } from '..';

interface Props {
  children: string;
  isOwnMessage: boolean;
  user_icon: string;
}

export function ChatMessage({ children, isOwnMessage, user_icon }: Props) {
  function viewProfile() {
    // TODO: link the profile to the icon btn
    // to do so in the Props, get the User ID
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isOwnMessage ? 'row' : 'row-reverse',
      }}
    >
      <RoundButton icon={user_icon} onClick={viewProfile}></RoundButton>
      <div
        style={{
          flex: 'auto',
          width: '100%',
          display: 'flex',
          borderRadius: 10 + 'px',
          overflow: 'hidden',
          border: 'solid ' + color.black + ' ' + 2 + 'px',
        }}
      >
        <Background
          bg_color={color.white}
          flex_direction={'row'}
          flex_alignItems={'stretch'}
          flex_justifyContent={isOwnMessage ? 'flex-start' : 'flex-end'}
        >
          <p style={{ margin: '10px', color: color.black, textShadow: 'none' }}>
            {children}
          </p>
        </Background>
      </div>
    </div>
  );
}
