import { IsNotEmpty, IsString } from 'class-validator';
import { ChannelEntity } from '../../database/entities/channel.entity';
import { UserEntity } from '../../database/entities/user.entity';

export class AddMsgDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  sender: UserEntity;

  @IsNotEmpty()
  channel: ChannelEntity;
}
