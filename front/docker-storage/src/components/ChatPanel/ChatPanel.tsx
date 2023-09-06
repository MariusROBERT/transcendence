import { ReactNode, useState } from "react";
import { Viewport } from "../../app/Viewport";
import { color } from "../../Global";
import { Background } from "..";

interface Props{
    viewport:Viewport,
    width:number
}

export function ChatPanel({viewport, width}:Props)
{
    const [inputValue, setInputValue] = useState<string>('');

    // this should be in the back
    let [msg] = useState<string[]>([]);

    function onEnterPressed(){
        console.log(inputValue);
        //TODO create Message in the Back and send event to the reciever
        msg.push(inputValue);
        setInputValue('');
    }

    function chat() {
        return (
            <>
                {msg.map((txt, idx) => <p key={idx}>{txt}</p>)}
            </>
        );
    }

    return (
        <Background flex_justifyContent={'space-evenly'}>
            <div style={{height:viewport.height - 275 + 'px', width:width - 50 + 'px', backgroundColor:color.grey}}>
                {chat()}
            </div>
            <input value={inputValue} onChange={(evt) => {setInputValue(evt.target.value);}} onKeyDown={(e) => { if (e.keyCode != 13) return; onEnterPressed()}} style={{height:200 + 'px', width:width - 50 + 'px', backgroundColor:color.grey}}></input>
        </Background>
    );
}
