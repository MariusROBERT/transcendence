import {
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { UserRoleEnum, UserStateEnum } from 'src/utils/enums/user.enum';

export class UserSubDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
