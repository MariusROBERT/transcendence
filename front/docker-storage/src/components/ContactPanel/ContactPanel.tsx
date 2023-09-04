import { ReactNode } from "react";
import { Border } from "../Border/Border";
import Background from "../Background/Background";
import { color } from "../../Global";
import { GroupItems } from "../GroupItems/GroupItems";
import { Viewport } from "../../app/Viewport";
import { SearchBar } from "../SearchBar/SearchBar";


interface Props {
    viewport:Viewport,
}

export function ContactPanel({viewport}:Props)
{

    return (
        <>
            <div style={{height:viewport.height - 100 + 'px', width:'100%'}}>
                <Background flex_alignItems={'stretch'} flex_justifyContent={'flex-start'}>
                    <GroupItems heading={'Friends'} duration_ms={900}>
                        <p>contact 1</p>
                        <p>contact 1</p>
                        <p>contact 1</p>
                        <p>contact 1</p>
                    </GroupItems>
                    <GroupItems heading={'Groups'} duration_ms={900}>
                        <p>contact 1</p>
                        <p>contact 1</p>
                        <p>contact 1</p>
                        <p>contact 1</p>
                    </GroupItems>
                    <GroupItems heading={'Last Chat'} duration_ms={900}>
                        <p>contact 1</p>
                        <p>contact 1</p>
                        <p>contact 1</p>
                        <p>contact 1</p>
                    </GroupItems>
                </Background>
            </div>
            <SearchBar>Search for friend or group here..</SearchBar>
        </>
    );
}
