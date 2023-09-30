
import { color, Fetch } from '../../utils';
import { Background, Button } from '..';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useGameContext } from '../../contexts';

export function GameInvites(){
  const { hasReceivedInvitationFrom, hasSendInvitationTo, cancelGameInvite, acceptGameInvite, declineGameInvite } = useGameContext();
  const [ username, setUsername ] = useState<string | undefined>();

  useEffect(() => {
    async function getUsername(){
      if (hasReceivedInvitationFrom === hasSendInvitationTo)
        return setUsername(undefined);
      const id = hasSendInvitationTo ? hasSendInvitationTo : hasReceivedInvitationFrom;
      setUsername((await Fetch('user/getUserNameWithId/' + id, 'GET'))?.json);
    }
    getUsername();
  }, [hasReceivedInvitationFrom, hasSendInvitationTo]);

  const inviteStyle: CSSProperties = {
    top: '0px',
    right: hasReceivedInvitationFrom === hasSendInvitationTo ? '-600px' : '150px',
    minWidth: (hasSendInvitationTo ? 400 :  550) + 'px',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    zIndex: '9999',
    transition: '1s',
    minHeight: '60px',
    height:'60px',
    borderRadius: 30 + 'px',
    overflow: 'hidden'
  };

  return (
    <div style={inviteStyle}>
        <Background flex_direction={'row'} flex_alignItems={'center'} flex_justifyContent={'space-evenly'} bg_color={color.grey}>
          {hasSendInvitationTo && (<>
            <p style={{marginLeft:10}}>{'You invited ' + username + ' to Play'}</p>
            <Button onClick={cancelGameInvite}>Cancel</Button>
          </>)}
          {hasReceivedInvitationFrom && (<>
            <p style={{marginLeft:10}}>{username + ' invited you to Play: '}</p>
            <Button onClick={() => {
              if (hasReceivedInvitationFrom)
                acceptGameInvite(hasReceivedInvitationFrom);
            }}>Accept</Button>
            <Button onClick={() => {
              if (hasReceivedInvitationFrom)
                declineGameInvite(hasReceivedInvitationFrom);
            }}>Decline</Button>
          </>)}
          <p style={{minWidth:'30px'}}></p>
        </Background>
    </div>
  );
}