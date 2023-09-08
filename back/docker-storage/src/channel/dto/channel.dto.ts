import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, isNotEmpty } from "class-validator";
import { ChanStateEnum } from "../../utils/enums/channel.enum";
import { UserEntity } from "src/database/entities/user.entity";


// CHANNEL :

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
    owner: UserEntity
}

// GET CHANNEL AND DISPLAY INFO
export class ChannelDto {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    channel_name: string;

    @IsOptional() // because public by default
    @IsEnum(ChanStateEnum)
    chan_status: ChanStateEnum;

    @IsOptional()
    @IsNotEmpty()
    password: string;


}

export class UpdateChannelDto {

    @IsOptional()
    @IsString()
    channel_name: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional() // because public by default
    @IsEnum(ChanStateEnum)
    chan_status: ChanStateEnum;

    @IsOptional()
    owner_id: UserEntity

}
