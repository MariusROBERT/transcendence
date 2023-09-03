import {delay} from "../../UtilityFunctions";
import React, {ReactNode, useState} from "react";
import {color} from "../../Global";
import {Viewport} from "../../app/Viewport";

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
        setIsAnim(false);
        setIsHiding(true);
        await delay(duration_ms);
        setIsOpen(false);
        setIsHiding(false);
    }
    async function Open()
    {
        if (isMoving) return;
        setIsShowing(true);
        await delay(duration_ms);
        setIsOpen(true);
        setIsShowing(false);
    }

    function getStyle(): React.CSSProperties
    {
        let style:React.CSSProperties = {
            width: width + 'px',
            height:'100%',
            position:'absolute',
            left: '0px',
            transition: '0s'
        }
        if (isAnim)
        {
            style.width = width + 50 + 'px'
            style.left = (isLeftPanel ? 0 : viewport.width - width - 50) + 'px'
            style.transition = duration_ms / 3 + 'ms'
        }
        else if (isShowing)
        {
            style.left = (isLeftPanel ? 0 : viewport.width - width) + 'px'
            style.transition = duration_ms + 'ms'
        }
        else if (isHiding)
        {
            style.left = (isLeftPanel ? -width : viewport.width) + 'px'
            style.transition = duration_ms + 'ms'
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
        width:'30px', height:'30px',
        border: 'solid 2px ' + color.grey, borderRadius:'15px',
        position:'absolute',
        top:'50%', left:(isLeftPanel ? (isAnim ? width - 15 + 50 : width - 15) : -15) + 'px',
        rotate:((isLeftPanel && isOpen) || (!isLeftPanel && !isOpen) ? -90 : 90) + 'deg',
        backgroundImage: 'url(' + require('../../imgs/side_panel_button.png') + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        transition: (isAnim ? duration_ms / 3 : duration_ms / 2) + 'ms'
    }

    if (!isMoving && !isOpen) {
        return (
            <div style={{position:"absolute", height:'100%', left:getStyle().left}}>
                <button style={buttonStyle} onClick={isOpen ? Close : Open}></button>
            </div>
        );
    }
    return (
        <div style={getStyle()}>
            <button style={buttonStyle} onClick={isOpen ? Close : Open}></button>
            <div style={{overflow:'hidden', display:"flex", height:'100%'}}>
                {children}
            </div>
        </div>
    );
}