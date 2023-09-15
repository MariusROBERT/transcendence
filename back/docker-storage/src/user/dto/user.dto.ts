import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { UserRoleEnum, UserStateEnum } from '../../utils/enums/user.enum';
import { Type } from 'class-transformer';
import { UserEntity } from 'src/database/entities/user.entity';
import { ChanStateEnum } from 'src/utils/enums/channel.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  password: string;

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
  password: string;

  @IsEnum(ChanStateEnum)
  @IsNotEmpty()
  chan_status: ChanStateEnum;
}

export class PublicProfileDto {
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

  @IsNotEmpty()
  @IsBoolean()
  is_friend: boolean;
}
