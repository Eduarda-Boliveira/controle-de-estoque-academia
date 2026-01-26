import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsNumber({}, { message: 'Preço deve ser um número válido' })
  @Min(0, { message: 'Preço deve ser maior que zero' })
  @Transform(({ value }) => parseFloat(value))
  price: number;
}