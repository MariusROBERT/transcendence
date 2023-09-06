import "../../app/App.css"

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