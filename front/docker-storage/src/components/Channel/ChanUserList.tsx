import { subscribe } from '../../utils/event';
import { ChannelMessage, ChannelUsers } from '../../utils/interfaces';
import { ChanUser } from './ChanUser';
import { useEffect, useState } from 'react';

interface Props {
  chan_id: number;
  onClick: (name: ChannelMessage) => void;
}

export function ChanUserList({ chan_id, onClick }: Props) {
  let [usrs, setUsers] = useState<ChannelUsers[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    subscribe('enter_users', async (event: any) => {
      setUsers(event.detail.value);
    });
  }, []);

  function chat() {
    return (
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.5s',
          transform: `translateX(-${scrollIndex * 100}%)`,
        }}
      >
        {usrs.map((item, idx) => (
          <ChanUser key={idx} item={item} chan_id={chan_id} onClick={onClick} />
        ))}
      </div>
    );
  }

  const scrollLeft = () => {
    setScrollIndex(Math.max(scrollIndex - 1, 0));
  };

  const scrollRight = () => {
    setScrollIndex(Math.min(scrollIndex + 1, usrs.length));
  };

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <div>
        {chat()}
        <div style={{alignItems: "center"}}>
        <button onClick={scrollLeft}> L </button>
        <button onClick={scrollRight}> R </button>
        </div>
      </div>
    </div>
  );
}
