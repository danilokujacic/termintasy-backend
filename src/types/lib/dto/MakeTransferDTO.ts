import { IsNotEmpty } from 'class-validator';

export class MakeTransferDTO {
  @IsNotEmpty()
  players: number[];

  @IsNotEmpty()
  playersToReceive: number[];
}
