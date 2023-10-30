import { subscribe } from '../../utils/event';
import { ChannelMessage, ChannelUsers } from '../../utils/interfaces';
import { ChanUser } from './ChanUser';
import { useEffect, useState } from 'react';

interface Props {
  chan_id: number;
  usrs: ChannelUsers[];
  onClick: (name: ChannelMessage) => void;
}

export function ChanUserList({ chan_id, onClick, usrs }: Props) {
  const uniqueIds = new Set();

  const unique = usrs.filter((item) => {
    if (!uniqueIds.has(item.id)) {
      uniqueIds.add(item.id);
      return true;
    }
    return false;
  });

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
        {unique.map((item, idx) => (
          <ChanUser key={idx} item={item} chan_id={chan_id} onClick={onClick} />
        ))}
      </div>
    </div>
  );
}
