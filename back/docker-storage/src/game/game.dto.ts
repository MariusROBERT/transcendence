import {
    IsNotEmpty,
    IsNumber,
    IsString,

  } from 'class-validator';

export class PublicGameDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
  
    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsNumber()
    idUser: number;
  
    @IsNotEmpty()
    @IsString()
    urlImgUser: string;

    @IsNumber()
    @IsNotEmpty()
    eloUser: number;

    @IsNumber()
    @IsNotEmpty()
    scoreUser: number;

    @IsNotEmpty()
    @IsString()
    opponent: string;

    @IsNotEmpty()
    @IsNumber()
    idOpponent: number;

    @IsNotEmpty()
    @IsString()
    urlImgOpponent: string;

    @IsNumber()
    @IsNotEmpty()
    eloOpponent: number;

    @IsNumber()
    @IsNotEmpty()
    scoreOpponent: number;
  
    @IsNotEmpty()
    date: Date;
  }