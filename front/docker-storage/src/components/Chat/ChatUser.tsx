import { useEffect, useState } from 'react';
import { Fetch } from '../../utils';
import { RoundButton } from '../ComponentBase/RoundButton';
import { Button } from '../ComponentBase/Button';
import { IChatUser, IUser } from '../../utils/interfaces';
import { ErrorPanel } from '../Error/ErrorPanel';
import { UpdateChannelUsers, UpdateChannels } from '../../utils/channel_functions';
import { createChatStyle, inputStyle } from './CreateChat';
import { useUserContext } from '../../contexts';
import { Flex } from '../ComponentBase/FlexBox';
import { useUIContext } from '../../contexts/UIContext/UIContext';
import Popup from '../ComponentBase/Popup';
import { publish } from '../../utils/event';

interface Props {
  data: IChatUser | undefined;
  visibility: boolean;
  onClose: () => void;
}

export default function ChatUser({ data, visibility, onClose }: Props) {
  const { setIsProfileOpen } = useUIContext();
  const [muteTime, setmuteTime] = useState<string>('');
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, seterrorMessage] = useState<string>('Error');
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const { socket, id } = useUserContext();
  const [type, setType] = useState<string>('noperm');

  useEffect(() => {
    const fetchData = async () => {
      if (!visibility) {
        setErrorVisible(false);
        setCurrentUser(undefined);
      }
      if (visibility) {
        const rep = await Fetch('channel/rights/' + data?.channel_id, 'GET');
        //console.log(rep?.json.currentUser.type);
        const t = rep?.json?.currentUser?.type;
        if (t === 'owner' || t === 'admin') setType('perm');
        else setType('noperm');
        const rep2 = await Fetch(
          'user/get_public_profile_by_id/' + data?.sender_id,
          'GET',
        );
        setCurrentUser(rep2?.json);
      }
    };
    fetchData();
  }, [visibility, data?.channel_id]);

  async function execCommand(command: string) {
    const rep = await Fetch(
      'channel/' + command + '/' + data?.channel_id,
      'POST',
      JSON.stringify({
        id: data?.sender_id,
      }),
    );
    if (rep?.json.statusCode === 400) {
      seterrorMessage(rep?.json.message);
      setErrorVisible(true);
    } else {
      if (data?.channel_id) UpdateChannelUsers(data?.channel_id);
      if (command === 'kick' || command === 'ban') {
        const user = data?.sender_id;
        socket?.emit('remove', { user: user });
      }
    }
  }

  useEffect(() => {
    async function onRemove ( user: number ) {
      
      if (user === id) {
        publish('close_chat', undefined);
        await UpdateChannels();
      }
    }
    socket?.on('remove', onRemove);
    return (() => {
      socket?.off('remove', onRemove);
    })
  }, [id, socket])

  async function OnKick() {
    execCommand('kick');
  }

  async function OnBan() {
    execCommand('ban');
  }

  async function OnUnBan() {
    execCommand('unban');
  }

  async function OnMute() {
    if (muteTime === '') return;
    const isNum = /^\d+$/.test(muteTime);
    if (isNum) {
      const number = Number(muteTime);
      Fetch(
        'channel/mute/' + data?.channel_id,
        'POST',
        JSON.stringify({
          id: data?.sender_id,
          time: number,
        }),
      );
      setmuteTime('');
      return;
    }
    setErrorVisible(true);
    seterrorMessage('mute time is number only');
  }

  async function OnUnMute() {
    execCommand('unmute');
  }

  async function OnAddAdmin() {
    execCommand('add_admin');
  }

  async function OnRemAdmin() {
    execCommand('rem_admin');
  }

  function showAdmin() {
    if (id !== data?.sender_id) {
      return (
        <>
          <Flex flex_direction='row' flex_justifyContent={'space-evenly'}>
            <Button onClick={OnKick}> Kick </Button>
            <Button onClick={OnBan}> Ban </Button>
            <Button onClick={OnUnBan}> UnBan </Button>
          </Flex>
          <p>
            <input
              placeholder='Time in second'
              style={inputStyle}
              value={muteTime}
              onChange={(evt) => {
                setmuteTime(evt.target.value);
              }}
            ></input>
          </p>
          <div
            style={{
              display: 'flex',
              gap: 5,
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <Flex flex_direction='row' flex_justifyContent={'space-evenly'}>
              <Button onClick={OnMute}> Mute </Button>
              <Button onClick={OnUnMute}> UnMute </Button>
            </Flex>
            <Flex flex_direction='row' flex_justifyContent={'space-evenly'}>
              <Button onClick={OnAddAdmin}> Add as Admin </Button>
              <Button onClick={OnRemAdmin}> Rem as Admin </Button>
            </Flex>
          </div>
        </>
      );
    }
    return <div></div>;
  }


  useEffect(() => {
    if (visibility && type !== 'perm') {
      setIsProfileOpen(currentUser?.id || 0);
      onClose();
    }
  }, [type, currentUser, visibility]);

  return (
    <>
      {type !== 'perm' &&
      <></>
      }
      {type === 'perm' &&
        <Popup isVisible={visibility} onClose={onClose}>
          <div style={createChatStyle}>
            <div style={{ visibility: errorVisible ? 'inherit' : 'hidden' }}>
              <ErrorPanel text={errorMessage}></ErrorPanel>
            </div>
            <h2>
              {currentUser?.username}#{currentUser?.id}
            </h2>
            <RoundButton
              icon_size={100}
              icon={String(data?.sender_urlImg)}
              onClick={() => setIsProfileOpen(currentUser?.id || 0)}
            />
            {type === 'perm' ? showAdmin() : <></>}
          </div>
        </Popup>
      }
    </>
  );
}
