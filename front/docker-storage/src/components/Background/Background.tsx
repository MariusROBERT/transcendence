import "../../app/App.css"
import { color } from '../../Global'
import {ReactNode} from "react";

interface Props {
    children?: ReactNode;
    image?: any;
    bg_color?: string;

    flex_direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    flex_wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    flex_justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    flex_alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    flex_gap?: string;

    padding?: string;
    margin?: string;

    fixed?: boolean;
}

function Background({   children,
                        image,
                        bg_color = color.black,
                        flex_direction='column',
                        flex_wrap='nowrap',
                        flex_justifyContent='center',
                        flex_alignItems='center',
                        flex_gap='5px 5px',
                        padding='0',
                        margin='0',
                        fixed=false,
                                                        }: Props)
{
    const style = {
        backgroundImage: 'url(' + image + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundColor: bg_color,
        margin: margin,
        padding: padding,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: flex_direction,
        flexWrap: flex_wrap,
        justifyContent: flex_justifyContent,
        alignItems: flex_alignItems,
        gap: flex_gap,
        overflow: 'hidden',
        backgroundAttachment: fixed ? 'fixed' : 'scroll'
    }

    return (
        <div style={style}>
            {children}
        </div>
    );
}

export default Background;
