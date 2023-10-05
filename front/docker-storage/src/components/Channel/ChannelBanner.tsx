import { ChannelInfos, ChannelPublic } from '../../utils/interfaces';
import { Flex, RoundButton } from '..';
import { Fetch, color } from '../../utils';
import {
  UpdateChannelMessage,
  UpdateChannelUsers,
  SetCurrChan,
} from '../../utils/channel_functions';
import { useUserContext } from '../../contexts';
import Popup from '../ComponentBase/Popup';
import EditChat from '../Chat/EditChat';
import { useState } from 'react';
import { publish } from '../../utils/event';

export function ChannelPannel({ id, name, type }: ChannelInfos) {
  const { socket } = useUserContext();
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<ChannelPublic | undefined>(undefined)

  async function OnJoinChannel() {
    UpdateChannelMessage(id);
    UpdateChannelUsers(id);
    SetCurrChan(name);
    socket?.emit('join', { channel: name });
    publish('open_chat', undefined);
  }

  async function OnSetting() {
    setEditVisible(true);
    const res = await Fetch('channel/public/' + id, 'GET');
    setPublicData(res?.json);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: '12.5px',
        backgroundColor:
          type === 'owner'
            ? color.green
            : type === 'admin'
            ? color.red
            : color.grey,
        minWidth: '410px',
        height: '25px',
      }}
    >
      <Flex
        zIndex={'10'}
        flex_direction='row'
        flex_justifyContent={'space-evenly'}
      >
        <RoundButton
          icon={require('../../assets/imgs/icon_chat.png')}
          onClick={OnJoinChannel}
        ></RoundButton>
        <RoundButton
          icon={require('../../assets/imgs/icon_leave.png')}
          onClick={() => console.log('leave')}
        ></RoundButton>
        <RoundButton
          icon={require('../../assets/imgs/icon_options.png')}
          onClick={() => {OnSetting()}}
        ></RoundButton>
        <p style={{ fontSize: '20px' }}>
          {name.slice(0, 25)}
          {name.length > 25 ? '...' : ''}
        </p>
      </Flex>
    <Popup isVisible={editVisible} setIsVisible={setEditVisible}>
      <EditChat data={publicData}></EditChat>
    </Popup>
    </div>
  );
}