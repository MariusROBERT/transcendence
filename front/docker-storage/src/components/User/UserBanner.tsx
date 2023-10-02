import { AuthGuard, Flex, RoundButton } from '..';
import { UserButton } from './UserButton';
import { IUser } from '../../utils/interfaces';
import React, { CSSProperties, useEffect, useState } from 'react';
import Profil from '../Profil/profil';
import Popup from '../ComponentBase/Popup';
import { useUserContext } from '../../contexts';
import { useFriendsRequestContext } from '../../contexts/FriendsRequestContext/FriendsRequestContext';

interface Props {
  otherUser: IUser;
}

const UserBanner = ({ otherUser }: Props) => {
  const [profilVisible, setProfilVisible] = useState<boolean>(false);
  const { user } = useUserContext();

  const isMe = otherUser.id === user?.id;

  return (
    <div>
      <div style={UserBannerContainer}>
        <Flex flex_direction='row'>
          {isMe  || <img style={statusStyle}
                src={(isMe ? user : otherUser)?.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') : require('../../assets/imgs/icon_red_disconnect.png')}
                alt={(isMe ? user : otherUser)?.user_status ? 'connected' : 'disconnected'} />}
          <RoundButton icon={(isMe ? user: otherUser).urlImg} icon_size={50}
                       onClick={() => setProfilVisible(true)} />
          <p onClick={() => setProfilVisible(true)}>{(isMe ? user: otherUser).username}</p>
        </Flex>
        {!isMe &&
          <UserButton otherUser={otherUser} />
        }
      </div>
      {profilVisible && (
        <AuthGuard isAuthenticated>
          <Popup isVisible={profilVisible} setIsVisible={setProfilVisible}>
            <Profil otherUser={otherUser} />
          </Popup>
        </AuthGuard>
      )}
    </div>
  );
};
export default UserBanner;

const UserBannerContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '400px',
};

const statusStyle: CSSProperties = {
  position: 'absolute',
  left: '0px',
  top: '0px',
  width: '10px',
  height: '10px',
};
