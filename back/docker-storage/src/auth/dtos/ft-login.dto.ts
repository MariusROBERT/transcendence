import { IsNotEmpty, IsString } from 'class-validator';

export class ftLoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  urlImg: string;
}
