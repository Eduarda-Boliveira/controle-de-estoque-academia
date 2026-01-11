import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { Product, ProductCategory } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface ProductFilters {
  category?: ProductCategory;
  active?: boolean;
  lowStock?: boolean;
  search?: string;
}

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.repository.create(createProductDto);
    return this.repository.save(product);
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const options: FindManyOptions<Product> = {
      order: { createdAt: 'DESC' },
    };

    if (filters) {
      const where: any = {};
      
      if (filters.category) {
        where.category = filters.category;
      }
      
      if (filters.active !== undefined) {
        where.active = filters.active;
      }
      
      if (filters.search) {
        // Busca por nome ou descrição
        where.name = Like(`%${filters.search}%`);
      }
      
      options.where = where;
    }

    return this.repository.find(options);
  }

  async findAllLowStock(): Promise<Product[]> {
    return this.repository
      .createQueryBuilder('product')
      .where('product.stock <= product.minStock')
      .andWhere('product.active = :active', { active: true })
      .orderBy('product.stock', 'ASC')
      .getMany();
  }

  async findById(id: string): Promise<Product | null> {
    const options: FindOneOptions<Product> = {
      where: { id },
    };
    return this.repository.findOne(options);
  }

  async findByName(name: string): Promise<Product | null> {
    const options: FindOneOptions<Product> = {
      where: { name },
    };
    return this.repository.findOne(options);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    await this.repository.update(id, updateProductDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async updateStock(id: string, quantity: number, operation: 'add' | 'subtract'): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }

    if (operation === 'add') {
      product.stock += quantity;
    } else {
      product.stock = Math.max(0, product.stock - quantity);
    }

    return this.repository.save(product);
  }

  async getStockSummary(): Promise<{
    total: number;
    lowStock: number;
    outOfStock: number;
    byCategory: Record<ProductCategory, number>;
  }> {
    const products = await this.findAll({ active: true });
    
    const summary = {
      total: products.length,
      lowStock: 0,
      outOfStock: 0,
      byCategory: {
        [ProductCategory.BEBIDA_ENERGETICA]: 0,
        [ProductCategory.BEBIDA_NATURAL]: 0,
        [ProductCategory.BEBIDA_ESPORTIVA]: 0,
      },
    };

    products.forEach(product => {
      if (product.stock === 0) {
        summary.outOfStock++;
      } else if (product.stock <= product.minStock) {
        summary.lowStock++;
      }
      summary.byCategory[product.category]++;
    });

    return summary;
  }
}