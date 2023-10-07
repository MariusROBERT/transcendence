import { Flex, Popup, Profil, RoundButton } from '..';
import { UserButton } from './UserButton';
import { IUser } from '../../utils/interfaces';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useUserContext } from '../../contexts';

interface Props {
  otherUser: IUser;
}

const UserBanner = ({ otherUser }: Props) => {
  const [profilVisible, setProfilVisible] = useState<boolean>(false);
  const { id, user, socket } = useUserContext();
  const isMe = otherUser.id === user?.id;
  const [userBanner, setUserBanner] = useState<IUser>(otherUser.id === id && user ? user : otherUser);

  useEffect(() => {
    function connect(body: { userId: number }) {
      console.log('connect: ', body);
      if (body.userId === userBanner.id) setUserBanner({ ...userBanner, user_status: 'on' });
    }

    function disconnect(body: { userId: number }) {
      console.log('disconnect: ', body);
      if (body.userId === userBanner.id) setUserBanner({ ...userBanner, user_status: 'off' });
    }

    socket?.on('user_connection', connect);
    socket?.on('user_disconnection', disconnect);

    return () => {
      socket?.off('user_connection');
      socket?.off('user_disconnection');
    };
  }, [socket, userBanner]);

  return (
    <div>
      <div style={UserBannerContainer}>
        <Flex flex_direction='row'>
          {!isMe &&
            <img style={statusStyle}
                 src={userBanner.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') : require('../../assets/imgs/icon_red_disconnect.png')}
                 alt={userBanner.user_status ? 'connected' : 'disconnected'} />
          }
          <RoundButton icon={userBanner.urlImg} icon_size={50}
                       onClick={() => setProfilVisible(true)} />
          <p onClick={() => setProfilVisible(true)}>{userBanner.username}</p>
        </Flex>
        {!isMe &&
          <UserButton otherUser={otherUser} />
        }
      </div>
      {profilVisible && (
        <Popup isVisible={profilVisible} setIsVisible={setProfilVisible}>
          <Profil otherUser={otherUser} />
        </Popup>
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
