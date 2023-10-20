import { ChannelInfos, ChannelPublic } from '../../utils/interfaces';
import { Flex, RoundButton } from '..';
import { Fetch, color } from '../../utils';
import {
  UpdateChannelMessage,
  UpdateChannelUsers,
  SetCurrChan,
  current_chan,
} from '../../utils/channel_functions';
import { useUserContext } from '../../contexts';
import EditChat from '../Chat/EditChat';
import { useEffect, useState } from 'react';
import { publish } from '../../utils/event';

export function ChannelBanner({ id, name, type }: ChannelInfos) {
  const { socket } = useUserContext();
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<ChannelPublic | undefined>(undefined);
  const [mobile, setMobile] = useState<boolean>(window.innerWidth < 650);
  useEffect(() => {
    setMobile(window.innerWidth < 650);
  }, [window.innerWidth]);

  async function OnJoinChannel() {
    UpdateChannelMessage(id);
    UpdateChannelUsers(id);
    SetCurrChan(name);
    socket?.emit('join', { channel: name });
    publish('open_chat', undefined);
  }

  async function OnLeave() {
    const res = await Fetch('channel/leave/' + id, 'PATCH');
    publish('fetch_chan', {
      detail: {
        value: res?.json?.channel_name,
      },
    });
    //console.log(res?.json?.channel_name + ' ' + current_chan);
    if (res?.json?.channel_name === current_chan) {
      publish('close_chat', {
        detail: {
          value: null,
        },
      });
    }
  }

  async function OnSetting() {
    const res = await Fetch('channel/public/' + id, 'GET');
    await setPublicData(res?.json);
    setEditVisible(true);
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
        height: '25px',
        width: mobile ? 200 : 400,
      }}
    >
      <Flex
        zIndex={'2'}
        flex_direction='row'
        flex_justifyContent={'flex-start'}
      >
        <RoundButton
          icon_size={50}
          icon={require('../../assets/imgs/icon_chat.png')}
          onClick={OnJoinChannel}
        />
        <p style={{ fontSize: '20px' }}>
          {name.slice(0, 25)}
          {name.length > 25 ? '...' : ''}
        </p>
      </Flex>
      <Flex
        zIndex={'2'}
        flex_direction='row'
        flex_justifyContent={'flex-end'}
      >
        <RoundButton
          icon={require('../../assets/imgs/icon_leave.png')}
          onClick={OnLeave}
        ></RoundButton>
        <RoundButton
          icon={require('../../assets/imgs/icon_options.png')}
          onClick={OnSetting}
        />
      </Flex>
      <EditChat data={publicData} isVisible={editVisible} setIsVisible={setEditVisible} />
    </div>
  );
}