import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductService } from '../products/services';
import { ProductCategory } from '../products/entities/product.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productService = app.get(ProductService);

  try {
    const products = [
      {
        name: 'Monster Energy',
        price: 12.0,
        stock: 10,
        minStock: 1,
        category: ProductCategory.BEBIDA_ENERGETICA,
      },
      {
        name: 'Água',
        price: 3.00,
        stock: 10,
        minStock: 1,
        category: ProductCategory.BEBIDA_NATURAL,
      },
      {
        name: 'Powerade',
        price: 7.00,
        stock: 10,
        minStock: 1,
        category: ProductCategory.BEBIDA_ESPORTIVA,
      },
    ];

    for (const productData of products) {
      try {
        await productService.create(productData);
        console.log(`Produto criado: ${productData.name}`);
      } catch (error) {
        console.log(`Erro ao criar produto ${productData.name}:`, error.message);
      }
    }

    console.log('Seed executado com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    await app.close();
  }
}

seed();