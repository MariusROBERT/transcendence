import { Border, Background, GroupItems, SearchBar, User } from "..";
import { color } from "../../utils/Global";
import { Viewport } from "../../utils/Viewport";

interface Props {
    viewport:Viewport,
}

export function ContactPanel({viewport}:Props)
{

    return (
        <>
            <div style={{height:viewport.height - 100 + 'px', width:'100%'}}>
                <Background flex_gap={'1px 0px'}flex_alignItems={'stretch'} flex_justifyContent={'flex-start'}>
                    <GroupItems heading={'Friends'} duration_ms={900}>
                        <User></User>
                        <User is_friend={true}></User>
                        <User></User>
                        <User></User>
                    </GroupItems>
                    <GroupItems heading={'Groups'} duration_ms={900}>
                        <User></User>
                        <User is_friend={true}></User>
                        <User></User>
                        <User></User>
                    </GroupItems>
                    <GroupItems heading={'Last Chat'} duration_ms={900}>
                        <User></User>
                        <User is_friend={true}></User>
                        <User></User>
                        <User></User>
                    </GroupItems>
                    <Border borderSize={0} height={50} borderColor={color.black} borderRadius={0}>
                        <Background bg_color={color.grey} flex_direction={"row"} flex_justifyContent={'flex-end'}>
                            <h2 style={{position:'absolute', left:'5px'}}>Contacts</h2>
                        </Background>
                    </Border>
                </Background>
            </div>
            {/* <SearchBar>Search for friend or group here..</SearchBar> */}
        </>
    );
}
