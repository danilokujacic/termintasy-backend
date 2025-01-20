import { ArrayMinSize, IsNotEmpty } from 'class-validator';

export class GameTeamTransferDTO {
  @IsNotEmpty()
  @ArrayMinSize(1)
  homePlayers: number[];

  @IsNotEmpty()
  @ArrayMinSize(1)
  awayPlayers: number[];
}
