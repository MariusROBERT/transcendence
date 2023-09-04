import "../../app/App.css"
import { color } from '../../Global'
import {ReactNode} from "react";

interface Props {
    children?: string,
    minWidth?: number
    minHeight?: number
}

export function Input({children, minWidth = 100, minHeight = 30}: Props)
{
    //TODO: password hiding
    //TODO: accept only alphanum etc.. (for login)
    return (
        <input style={{minWidth:minWidth + 'px', minHeight:minHeight + 'px'}} placeholder={children} className={'text cursor_pointer'}>

        </input>
    );
}