import { color } from "../../utils";
import { RoundButton, Flex } from "..";
import { UserButton } from "./UserButton";
import { openProfile } from "../../utils/user_functions";

// TODO : Add Object User insteed of user_name and user icon
interface Props{
    icon_url?:string
    user_name?:string
    is_friend?:boolean
    id?: number
}

export function User({id, icon_url = require('../../assets/imgs/icon_user.png'), user_name = 'Jean Michel', is_friend=false}:Props)
{


    return (
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', borderRadius:'12.5px', backgroundColor:color.grey, minWidth:'410px', height:'25px'}}>
            <Flex zIndex={'10'} flex_direction="row">
                <RoundButton icon={icon_url} icon_size={50} onClick={() => openProfile()}></RoundButton>
                <p>{user_name}</p>
            </Flex>
            <UserButton id={id} icon_url={icon_url} user_name={user_name} is_friend={is_friend} />
        </div>
    );
}