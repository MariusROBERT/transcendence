import {color} from "../Global";
import {SidePanel} from "./SidePanel/SidePanel";
import Background from "./Background/Background";
import {Button} from "./Button/Button";
import React from "react";

export function MainPage()
{
    return (
        <>
            <Background bg_color={color.clear} flex_direction={'row'} flex_justifyContent={"space-between"} flex_alignItems={'stretch'}>
                <SidePanel viewport={viewport} width={SIZE} isLeftPanel={true} duration_ms={900}>
                    <Background>
                        <p>contact pannel</p>
                    </Background>
                </SidePanel>
                <Background bg_color={color.clear} flex_justifyContent={'space-around'}>
                    <input/>
                    <Button onClick={() => console.log('play clicked')}>
                        Play
                    </Button>
                    <br/>
                </Background>
                <SidePanel viewport={viewport} width={SIZE} isLeftPanel={false} duration_ms={900}>
                    <Background>
                        <p>chat pannel</p>
                    </Background>
                </SidePanel>
            </Background>
        </>
    );
}