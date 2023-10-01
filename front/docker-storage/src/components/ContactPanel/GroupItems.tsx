import { ReactNode, useEffect, useState } from 'react';
import { Background, Border, RoundButton, UserBanner, ChannelPannel } from '..';
import { color, Fetch } from '../../utils';
import { ChannelInfos, IUser, IUserComplete } from '../../utils/interfaces';

interface Props {
  children?: ReactNode;
  heading: string;
  duration_ms: number;
  meUser: IUserComplete | undefined;
}

export function GroupItems({ children, heading, duration_ms, meUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);

  let [chans, setChannels] = useState<ChannelInfos[]>([]);

  useEffect(() => {
    async function getAllUsers() {
      const users = (await Fetch('user/get_all_public_profile', 'GET'))?.json;
      if (users) setAllUsers(users);
    }

    getAllUsers();
  }, [isOpen]);

  const displayFriends = () => {
    if (!meUser)
      return;
    console.log('friends list');
    const friends: IUser[] = allUsers.filter(
      (u) => meUser?.friends.includes(u.id),
    );

    return friends.map((friend: IUser) => (
      <div key={friend.id}>
        <UserBanner otherUser={friend} meUser={meUser} />
      </div>
    ));
  };

  const displayUsers = () => {
    if (!meUser)
      return;
    const others: IUser[] = allUsers.filter(u => u.id !== meUser?.id);

    return others.map((other: IUser) => (
      <div key={other.id}>
        <UserBanner otherUser={other} meUser={meUser} />
      </div>
    ));
  };

  const displayChannels = () => {
    return (
      <>
        {chans.map((data, idx) => (
          <ChannelPannel
            key={idx}
            id={data.id}
            name={data.name}
            type={data.type}
          ></ChannelPannel>
        ))}
      </>
    );
  };

  let buttonStyle: React.CSSProperties = {
    rotate: (isOpen ? 0 : 180) + 'deg',
    transition: duration_ms + 'ms ease',
  };

  let groupStyle: React.CSSProperties = {
    paddingTop: isOpen ? '15px' : '0px',
    paddingRight: '5px',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '50px',
    overflow: 'scroll',
    height: isOpen ? '100%' : '0px',
    gap: '30px',
    transition: duration_ms + 'ms ease',
  };

  async function FetchChannels() {
    const res = await Fetch('channel/of_user', 'POST');
    const channels = res?.json;
    setChannels(channels);
  }

  function openGroup() {
    setIsOpen(!isOpen);
    //  Check if you open the right Group
    if (!isOpen && heading === 'Channels') FetchChannels();
  }

  return (
    <>
      <Border
        borderSize={0}
        height={50}
        borderColor={color.black}
        borderRadius={0}
      >
        <Background
          bg_color={color.grey}
          flex_direction={'row'}
          flex_justifyContent={'flex-end'}
        >
          <h2 style={{ position: 'absolute', left: '5px' }}>{heading}</h2>
          <div style={buttonStyle}>
            <RoundButton icon={require('../../assets/imgs/side_panel_button.png')} icon_size={40} onClick={() => {
              openGroup();
            }} /></div>
        </Background>
      </Border>
      <div style={groupStyle}>
        {children}
        {isOpen && heading === 'Users' && displayUsers()}
        {isOpen && heading === 'Friends' && displayFriends()}
        {isOpen && heading === 'Channels' && displayChannels()}
      </div>
    </>
  );
}
