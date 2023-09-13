import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsEnum,
    IsDate,
} from 'class-validator';
import { UserEntity } from '../../database/entities/user.entity';
import { ChannelEntity } from '../../database/entities/channel.entity';

export class AddMutedDto {
    @IsNotEmpty()
    user: UserEntity;

    @IsNotEmpty()
    channel: ChannelEntity;

    @IsNotEmpty()
    @IsDate()
    endDate: Date;
}
