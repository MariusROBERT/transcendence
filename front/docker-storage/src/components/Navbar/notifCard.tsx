import { IUser, NotifInfos } from '../../utils/interfaces';
import './stylenavbar.css';
import { RoundButton } from '../ComponentBase/RoundButton';
import { useFriendsRequestContext, useUserContext } from '../../contexts';


const NotifCard = ({ notif, otherUserId }: { notif: NotifInfos, otherUserId: number }) => {
  const { acceptFriendRequest, declineFriendRequest, recvInvitesFrom } = useFriendsRequestContext();
  const { id } = useUserContext();

  if (recvInvitesFrom.includes(otherUserId)) {
    return (
      <div className='notif'>
        <div className='bar'/>
        <div className='container'>
          <p className='username'>
            {notif.username} vous a demande en ami
          </p>
          <div className='btn'>
            <RoundButton icon={require('../../assets/imgs/icon_accept.png')}
                         onClick={() => acceptFriendRequest(id, otherUserId)} />
            <RoundButton icon={require('../../assets/imgs/icon_denied.png')}
                         onClick={() => declineFriendRequest(id, otherUserId)} />
          </div>
        </div>
      </div>
    );
  }
  return null;

};

export default NotifCard;