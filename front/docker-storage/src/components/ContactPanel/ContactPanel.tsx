
import { Background, Border, ChannelBanner, ChatMenu, GroupItems, Popup, RoundButton, UserBanner } from '..';
import { color, Fetch, Viewport } from '../../utils';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import { ChannelInfos, IUser } from '../../utils/interfaces';
import { useEffect, useState } from 'react';
import { subscribe } from '../../utils/event';
import CreateChat from '../Chat/CreateChat';

interface Props {
  viewport: Viewport;
}
export function ContactPanel({ viewport }: Props) {
  const { socket } = useUserContext();
  const { friends } = useFriendsRequestContext();
  const [friendList, setFriendList] = useState<IUser[]>([]);
  const [channelList, setChannelList] = useState<ChannelInfos[]>([]);
  const [createChatVisible, setCreChatVisible] = useState<boolean>(false);

  const mobile = viewport.width < 500;

  useEffect(() => {
    const getFriends = async () => {
      const users = (await Fetch('user/get_all_public_profile', 'GET'))?.json;
      if (!users)
        return setFriendList([]);
      setFriendList(users.filter((u: IUser) => friends.includes(u.id)));
    };
    getFriends();
  }, [friends]);

  async function FetchChannels() {
    const channels = (await Fetch('channel/of_user', 'POST'))?.json;
    if (!channels)
      return setChannelList([]);
    setChannelList(channels);
  }

  useEffect(() => {
    FetchChannels();
    subscribe('update_chan', async (event: any) => {
      if (event.detail)
        await FetchChannels();
    });
  }, []);

  useEffect(() => {
    socket?.on('join', FetchChannels);
    return () => {
      socket?.off('join');
    };
    // eslint-disable-next-line
  }, [socket]);

  const [hoveredStatesFriends, setHoveredStatesFriends] = useState(friendList.map(() => false));
  const [hoveredStatesChannels, setHoveredStatesChannels] = useState(channelList.map(() => false));

  const handleMouseEnter = (index: number, type: string) => {
    if (type === 'friends') {
      const updatedHoveredStates = [...hoveredStatesFriends];
      updatedHoveredStates[index] = true;
      setHoveredStatesFriends(updatedHoveredStates);
    } else if (type === 'channels') {
      const updatedHoveredStates = [...hoveredStatesChannels];
      updatedHoveredStates[index] = true;
      setHoveredStatesChannels(updatedHoveredStates);
    }
  };

  const handleMouseLeave = (index: number, type: string) => {
    if (type === 'friends') {
      const updatedHoveredStates = [...hoveredStatesFriends];
      updatedHoveredStates[index] = false;
      setHoveredStatesFriends(updatedHoveredStates);
    } else if (type === 'channels') {
      const updatedHoveredStates = [...hoveredStatesChannels];
      updatedHoveredStates[index] = false;
      setHoveredStatesChannels(updatedHoveredStates);
    }
  };

  const onclick = () => {
    setCreChatVisible(true)
  }

  return (
    <>

      <div style={{ height: viewport.height - 100, width: '100%', paddingTop: mobile ? 60 : 0 }}>
        <Background
          flex_gap={'1px 0px'}
          flex_alignItems={'stretch'}
          flex_justifyContent={'flex-start'}
        >
          <GroupItems heading={'Friends'} duration_ms={900}>
            {friendList.map((friend: IUser, index: number) =>
              <div style={
                {
                  paddingBottom: '10px',
                  paddingTop: '10px',
                  borderRadius: '10px',
                  width: '90%',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  marginLeft: '10px',
                  transition: 'transform 0.2s',
                  transform: hoveredStatesFriends[index] ? 'translateY(6px)' : 'none',
                  borderBottom: '2px solid #C2D0D3',
                }
              }
                onMouseEnter={() => handleMouseEnter(index, 'friends')}
                onMouseLeave={() => handleMouseLeave(index, 'friends')}
                key={'friend' + friend.id}><UserBanner otherUser={friend} /></div>
            )}
          </ GroupItems>
          <GroupItems heading={'Channels'} duration_ms={900}>
            <div style={{ margin: '10px' }}>
              {/* <Button
                onClick={() => {
                  setCreChatVisible(true);
                }}
              >
                Create Channel
              </Button>
                 */}
              <RoundButton icon_size={50} icon={require('../../assets/imgs/icons8-plus-100.png')} onClick={onclick}
              ></RoundButton>

            </div>
            <div>

              <Popup isVisible={createChatVisible} setIsVisible={setCreChatVisible}>
                <CreateChat
                  name={''}
                  visible={createChatVisible}
                  setVisible={setCreChatVisible}
                />
              </Popup>
            </div >

            {channelList.map((channel: ChannelInfos, index: number) =>
              <div style={
                {
                  paddingBottom: '10px',
                  borderRadius: '10px',
                  width: '90%',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  marginLeft: '10px',
                  transition: 'transform 0.2s',
                  transform: hoveredStatesChannels[index] ? 'translateY(6px)' : 'none',
                  borderBottom: '2px solid #C2D0D3',
                }
              }
                onMouseEnter={() => handleMouseEnter(index, 'channels')}
                onMouseLeave={() => handleMouseLeave(index, 'channels')}
                key={'channel' + channel.id}><ChannelBanner id={channel.id} name={channel.name} type={channel.type} /></div>
            )}
          </ GroupItems >
          <Border
            borderSize={0}
            height={50}
            borderColor={color.black}
            borderRadius={0}
          >
            {/* <Background
              bg_color={color.grey}
              flex_direction={'row'}
              flex_justifyContent={'flex-end'}
            >
              <h2 style={{ position: 'absolute', left: '5px' }}>Contacts</h2>
            </Background> */}
          </Border>
        </Background >
      </div >
      <div>
        <ChatMenu />
      </div>
    </>
  );
}
