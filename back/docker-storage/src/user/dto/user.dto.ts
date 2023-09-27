import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum, UserStateEnum } from '../../utils/enums/user.enum';
import { Column } from 'typeorm';

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
  @IsEnum(UserStateEnum)
  user_status: UserStateEnum;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  user_role: UserRoleEnum;

  @IsOptional()
  @IsNumber()
  winrate: number;
}

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
}

export class UpdatePwdDto {
  @IsString()
  password: string;
}

export class GetUserIdFromSocketIdDto {
  @IsNotEmpty()
  @IsString()
  socketId: string;
}

export class UserGameStatus {
  @IsNumber()
  isInGameWith: number;

  @IsNumber()
  gameInvitationTo: number;

  @IsNumber()
  gameInvitationFrom: number;
}