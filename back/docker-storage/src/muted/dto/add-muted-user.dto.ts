import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';
import { ChanStateEnum } from '../../utils/enums/channel.enum';
import { UserEntity } from 'src/database/entities/user.entity';
import { ChannelEntity } from 'src/database/entities/channel.entity';

export class AddMutedDto {
  @IsNotEmpty()
  user: UserEntity;

  @IsNotEmpty()
  channel: ChannelEntity;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
