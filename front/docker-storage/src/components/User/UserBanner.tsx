import { Flex, RoundButton } from '..';
import { UserButton } from './UserButton';
import { IUser } from '../../utils/interfaces';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useUserContext } from '../../contexts';
import { useUIContext } from '../../contexts/UIContext/UIContext';

interface Props {
  otherUser: IUser;
}

const UserBanner = ({ otherUser }: Props) => {
  const { setIsProfileOpen } = useUIContext();
  const { id, user, socket } = useUserContext();
  const isMe = otherUser.id === user?.id;
  const [userBanner, setUserBanner] = useState<IUser>(otherUser.id === id && user ? user : otherUser);
  const [mobile, setMobile] = useState<boolean>(window.innerWidth < 650);
  useEffect(() => {
    setMobile(window.innerWidth < 650);
  }, [window.innerWidth]);

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

  const userBannerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '12.5px',
    background: '#00AA55',
    height: '25px',
    marginTop: 5,
    width: mobile ? 200 : 400,
    alignSelf: 'center',
    margin: '0 10px',
  };

  const statusStyle: CSSProperties = {
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: '10px',
    height: '10px',
  };

  return (
    <>
      <div style={userBannerStyle}>
        <Flex flex_direction='row'>
          <img style={statusStyle}
               src={userBanner.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') : require('../../assets/imgs/icon_red_disconnect.png')}
               alt={userBanner.user_status ? 'connected' : 'disconnected'} />
          <RoundButton icon={userBanner.urlImg} icon_size={50}
                       onClick={() => setIsProfileOpen(userBanner?.id || 0)} />
          <p style={{fontWeight: 'bold'}} onClick={() => setIsProfileOpen(userBanner?.id || 0)}>{userBanner.username}</p>
        </Flex>
        {!isMe && !mobile && <UserButton otherUser={userBanner} />}
      </div>
    </>
  );
};
export default UserBanner;
