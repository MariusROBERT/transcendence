import { ChannelInfos } from "../../utils/interfaces";
import { Flex, RoundButton } from '..';
import { color } from '../../utils';
import { UpdateChannelMessage, UpdateChannelUsers, SetCurrChan } from "../../utils/channel_functions";

export function ChannelPannel({id, name, type} : ChannelInfos) {

    var div_color = color.grey;
    if (type === "admin")
        div_color = color.red;
    if (type === "owner")
        div_color = color.green;

    async function OnJoinChannel() {
        UpdateChannelMessage(id);
        UpdateChannelUsers(id);
        SetCurrChan(name);
    }    

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: '12.5px',
            backgroundColor: div_color,
            minWidth: '410px',
            height: '25px',
          }}>
            <Flex zIndex={'10'} flex_direction='row' flex_justifyContent={'space-evenly'}>
            <RoundButton icon={require('../../assets/imgs/icon_chat.png')} onClick={OnJoinChannel}></RoundButton>
            <RoundButton icon={require('../../assets/imgs/icon_leave.png')} onClick={() => console.log("leave")}></RoundButton>
            <RoundButton icon={require('../../assets/imgs/icon_options.png')} onClick={() => console.log("settings")}></RoundButton>
            <p style={{fontSize:"20px"}}>
                {name.slice(0, 25)}
                {name.length > 25 ? "..." : ""}
            </p>
            </Flex>
        </div>
    )
}

const imgStyle = {
    width: '100px',
    height: '100px',
    border: '1px solid red',
  };
  