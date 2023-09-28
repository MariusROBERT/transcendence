import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ftLoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  urlImg: string;

  @IsNotEmpty()
  @IsNumber()
  id42: number;
}