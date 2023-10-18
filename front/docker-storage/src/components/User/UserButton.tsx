import { Flex, RoundButton } from '..';
import { IUser } from '../../utils/interfaces';
import { openChat } from '../../utils/user_functions';
import { useFriendsRequestContext, useGameContext } from '../../contexts';

interface Props {
  otherUser: IUser;
}

export function UserButton({ otherUser }: Props) {
  const { sendGameInvite } = useGameContext();
  const {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    blockUser,
    unblockUser,
    cancelFriendRequest,
    sendInvitesTo,
    recvInvitesFrom,
    friends,
    blocked,
  } = useFriendsRequestContext();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      minWidth: '100px',
    }}>
      <Flex zIndex={'10'} flex_direction='row' flex_justifyContent={'space-evenly'}>
        {friends?.includes(otherUser.id) && !blocked?.includes(otherUser.id) &&
          <RoundButton icon={require('../../assets/imgs/icon_chat.png')}
                       onClick={() => openChat()} />
        }
        {friends?.includes(otherUser.id) && otherUser.user_status === 'on' &&
          <RoundButton icon={require('../../assets/imgs/icon_play.png')}
                       onClick={() => sendGameInvite(otherUser.id, 'normal')} />
        }
        {!friends?.includes(otherUser.id) && !blocked?.includes(otherUser.id) && !sendInvitesTo?.includes(otherUser.id) && !recvInvitesFrom?.includes(otherUser.id) &&
          <RoundButton icon={require('../../assets/imgs/icon_add_friend.png')}
                       onClick={() => sendFriendRequest(otherUser.id)} />
        }
        {recvInvitesFrom?.includes(otherUser.id) && !friends?.includes(otherUser.id) && !blocked?.includes(otherUser.id) && !sendInvitesTo?.includes(otherUser.id) &&
          <div style={askStyle}>
            <RoundButton icon={require('../../assets/imgs/icon_accept.png')}
                         onClick={() => acceptFriendRequest(otherUser.id)} />
            <RoundButton icon={require('../../assets/imgs/icon_denied.png')}
                         onClick={() => declineFriendRequest(otherUser.id)} />
          </div>
        }
        {sendInvitesTo?.includes(otherUser.id) &&
          <RoundButton icon={require('../../assets/imgs/icon_close.png')}
                       onClick={() => cancelFriendRequest(otherUser.id)} />
        }
        {!blocked?.includes(otherUser.id) &&
          <RoundButton icon={require('../../assets/imgs/icon_block.png')}
                       onClick={() => {
                         blockUser(otherUser.id);
                       }} />
        }
        {blocked?.includes(otherUser.id) &&
          <RoundButton icon={require('../../assets/imgs/icon_unblock.png')}
                       onClick={() => {
                         unblockUser(otherUser.id);
                       }} />
        }
      </Flex>
    </div>
  );
}

const askStyle = {
  display: 'flex',
  borderRadius: '100px',
  alignItem: 'center',
  justifyContent: 'center',
  background: 'white',
  width: '80px',
  height: '40px',
  border: '4px solid green',
};
