import { ReactNode } from "react";
import { Border } from "../Border/Border";
import Background from "../Background/Background";
import { color } from "../../Global";
import { GroupItems } from "../GroupItems/GroupItems";
import { Viewport } from "../../app/Viewport";
import { SearchBar } from "../SearchBar/SearchBar";
import { User } from "../User/User";


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
            {/* <div style={{height:15 + 'px'}}></div> */}
            <SearchBar>Search for friend or group here..</SearchBar>
        </>
    );
}
