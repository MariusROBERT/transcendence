import { subscribe } from '../../utils/event';
import { ChannelUsers } from '../../utils/interfaces';
import { ChanUser } from './ChanUser';
import { useEffect, useState } from 'react';

export function ChanUserList() {
  let [usrs, setUsers] = useState<ChannelUsers[]>([]);

  useEffect(() => {
    subscribe('enter_users', async (event: any) => {
      //  TODO: add check for owner
      setUsers(event.detail.value);
    });
  });

  function chat() {
    return (
      <>
        {usrs.map((item) => (
          <ChanUser key={item.id} user_icon={item.urlImg} online={true}>
            {item.username}
          </ChanUser>
        ))}
      </>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
      }}
    >
      {chat()}
    </div>
  );
}
