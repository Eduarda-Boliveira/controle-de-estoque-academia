import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { EmailModule } from './email';
import { PrismaService } from './prisma';

@Module({
  imports: [
    ProductsModule,
    EmailModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}