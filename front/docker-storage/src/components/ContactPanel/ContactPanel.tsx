import { Background, Border, ChannelBanner, ChatMenu, GroupItems, UserBanner } from '..';
import { color, Fetch, Viewport } from '../../utils';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import { ChannelInfos, IUser } from '../../utils/interfaces';
import { useEffect, useState } from 'react';
import { subscribe } from '../../utils/event';

interface Props {
  viewport: Viewport;
}

export function ContactPanel({ viewport }: Props) {
  const { socket } = useUserContext();
  const { friends } = useFriendsRequestContext();
  const [friendList, setFriendList] = useState<IUser[]>([]);
  const [channelList, setChannelList] = useState<ChannelInfos[]>([]);
  const mobile = viewport.width < 500;

  useEffect(() => {
    const getFriends = async () => {
      const users = (await Fetch('user/get_all_public_profile', 'GET'))?.json;
      if (!users)
        return setChannelList([]);
      setChannelList(users.filter((u: IUser) => friends.includes(u.id)));
    };

    getFriends();
  }, [friends]);

  useEffect(() => {
    subscribe('update_chan', async (event: any) => {
      setChannelList(event.detail.value);
    });
  }, []);

  async function FetchChannels() {
    const res = await Fetch('channel/of_user', 'POST');
    const channels = res?.json;
    setChannelList(channels);
  }

  useEffect(() => {
    socket?.on('join', FetchChannels);
    return () => {
      socket?.off('join', FetchChannels);
    };
  }, [socket]);

  return (
    <>
      <div style={{ height: viewport.height - 100, width: '100%', paddingTop: mobile ? 60 : 0 }}>
        <Background
          flex_gap={'1px 0px'}
          flex_alignItems={'stretch'}
          flex_justifyContent={'flex-start'}
        >
          <GroupItems heading={'Friends'} duration_ms={900} >
            {friendList.map((friend: IUser) => <UserBanner otherUser={friend} />)}
          </GroupItems>
          <GroupItems heading={'Channels'} duration_ms={900} >
            {channelList.map((channel: ChannelInfos) => <ChannelBanner id={channel.id} name={channel.name} type={channel.type} />)}
          </ GroupItems>
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
              <h2 style={{ position: 'absolute', left: '5px' }}>Contacts</h2>
            </Background>
          </Border>
        </Background>
      </div>
      <div>
        <ChatMenu />
      </div>
    </>
  );
}
