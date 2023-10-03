import { CSSProperties } from 'react';
import { Flex } from '../Flex/FlexBox';
import { RoundButton } from '../RoundButton/RoundButton';
import { ChannelPublicPass } from '../../utils/interfaces';

interface Props {
  data: ChannelPublicPass;
}

export default function ChannelElement({ data }: Props) {
  return (
    <div style={ChannelElementStyle}>
      <div>
        <div style={ChannelBannerContainer}>
          <Flex flex_direction="row">
            <RoundButton
              icon={require('../../assets/imgs/icon_user.png')}
              icon_size={50}
              onClick={() => {}}
            ></RoundButton>
            <p> {data.channel_name} </p>
          </Flex>
          <div style={{ right: '0', overflow: 'hidden' }}>
            <Flex
              zIndex={'10'}
              flex_direction="row"
              flex_justifyContent={'space-evenly'}
            >
              <RoundButton
                icon={require(
                  data.has_password
                    ? '../../assets/imgs/icon_lock.png'
                    : '../../assets/imgs/icon_chat.png',
                )}
                onClick={() => {}}
              ></RoundButton>
              <p>42</p>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChannelElementStyle: CSSProperties = {
  width: '520px',
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
  width: '400px',
};
