import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ChanStateEnum } from '../../utils/enums/channel.enum';
import { UserEntity } from '../../database/entities/user.entity';

// CHANNEL :

export class ChannelNameDto {
  @IsNotEmpty()
  @IsString()
  channel_name: string;
}

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  channel_name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional() // because public by default
  @IsEnum(ChanStateEnum)
  chan_status: ChanStateEnum;

  @IsOptional()
  admin: UserEntity[];

  @IsNotEmpty()
  priv_msg: boolean;
}

export class PassChannelDto {
  @IsOptional()
  @IsString()
  password: string;
}

export class EditChannelDto {
  @IsString()
  @Length(0, 300)
  password: string;

  @IsNotEmpty()
  @IsEnum(ChanStateEnum)
  chan_status: ChanStateEnum
}

// GET CHANNEL AND DISPLAY INFO
export class ChannelDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ChanStateEnum)
  chan_status: ChanStateEnum;

  @IsNotEmpty()
  owner_id: UserEntity;
}

export class UpdateChannelDto {
  @IsNotEmpty()
  @IsString()
  channel_name: string;
  @IsNotEmpty()
  priv: boolean;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional() // because public by default
  @IsEnum(ChanStateEnum)
  chan_status: ChanStateEnum;

  @IsOptional()
  owner_id: UserEntity;

  @IsOptional()
  admins: UserEntity[];
}
