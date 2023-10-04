import { subscribe } from '../../utils/event';
import { ChannelUsers } from '../../utils/interfaces';
import { ChanUser } from '../ChanUser/ChanUser';
import { useEffect, useState } from 'react';

export function ChanUserList() {
  let [usrs, setUsers] = useState<ChannelUsers[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    subscribe('enter_users', async (event: any) => {
      setUsers(event.detail.value);
    });
  });

  function chat() {
    return (
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.5s',
          transform: `translateX(-${scrollIndex * 100}%)`,
        }}
      >
        {usrs.map((item) => (
          <ChanUser key={item.id} user_icon={item.urlImg} online={true}>
            {item.username}
          </ChanUser>
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
