import { IsNotEmpty, IsString } from "class-validator";
import { ChannelEntity } from "src/database/entities/channel.entity";
import { UserEntity } from "src/database/entities/user.entity";
import { UserRoleEnum, UserStateEnum } from "src/utils/enums/user.enum";
import { ManyToOne } from "typeorm";

export class AddMsgDto {

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    sender: UserEntity;

    @IsNotEmpty()
    channel: ChannelEntity;

}