// --------------------------- Auth :

import { Socket } from 'socket.io-client';

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
  sender_pseudo: string;
  message_content: string;
  channel_id: number;
}

export interface IChatUser {
  sender_id: number;
  sender_urlImg: string;
  sender_pseudo: string;
  channel_id: number;
}

export interface ChannelUsers {
  id: number;
  pseudo: string;
  urlImg: string;
  type: string;
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

export interface IUser {
  id: number;
  pseudo: string;
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

// --------------------------- Notifs :

export interface NotifMsg {
  id: number;
  sender_id: number,
  channel_id: number,
  channel_name: string;
  message_content: string;
  sender_pseudo: string,
  sender_urlImg: string,
  priv_msg: boolean,
  socket: Socket
}


// --------------------------- Notifs :

// export interface PwdModif {
//   password: string;
// }

export interface UserInfosForSetting {
  urlImg: string;
  is2fa_active: boolean;
  pseudo: string;
  username?: string;
}

// --------------------------- Switch Toggle :

export interface SwitchToggleProps {
  onChange: (checked: boolean) => void; // Fonction de rappel
  checked: boolean;
}
