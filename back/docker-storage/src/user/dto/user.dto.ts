import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from "class-validator";
import { ChanStateEnum } from "../../utils/enums/channel.enum";
import { UserRoleEnum, UserStateEnum } from "../../utils/enums/user.enum";


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

    @IsOptional()
    @IsString()
    secret2fa: string;

    @IsOptional()
    @IsEnum(UserStateEnum)
    user_status: UserStateEnum;

    @IsOptional()
    @IsEnum(UserRoleEnum)
    user_role: UserRoleEnum;

    @IsOptional()
    @IsString()
    salt: string;

}