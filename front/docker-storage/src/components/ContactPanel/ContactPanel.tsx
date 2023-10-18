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
  const [friendList, setFriendList] = useState<IUser[]>([]);
  const [channelList, setChannelList] = useState<ChannelInfos[]>([]);
  const mobile = viewport.width < 500;

  return (
    <>
      <div style={{ height: viewport.height - 100, width: '100%', paddingTop: mobile ? 60 : 0 }}>
        <Background
          flex_gap={'1px 0px'}
          flex_alignItems={'stretch'}
          flex_justifyContent={'flex-start'}
        >
          <GroupItems heading={'Friends'} duration_ms={900}>
            {friendList.map((friend: IUser) =>
              <div key={'friend' + friend.id}><UserBanner otherUser={friend} /></div>)}
          </ GroupItems>
          <GroupItems heading={'Channels'} duration_ms={900}>
            {channelList.map((channel: ChannelInfos) =>
              <div key={'channel' + channel.id}><ChannelBanner id={channel.id} name={channel.name}
                                                               type={channel.type} /></div>)}
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
