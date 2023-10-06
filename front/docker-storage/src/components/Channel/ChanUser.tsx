import { RoundButton } from '..';
import {
  ChannelMessage,
  ChannelUsers,
  IChatUser,
} from '../../utils/interfaces';

interface Props {
  item: ChannelUsers;
  chan_id: number;
  onClick: (name: ChannelMessage) => void;
}

export function ChanUser({ item, chan_id, onClick }: Props) {
  function viewProfile() {
    if (chan_id === -1) return;
    var data: ChannelMessage;
    data = {
      channel_id: chan_id,
      sender_id: item.id,
      sender_urlImg: item.urlImg,
      sender_username: item.username,
      message_content: '',
    };
    onClick(data);
  }

  return (
    <div>
      <RoundButton
        icon={item.urlImg}
        icon_size={42}
        onClick={viewProfile}
      ></RoundButton>
    </div>
  );
}
