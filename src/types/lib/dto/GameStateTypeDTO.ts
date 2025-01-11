import { IsNotEmpty } from 'class-validator';

enum GameStat {
  GOAL = 'goal',
  ASSIST = 'assists',
  CLEANSHEET = 'cleanSheet',
  SAVE = 'saves',
  PLAYED = 'played',
}

enum Action {
  INCREASE = 'increase',
  DECREASE = 'decrease',
}

export class GameStatTypeDTO {
  @IsNotEmpty()
  gameStat: GameStat;

  @IsNotEmpty()
  action: Action;
}
