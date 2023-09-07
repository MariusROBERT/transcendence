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
            <Border borderColor={color.black}>
                <Background bg_color={color.white}>
                    <p>{children}</p>
                </Background>
            </Border>
        </div>
    );
}