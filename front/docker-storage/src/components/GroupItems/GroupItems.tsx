import { ReactNode, useState } from "react";
import { Border } from "../Border/Border";
import Background from "../Background/Background";
import { color } from "../../Global";

interface Props{
    children?:ReactNode,
    heading:string,
    duration_ms:number
}


export function GroupItems({children, heading, duration_ms}: Props)
{
    const [isOpen, setIsOpen] = useState(false);

    let buttonStyle:React.CSSProperties = {
        width:'40px', height:'40px',
        border: 'solid 2px ' + color.grey, borderRadius:'20px',
        rotate:(isOpen ? 0 : 180) + 'deg',
        backgroundImage: 'url(' + require('../../imgs/side_panel_button.png') + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        transition: duration_ms + 'ms ease'
    }

    let groupStyle:React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        marginLeft:'50px',
        overflow:'scroll',
        height: isOpen ? '25%' : '0px',
        gap:'0px',
        transition: duration_ms + 'ms ease'
    }

    return (
        <>
            <Border height={50} borderColor={color.black} borderRadius={0}>
                <Background bg_color={color.grey} flex_direction={"row"} flex_justifyContent={'flex-end'}>
                    <h2 style={{position:'absolute', left:'5px'}}>{heading}</h2>
                    <button style={buttonStyle} onClick={() => setIsOpen(!isOpen)}></button>
                </Background>
            </Border>
            <div style={groupStyle}>
                {children}
            </div>
        </>
    );
}