import { AuthGuard, Flex, RoundButton, Profil, Popup } from '..';
import { UserButton } from './UserButton';
import { IUser, IUserComplete } from '../../utils/interfaces';
import React, { CSSProperties, useState } from 'react';

interface Props {
  otherUser: IUser;
  meUser: IUserComplete;
}

const UserBanner = ({ otherUser, meUser }: Props) => {
  // const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);

  const isMe = otherUser.id === meUser?.id;

  return (
    <div>
      <div style={UserBannerContainer}>
        <Flex flex_direction='row'>
          {isMe || <img style={statusStyle}
                        src={(isMe ? meUser : otherUser)?.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') : require('../../assets/imgs/icon_red_disconnect.png')}
                        alt={(isMe ? meUser : otherUser)?.user_status ? 'connected' : 'disconnected'} />}
          <RoundButton icon={(isMe ? meUser : otherUser).urlImg} icon_size={50}
                       onClick={() => setProfilVisible(true)} />
          <p onClick={() => setProfilVisible(true)}>{(isMe ? meUser : otherUser).username}</p>
        </Flex>
        <UserButton otherUser={otherUser} meUser={meUser} />
      </div>
      {profilVisible && (
        <AuthGuard isAuthenticated>
          <Popup isVisible={profilVisible} setIsVisible={setProfilVisible}>
            <Profil otherUser={otherUser} meUser={meUser} />
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
