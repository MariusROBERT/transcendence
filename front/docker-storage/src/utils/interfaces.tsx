// --------------------------- Auth :

import { Socket } from 'socket.io-client';

// --------------------------- Register :

export interface FormDataRegister {
  username: string;
  password: string;
  confirmPassword: string;
}

// --------------------------- Login :

export interface FormData {
  username: string;
  password: string;
}

// --------------------------- MainPage :

export interface UserAndInvites {
  id: number;
  username: string;
  urlImg: string;
  user_status: string;
  winrate: number;
  recvInvitesFrom: number;
}

// --------------------------- Channels :

export interface PublicChannelDto {
  id: number;
  channel_name: string;
  priv_msg: boolean;
}

export interface ChannelInfos {
  id: number;
  name: string;
  type: string;
}

export interface ChannelMessage {
  sender_id: number;
  sender_urlImg: string;
  sender_username: string;
  message_content: string;
  channel_id: number;
}

export interface IChatUser {
  sender_id: number;
  sender_urlImg: string;
  sender_username: string;
  channel_id: number;
}

export interface ChannelUsers {
  id: number;
  username: string;
  urlImg: string;
  type: string;
}

export interface SocketMessage {
  name: string;
  id: number;
}

export interface ChannelPublic {
  channel_id: number,
  channel_name: string,
  channel_status: string,
  channel_priv_msg: boolean,
  owner_id: number
}

export interface ChannelPublicPass {
  id: number,
  channel_name: string,
  chan_status: string,
  priv_msg: boolean,
  has_password: boolean
}

// --------------------------- LeaderBoard & Profil :

export interface UserInfos {
  id: number;
  urlImg: string;
  username: string;
}

export interface IUser {
  id: number;
  username: string;
  urlImg: string;
  user_status: 'on' | 'off' | 'in_game';
  winrate: number;
  elo: number;
  gamesPlayed:number;
  rank:number;
  is_friend: boolean;
  sentInvitesTo: number[];
  recvInvitesFrom: number[];
  friends: number[];
  blocked: number[];
  last_msg_date: Date;
  gamesId: number[];
}

export interface GameHistory{
    id: number;
    user: string;
    idUser: number;
    urlImgUser: string;
    eloUser: number;
    scoreUser: number;
    opponent: string;
    idOpponent: number;
    urlImgOpponent: string;
    eloOpponent: number;
    scoreOpponent: number;
    date: Date;
  
}

export interface UserButtonsProps {
  id: number | undefined;
}

// --------------------------- Notifs :

export interface NotificationBadgeProps {
  showBadge: boolean;
}

export interface NotifMsg {
  id: number;
  sender_id: number,
  channel_id: number,
  channel_name: string;
  message_content: string;
  sender_username: string,
  sender_urlImg: string,
  priv_msg: boolean,
  socket: Socket
}


// --------------------------- Notifs :

// export interface PwdModif {
//   password: string;
// }

export interface Modifications {
  img: string | File;
  password: string | undefined;
  confirmpwd: string | undefined;
  is2fa_active: boolean | undefined;
}

export interface settingInfos {
  urlImg: string;
  is2fa_active: boolean;
  username: string;
}

export interface UserInfosForSetting {
  urlImg: string;
  is2fa_active: boolean;
  username: string;
}

// --------------------------- Switch Toggle :

export interface SwitchToggleProps {
  onChange: (checked: boolean) => void; // Fonction de rappel
  checked: boolean;
}
