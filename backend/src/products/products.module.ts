import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { ProductController } from './controllers';
import { ProductService } from './services';
import { ProductRepository } from './repositories';
import { EmailModule } from '../email';

@Module({
  imports: [EmailModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, PrismaService],
  exports: [ProductService, ProductRepository],
})
export class ProductsModule {}