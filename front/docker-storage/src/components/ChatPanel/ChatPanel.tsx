import { ReactNode, useState } from "react";
import { Viewport } from "../../utils/Viewport";
import { color } from "../../utils/Global";
import { Background } from "..";
import {SpeechBalloon} from "../SpeechBalloon/SpeechBalloon";

interface Props{
    viewport:Viewport,
    width:number
}

export function ChatPanel({viewport, width}:Props)
{
    const [inputValue, setInputValue] = useState<string>('');

    // this should be in the back
    let [msg] = useState<{ msg:string, owner:boolean }[]>([]);

    function onEnterPressed(){
        console.log(inputValue);
        //TODO create Message in the Back and send event to the reciever
        msg.push({msg:inputValue, owner:true});
        setInputValue('');
    }

    function chat() {
        return (
            <>
                {msg.map((txt, idx) => <SpeechBalloon key={idx} user_icon={require('../../assets/imgs/icon_chat.png')} isOwnMessage={txt.owner}>{txt.msg}</SpeechBalloon>)}
                {msg.map((txt, idx) => <SpeechBalloon key={idx} user_icon={require('../../assets/imgs/icon_chat.png')} isOwnMessage={!txt.owner}>{txt.msg}</SpeechBalloon>)}
            </>
        );
    }

    return (
        <Background flex_justifyContent={'space-evenly'}>
            <div style={{height:viewport.height - 275 + 'px', width:width - 50 + 'px', backgroundColor:color.grey, display:'flex', flexDirection:'column', gap:'5px 5px', padding:'10px'}}>
                {chat()}
            </div>
            <input value={inputValue} onChange={(evt) => {setInputValue(evt.target.value);}} onKeyDown={(e) => { if (e.keyCode != 13) return; onEnterPressed()}} style={{height:200 + 'px', width:width - 50 + 'px', backgroundColor:color.grey}}></input>
        </Background>
    );
}
