import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum, UserStateEnum } from '../../utils/enums/user.enum';

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

export class SetSocketIdDto {
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @IsNotEmpty()
  @IsEnum(UserStateEnum)
  user_status: UserStateEnum;
}

export class GetUserIdFromSocketIdDto {
  @IsNotEmpty()
  @IsString()
  socketId: string;
}
