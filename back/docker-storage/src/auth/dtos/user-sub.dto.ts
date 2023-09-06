import { IsEmail, IsNotEmpty } from "class-validator";

export class UserSubDto {

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

}