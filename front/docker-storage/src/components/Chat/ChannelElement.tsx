import { CSSProperties } from 'react';
import { Flex } from '../ComponentBase/FlexBox';
import { RoundButton } from '../ComponentBase/RoundButton';
import { ChannelPublicPass } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { UpdateChannelMessage, UpdateChannelUsers } from '../../utils/channel_functions';
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
    width: mobile ? 320 : 520,
    border: '1px solid white',
    //flexWrap: 'wrap',
    display: 'flex',
    margin: 10,
    //alignContent: 'center',
    background: '#646464',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '10px',
  };

  const ChannelBannerContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  };

  return (
    <div style={ChannelElementStyle}>
      <div style={ChannelBannerContainer}>
        <Flex flex_direction={'row'}>
          <RoundButton
            icon={require('../../assets/imgs/icon_user.png')}
            icon_size={50}
            onClick={() => void 0}
          />
          <p> {data.channel_name} </p>
        </Flex>
        <div style={{ overflow: 'hidden', paddingRight: mobile ? 10 : 20 }}>
          <Flex
            zIndex={'10'}
            flex_direction={'row'}
            flex_justifyContent={'space-evenly'}
          >
            <RoundButton
              icon={require(
                data.has_password
                  ? '../../assets/imgs/icon_lock.png'
                  : '../../assets/imgs/icon_chat.png',
              )}
              onClick={joinChannel}
            />
            <p>42</p>
          </Flex>
        </div>
      </div>
    </div>
  );
}
