import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum, UserStateEnum } from '../../utils/enums/user.enum';

// ----- update :
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  urlImg!: string;

  @IsOptional()
  @IsBoolean()
  is2fa_active!: boolean;

  @IsOptional()
  @IsString()
  secret2fa: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  user_role: UserRoleEnum;

  @IsOptional()
  @IsNumber()
  winrate: number;
}

// ----- channel :
export class UserChanDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class UserAddChanDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  password: string;
}

// ----- public :
export class PublicProfileDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  socketId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  urlImg: string;

  @IsNotEmpty()
  @IsEnum(UserStateEnum)
  user_status: UserStateEnum;

  @IsNotEmpty()
  @IsNumber()
  winrate: number;

  @IsNotEmpty()
  @IsBoolean()
  is_friend: boolean;

  @IsNumber()
  @IsNotEmpty()
  gamesPlayed: number;

  @IsNumber()
  @IsNotEmpty()
  elo: number;

  @IsNumber()
  @IsNotEmpty()
  rank: number;

  @IsNotEmpty()
  gamesId: number[];
}

// ----- private :
export class OwnProfileDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  urlImg: string;

  @IsNotEmpty()
  @IsEnum(UserStateEnum)
  user_status: UserStateEnum;

  @IsNotEmpty()
  @IsNumber()
  winrate: number;

  @IsNumber()
  @IsNotEmpty()
  gamesPlayed: number;

  @IsNumber()
  @IsNotEmpty()
  elo: number;

  @IsNumber()
  @IsNotEmpty()
  rank: number;

  @IsNumber()
  @IsNotEmpty()
  friends: number[];

  @IsNumber()
  @IsNotEmpty()
  recvInvitesFrom: number[];

  @IsNumber()
  @IsNotEmpty()
  sentInvitesTo: number[];

  @IsNumber()
  @IsNotEmpty()
  blocked: number[];

  @IsNotEmpty()
  gamesId: number[];
}

// ----- password :
export class UpdatePwdDto {
  @IsString()
  newPassword: string;

  @IsString()
  oldPassword: string;
}

// ----- socket :
export class GetUserIdFromSocketIdDto {
  @IsNotEmpty()
  @IsString()
  socketId: string;
}

// ----- game :
export class UserGameStatus {
  @IsNumber()
  gameInvitationTo: number;

  @IsNumber()
  gameInvitationFrom: number;

  @IsString()
  gameInviteType: string;
}
