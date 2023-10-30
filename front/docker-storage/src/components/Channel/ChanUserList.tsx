import { subscribe } from '../../utils/event';
import { ChannelMessage, ChannelUsers } from '../../utils/interfaces';
import { ChanUser } from './ChanUser';
import { useEffect, useState } from 'react';
import {Fetch} from '../../utils';

interface Props {
  chan_id: number;
  onClick: (name: ChannelMessage) => void;
}

export function ChanUserList({ chan_id, onClick }: Props) {
  const [usrs, setUsers] = useState<ChannelUsers[]>([]);

  const uniqueIds = new Set();

  useEffect(() => {
    subscribe('enter_users', async (event: any) => {
      if (event.detail.id !== chan_id) return;
      setUsers(event.detail.value);
    });
    async function getUsers(){
      setUsers((await Fetch('channel/users/' + chan_id, 'GET'))?.json);
    }

    getUsers();

  }, [chan_id]);

  return (
    <div
      style={{
        minWidth: '400px',
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          display: 'flex',
          padding: '5px',
          overflowX: 'scroll',
          marginBottom: '10px',
          flexWrap: 'nowrap',
        }}
      >
        {usrs.map((item, idx) => (
          <ChanUser key={idx} item={item} chan_id={chan_id} onClick={onClick} />
        ))}
      </div>
    </div>
  );
}
