import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  category: string;
}
