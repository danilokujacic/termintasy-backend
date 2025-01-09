import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreateGameTeamDTO {
  name: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  players: number[];
}
