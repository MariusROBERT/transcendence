import { CSSProperties } from 'react';
import { Flex } from '../ComponentBase/FlexBox';
import { RoundButton } from '../ComponentBase/RoundButton';
import { ChannelPublicPass } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import {
  SetCurrChan,
  UpdateChannelMessage,
  UpdateChannelUsers,
} from '../../utils/channel_functions';
import { useUserContext } from '../../contexts';
import { publish } from '../../utils/event';

interface Props {
  data: ChannelPublicPass;
  visible: boolean;
  setVisible: (b: boolean) => void;
  setCurrent: (c: ChannelPublicPass) => void;
}

export default function ChannelElement({
  data,
  setVisible,
  setCurrent,
}: Props) {
  const { socket } = useUserContext();

  async function AddUserInChannel() {
    const res = await Fetch('channel/add_user/' + data.id, 'POST');
    if (res?.json?.statusCode === 400) return 400;
    UpdateChannelMessage(data.id);
    UpdateChannelUsers(data.id);
    SetCurrChan(data.channel_name);
    publish('open_chat', undefined);
    return 0;
  }

  async function joinChannel() {
    setCurrent(data);
    const rep = await AddUserInChannel();
    if (rep === 400) {
      setVisible(true);
      return;
    }
    socket?.emit('join', { channel: data.channel_name });
  }

  const mobile = window.innerWidth < 500;

  const ChannelElementStyle: CSSProperties = {
    //width: mobile ? 320 : 520,
    border: '1px solid white',
    display: 'flex',
    background: '#646464',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '10px',
    justifyContent: 'space-between',
    width: '100%',
  };

  const ChannelBannerContainer = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={ChannelElementStyle}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginRight: '10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <p style={{ margin: '0 10px' }}> Channel </p>
          <p style={{ margin: '0 10px' }}>{data.channel_name}</p>
        </div>
        <RoundButton
          icon={require(
            data.has_password
              ? '../../assets/imgs/icon_lock.png'
              : '../../assets/imgs/icon_chat.png',
          )}
          onClick={joinChannel}
        />
      </div>
      <div style={{ right: '0', overflow: 'hidden' }}></div>
    </div>
  );
}
