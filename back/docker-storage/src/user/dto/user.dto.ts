import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from "class-validator";
import { UserRoleEnum, UserStateEnum } from "../../utils/enums/user.enum";
import { Type } from "class-transformer";


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
    @IsBoolean()
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
    @IsNumber()
    winrate: number;

}

export class PublicProfileDto {
    
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    urlImg!: string;

    @IsNotEmpty()
    @IsEnum(UserStateEnum)
    user_status: UserStateEnum;

    @IsNotEmpty()
    @IsNumber()
    winrate: number;

    @IsNotEmpty()
    @IsBoolean()
    is_friend: boolean;
}
