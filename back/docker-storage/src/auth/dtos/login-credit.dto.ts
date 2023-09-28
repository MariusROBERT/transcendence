import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginCreditDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}
