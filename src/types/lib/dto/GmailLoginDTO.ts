import { IsEmail, IsNotEmpty } from 'class-validator';

export class GmailLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
