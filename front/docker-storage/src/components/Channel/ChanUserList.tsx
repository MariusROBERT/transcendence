import { subscribe } from '../../utils/event';
import { ChannelMessage, ChannelUsers } from '../../utils/interfaces';
import { ChanUser } from './ChanUser';
import { useEffect, useState } from 'react';

interface Props {
  chan_id: number;
  onClick: (name: ChannelMessage) => void;
}

export function ChanUserList({ chan_id, onClick }: Props) {
  const [usrs, setUsers] = useState<ChannelUsers[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  const uniqueIds = new Set();

  const unique = usrs.filter((item) => {
    if (!uniqueIds.has(item.id)) {
      uniqueIds.add(item.id);
      return true;
    }
    return false;
  });

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
          transform: `translateX(-${scrollIndex * usrs.length}%)`,
        }}
      >
        {unique.map((item, idx) => (
          <ChanUser key={idx} item={item} chan_id={chan_id} onClick={onClick} />
        ))}
      </div>
    );
  }

  const scrollLeft = () => {
    setScrollIndex(Math.max(scrollIndex - 1, -Math.floor(usrs.length / 10)));
  };

  const scrollRight = () => {
    const maxScrollIndex = Math.max(0, usrs.length / 10);
    setScrollIndex(Math.min(scrollIndex + 1, maxScrollIndex));
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      {chat()}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={scrollLeft} disabled={scrollIndex <= 0}>L</button>
        <button
          onClick={scrollRight}
          disabled={scrollIndex >= usrs.length / 10}
        >
          R
        </button>
      </div>
    </div>
  );
}
