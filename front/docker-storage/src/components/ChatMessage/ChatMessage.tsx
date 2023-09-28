import { color } from '../../utils';
import { Background, RoundButton } from '..';

interface Props {
  children: string;
  user_icon: string;
  user_name: string;
  date: Date;

}

export function ChatMessage({ children, user_icon, user_name, date }: Props) {
  function viewProfile() {
    // TODO: link the profile to the icon btn
    // to do so in the Props, get the User ID
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: true ? "row" : "row-reverse",
      }}
    >
      <div>{user_name}</div>
      <RoundButton icon={user_icon} onClick={viewProfile}/>
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
          flex_direction={"row"}
          flex_alignItems={"stretch"}
          flex_justifyContent={true ? "flex-start" : "flex-end"}
        >
          <p style={{ margin: '10px', color: color.black, textShadow: 'none' }}>
            {children}
          </p>
        </Background>
      </div>
    </div>
  );
}
