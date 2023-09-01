import {Border} from "../Border/Border";
import {color} from "../../Global";
import Background from "../Background/Background";
import {Button} from "../Button/Button";
import {Input} from "../Input/Input";
import {Flex} from "../Flex/FlexBox";
import React, {useState} from "react";

export function Login()
{
    let [signIn, setSign] = useState(true)

    return (
        <>
            <Border height={350} borderColor={color.clear}>
                <Background bg_color={color.clear} flex_justifyContent={'flex-start'}>
                    <h1>Welcome to Pong</h1>
                    <p>{signIn ? 'Still not registered?' : 'You have an Account?'}</p>
                    <Button onClick={() => {
                        console.log(signIn ? 'sign up clicked' : 'sign in clicked');
                        setSign(!signIn)
                    }}>{signIn ? 'Sign Up' : 'Sign In'}</Button>
                </Background>
            </Border>
            <Border height={350} width={350} borderColor={color.clear}>
                <Background bg_color={color.clear} flex_alignItems={'stretch'} padding={'10px'}>
                    <Input>login..</Input>
                    <Input>password..</Input>
                    {!signIn && <Input>password confirmation..</Input>}
                    <Flex flex_direction={'row'} flex_justifyContent={"flex-end"}>
                        <Button onClick={() => {
                            console.log(signIn ? 'Connect' : 'Sign Up');
                        }}>{signIn ? 'Connect' : 'Sign Up'}</Button>
                    </Flex>
                    <br/>
                    <Flex flex_direction={'row'} flex_justifyContent={'space-between'}>
                        <p>or sign in with Intra42</p>
                        <Button icon={require('../../imgs/logo_42.png')} onClick={() => console.log('intra 42 clicked')}></Button>
                    </Flex>
                </Background>
            </Border>
        </>
    );
}