import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ChanStateEnum } from '../../utils/enums/channel.enum';
import { UserEntity } from '../../database/entities/user.entity';

// ------- public :
export class PublicChannelDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  channel_name: string;
  
  @IsOptional()
  chan_status: ChanStateEnum;
  
  @IsNotEmpty()
  @IsBoolean()
  priv_msg: boolean;
  
  @IsOptional()
  @IsBoolean()
  has_password: boolean;
  
  @IsOptional()
  @IsNumber()
  owner_id: number;
  
  @IsOptional()
  @IsString()
  owner_username: string;
}

// ------- name :
export class ChannelNameDto {
  @IsNotEmpty()
  @IsString()
  channel_name: string;
}

// ------- create :
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

// ------- password :
export class PassChannelDto {
  @IsOptional()
  @IsString()
  password: string;
}

// ------- update :
export class EditChannelDto {
  @IsString()
  @Length(0, 300)
  password: string;

  @IsNotEmpty()
  @IsEnum(ChanStateEnum)
  chan_status: ChanStateEnum;
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
