import { delay } from "../../utils/UtilityFunctions";
import React, { ReactNode, useState } from "react";
import { Viewport } from "../../utils/Viewport";
import { RoundButton } from "..";

interface Props{
    children:ReactNode;
    viewport:Viewport;
    width:number;
    isLeftPanel:boolean;
    duration_ms?:number;
}

export function SidePanel({children, viewport, width, isLeftPanel, duration_ms = 1000} : Props){

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isHiding, setIsHiding] = useState<boolean>(false)
    const [isShowing, setIsShowing] = useState<boolean>(false)
    const [isAnim, setIsAnim] = useState<boolean>(false)

    const isMoving = isAnim || isHiding || isShowing
    async function Close()
    {
        if (isMoving) return;
        setIsAnim(true);
        await delay(duration_ms / 3);
        setIsHiding(true);
        setIsAnim(false);
        await delay(duration_ms);
        setIsOpen(false);
        setIsHiding(false);
    }

    async function Open()
    {
        if (isMoving) return;
        setIsAnim(true);
        await delay(duration_ms);
        setIsShowing(true);
        setIsAnim(false);
        await delay(duration_ms);
        setIsOpen(true);
        setIsShowing(false);
    }

    function getStyle(): React.CSSProperties
    {
        let style:React.CSSProperties = {
            zIndex:'100',
            width: width + 'px',
            height:'100%',
            position:'absolute',
            left: '0px',
            transition: '0s ease'
        }
        if (isAnim)
        {
            style.width = width + 50 + 'px'
            style.left = (isLeftPanel ? 0 : viewport.width - width - 50) + 'px'
            style.transition = (isOpen ? duration_ms / 3 : duration_ms) + 'ms ease'
        }
        else if (isShowing)
        {
            style.left = (isLeftPanel ? 0 : viewport.width - width) + 'px'
            style.transition = duration_ms / 3 + 'ms ease'
        }
        else if (isHiding)
        {
            style.left = (isLeftPanel ? -width : viewport.width) + 'px'
            style.transition = duration_ms + 'ms ease'
        }
        else if (isOpen)
        {
            style.left = (isLeftPanel ? 0 : viewport.width - width) + 'px'
        }
        else
        {
            style.left = (isLeftPanel ? -width : viewport.width) + 'px'
        }
        return style;
    }

    const buttonStyle:React.CSSProperties = {
        position:'absolute',
        top:'50%', left:(isLeftPanel ? (isAnim ? width + 50 : width) : 0)-30 + 'px',
        rotate:((isLeftPanel && isOpen) || (!isLeftPanel && !isOpen) ? -90 : 90) + 'deg',
        transition: (isAnim ? duration_ms / 3 : duration_ms / 2) + 'ms ease'
    }

    if (!isMoving && !isOpen) {
        return (
            <div style={{position:"absolute", height:'100%', left:getStyle().left}}>
                <div style={buttonStyle}>
                    <RoundButton icon_size={50} icon={require('../../assets/imgs/side_panel_button.png')} onClick={isOpen ? Close : Open}></RoundButton>
                </div>
            </div>
        );
    }

    return (
        <div style={getStyle()}>
            <div style={buttonStyle}>
                <RoundButton icon_size={50} icon={require('../../assets/imgs/side_panel_button.png')} onClick={isOpen ? Close : Open}></RoundButton>
            </div>
            <div style={{overflow:'hidden', display:"flex", height:'100%'}}>
                {children}
            </div>
        </div>
    );
}