import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { ProductRepository, ProductFilters } from '../repositories';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar se já existe um produto com o mesmo nome
    const existingProduct = await this.productRepository.findByName(createProductDto.name);
    if (existingProduct) {
      throw new ConflictException(`Produto com nome "${createProductDto.name}" já existe`);
    }

    const product = await this.productRepository.create(createProductDto);
    return product;
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const products = await this.productRepository.findAll(filters);
    return products;
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado`);
    }

    // Se está tentando atualizar o nome, verificar se não conflita com outro produto
    if (updateProductDto.name && updateProductDto.name !== existingProduct.name) {
      const duplicateProduct = await this.productRepository.findByName(updateProductDto.name);
      if (duplicateProduct) {
        throw new ConflictException(`Produto com nome "${updateProductDto.name}" já existe`);
      }
    }

    const updatedProduct = await this.productRepository.update(id, updateProductDto);
    if (!updatedProduct) {
      throw new BadRequestException('Não foi possível atualizar o produto');
    }
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado`);
    }

    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('Não foi possível remover o produto');
    }
  }
}