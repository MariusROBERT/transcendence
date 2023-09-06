import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRoleEnum, UserStateEnum } from "src/utils/enums/user.enum";

export class UserSubDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEnum(UserRoleEnum)
    user_role: UserRoleEnum;

    @IsEnum(UserStateEnum)
    user_status: UserStateEnum;

    @IsString()
    urlImg: string;

    @IsBoolean()
    is2fa_active!: boolean;

    @IsString()
    secret2fa?: string;

}