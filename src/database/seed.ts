import { PrismaService } from '../prisma';

async function seed() {
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  try {
    const products = [
      {
        name: 'Monster Energy',
        price: 12.0,
      },
      {
        name: 'Água',
        price: 3.00,
      },
      {
        name: 'Powerade',
        price: 7.00,
      },
    ];

    for (const productData of products) {
      try {
        await prisma.product.create({ data: productData });
        console.log(`Produto criado: ${productData.name}`);
      } catch (error) {
        console.log(`Erro ao criar produto ${productData.name}:`, error.message);
      }
    }

    console.log('Seed executado com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    await prisma.onModuleDestroy();
  }
}

seed();