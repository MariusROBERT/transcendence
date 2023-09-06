import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from "class-validator";
import { ChanStateEnum } from "../enums/channel.enum";

// USER :

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    urlImg!: string;

    @IsOptional()
    is2fa_active!: boolean;

}

// CHANNEL :

export class CreateChannelDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional() // because public by default
    @IsEnum(ChanStateEnum)
    chan_status: ChanStateEnum;
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
    
}

// MESSAGES :

export class CreateMessageDto {
    
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    senderId: number; // L'ID de l'utilisateur expéditeur
    
    @IsNotEmpty()
    @IsNumber()
    channelId: number; // L'ID du canal auquel le message est associé
}
