import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProductCategory {
  BEBIDA_ENERGETICA = 'BEBIDA_ENERGETICA',
  BEBIDA_NATURAL = 'BEBIDA_NATURAL',
  BEBIDA_ESPORTIVA = 'BEBIDA_ESPORTIVA',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  stock: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  minStock: number;

  @Column({
    type: 'varchar',
    enum: ProductCategory,
    nullable: false,
  })
  category: ProductCategory;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}