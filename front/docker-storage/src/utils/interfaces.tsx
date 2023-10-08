// --------------------------- Auth :

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
  is_friend: boolean;
  recvInvitesFrom: number;
}

// --------------------------- Channels :

export interface ChannelInfos {
  id: number;
  name: string;
  type: string;
}

//  Use later for a function
export interface ChannelCreate {
  channel_name: string;
  priv_msg: boolean;
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
  user_status: string;
  winrate: number;
  is_friend: boolean;
  sentInvitesTo: number[];
  recvInvitesFrom: number[];
  friends: number[];
  blocked: number[];
}

export interface LeaderboardProps {
  //isVisible: boolean;
  //setIsVisible: (b: boolean) => void;
  searchTerm: string;
}


export interface UserButtonsProps {
  id: number | undefined;
}

// --------------------------- Notifs :

export interface NotificationBadgeProps {
  showBadge: boolean;
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
