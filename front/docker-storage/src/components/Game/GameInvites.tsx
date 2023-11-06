import { color, Fetch } from '../../utils';
import { Background, Button, RoundButton } from '..';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useGameContext } from '../../contexts';

export function GameInvites() {
  const {
    isInQueue,
    inviteFrom,
    inviteTo,
    cancelGameInvite,
    acceptGameInvite,
    declineGameInvite,
    leaveQueue,
  } = useGameContext();
  const [pseudo, setPseudo] = useState<string | undefined>();

  useEffect(() => {
    async function getPseudo() {
      if (inviteFrom === inviteTo)
        return setPseudo(undefined);
      const id = inviteTo ? inviteTo : inviteFrom;
      setPseudo(((await Fetch('user/get_public_profile_by_id/' + id, 'GET'))?.json)?.pseudo);
    }

    getPseudo();
  }, [inviteFrom, inviteTo]);

  const inviteStyle: CSSProperties = {
    border: `2px solid ${color.white2}`,
    borderTop: 0,
    top: isInQueue || inviteFrom !== inviteTo ? 0 : -300,
    minWidth: inviteTo ? 400 : 550,
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
    zIndex: 95,
    transition: '0.2s',
    minHeight: '60px',
    height: '70px',
    borderRadius: '0 0 15px 15px',
    overflow: 'hidden',
  };

  return (
    <div style={inviteStyle}>
      <Background flex_direction={'row'} flex_alignItems={'center'} flex_justifyContent={'space-evenly'}
                  bg_color={color.light_blue}>
        {inviteTo && (<>
          <p style={{ marginLeft: 10 }}>{'You invited ' + pseudo + ' to Play'}</p>
          <Button onClick={cancelGameInvite}>Cancel</Button>
        </>)}
        {inviteFrom && (<>
          <p style={{ marginLeft: 10 }}>{pseudo + ' invited you to Play: '}</p>
          <RoundButton
            icon={require('../../assets/imgs/icon_accept_invite.png')}
            onClick={() => {
              if (inviteFrom)
                acceptGameInvite(inviteFrom);
            }} />
          <RoundButton
            icon={require('../../assets/imgs/icon_refuse_invite.png')}
            onClick={() => {
              if (inviteFrom)
                declineGameInvite(inviteFrom);
            }} />
        </>)}
        {isInQueue && (<>
          <p
            style={{ paddingLeft: '10px', marginRight: 0 }}>{'Searching for opponent ' + isInQueue + ' game Mode'}</p>
          <Button onClick={leaveQueue}>Cancel</Button>
        </>)}
        <p style={{ minWidth: '30px' }}></p>
      </Background>
    </div>
  );
}