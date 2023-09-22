import { IsNotEmpty, IsString } from 'class-validator';

export class UserSubDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
