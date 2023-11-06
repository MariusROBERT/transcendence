import { RoundButton } from '..';
import { useUserContext } from '../../contexts';
import {
  ChannelMessage,
  ChannelUsers,
} from '../../utils/interfaces';

interface Props {
  item: ChannelUsers;
  chan_id: number;
  onClick: (name: ChannelMessage) => void;
}

export function ChanUser({ item, chan_id, onClick }: Props) {
  const { id, user } = useUserContext();
  if (!user) return <></>;
  function viewProfile() {
    if (chan_id === -1) return;
    const data: ChannelMessage = {
      channel_id: chan_id,
      sender_id: item.id,
      sender_urlImg: item.urlImg,
      sender_pseudo: item.pseudo,
      message_content: '',
    };
    onClick(data);
  }

  return (
    <div>
      <RoundButton
        icon={item.id === id ? user?.urlImg : item.urlImg}
        icon_size={42}
        onClick={viewProfile}
      ></RoundButton>
    </div>
  );
}
