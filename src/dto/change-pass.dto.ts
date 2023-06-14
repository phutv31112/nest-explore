import { IsNotEmpty } from 'class-validator';

export class ChangePassDto {
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  newPassword: string;
}
