import { IsNotEmpty, IsString } from 'class-validator';

export enum Position {
  GK = 'GK',
  DEF = 'DEF',
  MID = 'MID',
  ATK = 'ATK',
}

export class CreatePlayerDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  position: Position;
}
