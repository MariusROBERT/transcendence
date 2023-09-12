import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from "class-validator";
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

    @IsNotEmpty()
    owner: UserEntity

    @IsNotEmpty()
    admin: UserEntity[];

    @IsNotEmpty()
    priv_msg: boolean;
}

// GET CHANNEL AND DISPLAY INFO
export class ChannelDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional() // because public by default
    @IsEnum(ChanStateEnum)
    chan_status: ChanStateEnum;
}

export class UpdateChannelDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    owner: UserEntity

    @IsOptional()
    admin: UserEntity[];
}
