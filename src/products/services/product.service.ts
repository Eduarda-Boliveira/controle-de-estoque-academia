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

    // Definir valores padrão
    const productData = {
      ...createProductDto,
      minStock: createProductDto.minStock || 5,
      active: createProductDto.active !== undefined ? createProductDto.active : true,
    };

    const product = await this.productRepository.create(productData);
    return product;
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const products = await this.productRepository.findAll(filters);
    return products;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
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
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado`);
    }

    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('Não foi possível remover o produto');
    }
  }

  async getStockSummary() {
    return this.productRepository.getStockSummary();
  }
}