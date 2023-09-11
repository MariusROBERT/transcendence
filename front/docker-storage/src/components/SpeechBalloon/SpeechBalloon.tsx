import {color} from "../../utils/Global";
import {Background, Border, RoundButton} from "..";
import background from "../Background/Background";

interface Props{
    children:string,
    isOwnMessage:boolean,
    user_icon:string,
}

export function SpeechBalloon({children, isOwnMessage, user_icon}:Props){

    return (
        <div style={{display:'flex', flexDirection: isOwnMessage ? 'row' : 'row-reverse'}}>
            <RoundButton icon={user_icon} onClick={() => {}}></RoundButton>
            <div style={{
                    flex: 'auto',
                    width: '100%',
                    display: "flex",
                    borderRadius: 10 + 'px',
                    overflow:'hidden',
                    border:'solid ' + color.black + ' ' + 2 + 'px'
            }}>
                <Background bg_color={color.white}>
                    <p>{children}</p>
                </Background>
            </div>
        </div>
    );
}