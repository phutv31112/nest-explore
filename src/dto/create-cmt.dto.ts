import { IsNotEmpty } from 'class-validator';

export class CreateCmtDto {
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  productId: number;
}
