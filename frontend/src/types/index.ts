export interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface Sale {
  productName: string;
  value: string;
  paymentMethod: string;
  date: string;
}

export type PaymentMethod = 'dinheiro' | 'debito' | 'credito' | 'pix';

export interface SummaryTotals {
  general: number;
  dinheiro: number;
  debito: number;
  credito: number;
  pix: number;
}

export interface SelectOption {
  value: string | number;
  label: string;
}