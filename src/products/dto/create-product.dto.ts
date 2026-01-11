import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsNumber({}, { message: 'Preço deve ser um número válido' })
  @Min(0, { message: 'Preço deve ser maior que zero' })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNumber({}, { message: 'Estoque deve ser um número válido' })
  @Min(0, { message: 'Estoque não pode ser negativo' })
  @Transform(({ value }) => parseInt(value))
  stock: number;

  @IsOptional()
  @IsNumber({}, { message: 'Estoque mínimo deve ser um número válido' })
  @Min(0, { message: 'Estoque mínimo não pode ser negativo' })
  @Transform(({ value }) => parseInt(value))
  minStock?: number;

  @IsEnum(ProductCategory, { message: 'Categoria deve ser uma opção válida' })
  category: ProductCategory;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean;
}