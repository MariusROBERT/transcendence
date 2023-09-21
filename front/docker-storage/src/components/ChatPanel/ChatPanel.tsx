import { useState } from "react";
import { Viewport, color } from '../../utils';
import { Background, RoundButton, ChatMessage } from "..";

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
        //console.log(inputValue);
        if (inputValue === '')
            return;
        //TODO create Message in the Back and send event to the reciever
        msg.push({msg:inputValue, owner:true});
        setInputValue('');
    }

    function chat() {
        //TODO: get message from the DB and display them here.
        return (
            <>
                {msg.map((txt, idx) => <ChatMessage key={idx} user_icon={require('../../assets/imgs/icon_chat.png')} isOwnMessage={txt.owner}>{txt.msg}</ChatMessage>)}
                {msg.map((txt, idx) => <ChatMessage key={idx} user_icon={require('../../assets/imgs/icon_chat.png')} isOwnMessage={!txt.owner}>{txt.msg}</ChatMessage>)}
            </>
        );
    }

    return (
        <Background flex_justifyContent={'space-evenly'}>
            <div style={{
                height:viewport.height - 125 + 'px',
                width:width - 50 + 'px',
                backgroundColor:color.grey,
                display:'flex',
                flexDirection:'column',
                gap:'5px 5px',
                padding:'10px',
                borderRadius: '15px',
                overflow:'scroll',
            }}>
                {chat()}
            </div>
            <div style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                width:width - 30 + 'px',
            }}>
                <input value={inputValue}
                       onChange={(evt) => {setInputValue(evt.target.value);}}
                       onKeyDown={(e) => { if (e.keyCode !== 13) return; onEnterPressed()}}
                       style={{
                           height:50 + 'px',
                           flex:'auto',
                           backgroundColor:color.grey,
                           borderRadius: '15px',
                           border:'0',
                       }}
                >
                </input>
                <RoundButton icon_size={50} icon={require('../../assets/imgs/icon_play.png')} onClick={onEnterPressed}></RoundButton>
            </div>
        </Background>
    );
}
