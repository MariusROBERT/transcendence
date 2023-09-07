import { ReactNode, useState } from "react";
import { Border, Background, RoundButton } from "..";
import { color } from "../../utils/Global";

interface Props{
    children?:ReactNode,
    heading:string,
    duration_ms:number
}


export function GroupItems({children, heading, duration_ms}: Props)
{
    const [isOpen, setIsOpen] = useState(false);

    let buttonStyle:React.CSSProperties = {
        rotate:(isOpen ? 0 : 180) + 'deg',
        transition: duration_ms + 'ms ease'
    }

    let groupStyle:React.CSSProperties = {
        paddingTop: isOpen ? '15px' : '0px',
        paddingRight: '5px',
        display: 'flex',
        flexDirection: 'column',
        marginLeft:'50px',
        overflow:'scroll',
        height: isOpen ? '100%' : '0px',
        gap:'30px',
        transition: duration_ms + 'ms ease'
    }

    return (
        <>
            <Border borderSize={0} height={50} borderColor={color.black} borderRadius={0}>
                <Background bg_color={color.grey} flex_direction={"row"} flex_justifyContent={'flex-end'}>
                    <h2 style={{position:'absolute', left:'5px'}}>{heading}</h2>
                    <div style={buttonStyle}><RoundButton icon={require('../../assets/imgs/side_panel_button.png')} icon_size={40} onClick={() => setIsOpen(!isOpen)}></RoundButton></div>
                </Background>
            </Border>
            <div style={groupStyle}>
                {children}
            </div>
        </>
    );
}