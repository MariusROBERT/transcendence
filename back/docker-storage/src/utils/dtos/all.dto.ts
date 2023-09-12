import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from "class-validator";
import { ChanStateEnum } from "../enums/channel.enum";


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
