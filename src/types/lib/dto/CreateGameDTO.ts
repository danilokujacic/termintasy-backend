import { IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGameTeamDTO } from './CreateGameTeamDTO';

export class CreateGameDTO {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateGameTeamDTO)
  homeTeam: CreateGameTeamDTO;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateGameTeamDTO)
  awayTeam: CreateGameTeamDTO;

  @IsNotEmpty()
  gameDate: string;
}
