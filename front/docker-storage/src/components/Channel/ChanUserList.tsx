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
          border: '1px solid red',
          width: '100%', // Assurez-vous que le conteneur a une largeur définie
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          overflowX: 'auto',
          marginBottom: '10px',
          flexWrap:'nowrap'
        }}
      >
        {unique.map((item, idx) => (
          <ChanUser key={idx} item={item} chan_id={chan_id} onClick={onClick} />
        ))}
      </div>
    );
  }
  

  return (
    <div style={{ overflow: 'hidden' }}>
      {chat()}
      <div style={{ display: 'flex', justifyContent: 'center' }}></div>
    </div>
  );
}
