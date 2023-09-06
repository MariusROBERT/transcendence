import { IsNotEmpty } from "class-validator";

export class LoginCreditDto {

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

}