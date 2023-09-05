import { hover } from "@testing-library/user-event/dist/hover";
import { color } from "../../Global";
import Background from "../Background/Background";
import { Border } from "../Border/Border";
import { RoundButton } from "../RoundButton/RoundButton";
import { Flex } from "../Flex/FlexBox";

// TODO : Add Object User insteed of user_name and user icon
interface Props{
    icon_url?:string
    user_name?:string
    is_friend?:boolean
}

export function User({icon_url = require('../../imgs/icon_user.png'), user_name = 'Jean Michel', is_friend=false}:Props)
{
    function openProfile(){
        console.log('open profile from ' + user_name);
    }

    function openChat(){
        console.log('open chat with ' + user_name);
    }

    function sendGameInvite(){
        console.log('invite ' + user_name + ' to play a game');
    }

    function lookGame(){
        console.log('try to look game with ' + user_name);
    }

    function sendFriendInvite(){
        console.log('send friend invite to ' + user_name);
    }

    function openOptionDropdown(){
        console.log('open option dropdown');
    }

    return (
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', borderRadius:'12.5px', backgroundColor:color.grey, minWidth:'410px', height:'25px'}}>
            <Flex zIndex={'10'} flex_direction="row">
                <RoundButton icon={icon_url} icon_size={50} onClick={openProfile}></RoundButton>
                <p>{user_name}</p>
            </Flex>
            <Flex zIndex={'10'} flex_direction="row" flex_justifyContent={'space-evenly'}>
                {is_friend && <RoundButton icon={require('../../imgs/icon_chat.png')} onClick={openChat}></RoundButton>}
                {is_friend && <RoundButton icon={require('../../imgs/icon_play.png')} onClick={sendGameInvite}></RoundButton>}
                {is_friend && <RoundButton icon={require('../../imgs/icon_look_game.png')} onClick={lookGame}></RoundButton>}
                {!is_friend && <RoundButton icon={require('../../imgs/icon_add_friend.png')} onClick={sendFriendInvite}></RoundButton>}
                <RoundButton icon={require('../../imgs/icon_options.png')} onClick={openOptionDropdown}></RoundButton>
            </Flex>
        </div>
    );
}