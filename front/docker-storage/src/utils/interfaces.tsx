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
  invites: number;
}

// --------------------------- LeaderBoard & Profil :

export interface UserInfos {
  id: number;
  urlImg: string;
  is2fa_active: boolean;
  username: string;
  invited: number[];
}

export interface IUser {
  id: number;
  username: string;
  urlImg: string;
  user_status: string;
  winrate: number;
  is_friend: boolean;
  invited: number[];
  invites: number[];
}

export interface IUserComplete {
  id: number;
  username: string;
  urlImg: string;
  user_status: string;
  role: string
  winrate: number;
  is_friend: boolean;
  invited: number[];
  invites: number[];
  friends: number[];
  blocked: number[];
}

export interface LeaderboardProps {
  isVisible: boolean,
  setIsVisible: (b:boolean) => void,
  searchTerm: string;
  meUser?: IUserComplete;
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
