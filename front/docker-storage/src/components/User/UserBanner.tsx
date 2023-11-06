import { Flex, RoundButton } from '..';
import { UserButton } from './UserButton';
import { IUser } from '../../utils/interfaces';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useUserContext } from '../../contexts';
import { useUIContext } from '../../contexts/UIContext/UIContext';
import { color } from '../../utils';

interface Props {
  otherUser: IUser;
}

const UserBanner = ({ otherUser }: Props) => {
  const { setIsProfileOpen } = useUIContext();
  const { id, user, socket } = useUserContext();
  const isMe = otherUser.id === user?.id;
  const [userBanner, setUserBanner] = useState<IUser>(otherUser.id === id && user ? user : otherUser);

  useEffect(() => {
    if (isMe)
      return;
    if (userBanner?.id < 1)
      return;
    socket?.emit('get_user_status', { userId: userBanner?.id});
  }, [socket, isMe, userBanner]);


  useEffect(() => {
    function connect(body: { userId: number }) {
      if (body.userId === userBanner.id) setUserBanner({ ...userBanner, user_status: 'on' });
    }

    function disconnect(body: { userId: number }) {
      if (body.userId === userBanner.id) setUserBanner({ ...userBanner, user_status: 'off' });
    }

    function start_game(body: { userId: number }) {
      if (body.userId === userBanner.id) setUserBanner({ ...userBanner, user_status: 'in_game' });
    }

    socket?.on('user_connection', connect);
    socket?.on('user_disconnection', disconnect);
    socket?.on('user_start_game', start_game);
    socket?.on('user_end_game', connect);

    return () => {
      socket?.off('user_connection');
      socket?.off('user_disconnection');
      socket?.off('user_start_game', start_game);
      socket?.off('user_end_game', connect);
    };
  }, [socket, userBanner]);

  const userBannerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '12.5px',
    background: color.light_blue,
    color: user?.friends?.includes(otherUser.id) ? color.green : color.white,
    height: '25px',
    marginTop: 5,
    width: 400,
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
               src={userBanner.user_status === 'on' ? require('../../assets/imgs/icon_green_connect.png') : userBanner.user_status === 'off' ? require('../../assets/imgs/icon_red_disconnect.png') : require('../../assets/imgs/pngwing.com (3).png')}
               alt={userBanner.user_status ? 'connected' : 'disconnected'} />
          <RoundButton icon={userBanner.urlImg} icon_size={50}
                       onClick={() => setIsProfileOpen(userBanner?.id || 0)} />
          <p style={{fontWeight: 'bold'}} onClick={() => setIsProfileOpen(userBanner?.id || 0)}>{userBanner.pseudo}</p>
        </Flex>
        {!isMe && <UserButton otherUser={userBanner} />}
      </div>
    </>
  );
};
export default UserBanner;
