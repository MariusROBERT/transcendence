import { CSSProperties } from 'react';
import { Flex } from '../Flex/FlexBox';
import { RoundButton } from '../RoundButton/RoundButton';

export default function ChannelElement() {
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
            <p style={{ fontSize: '25px' }}> Channel Name </p>
          </Flex>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '50px'}}>
            <RoundButton
              icon={require('../../assets/imgs/icon_chat.png')}
              icon_size={50}
              onClick={() => {}}
            ></RoundButton>
            <p style={{ marginLeft: '20px', fontSize: '20px' }}>42</p>
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
