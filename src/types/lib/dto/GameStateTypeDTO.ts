import { IsNotEmpty } from 'class-validator';

enum GameStat {
  GOAL = 'goal',
  ASSIST = 'assists',
  CLEANSHEET = 'cleanSheet',
  SAVE = 'saves',
  PLAYED = 'played',
}

export class GameStatTypeDTO {
  @IsNotEmpty()
  type: GameStat;

  @IsNotEmpty()
  value: number;
}
