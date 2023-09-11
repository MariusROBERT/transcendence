import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { ChannelEntity } from "src/database/entities/channel.entity";
import { UserEntity } from "src/database/entities/user.entity";

export class AddMsgDto {

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    sender: UserEntity;

    @IsNotEmpty()
    channel: ChannelEntity;

    @IsNotEmpty()
    @IsDate()
    date: Date;

}
