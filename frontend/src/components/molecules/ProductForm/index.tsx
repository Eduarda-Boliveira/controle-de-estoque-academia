import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Button, Select, Input } from '../../atoms';
import { Product, PaymentMethod, SelectOption } from '../../../types';

interface ProductFormProps {
  products: Product[];
  onSubmit: (productId: number, paymentMethod: PaymentMethod, price: number) => void;
  loading?: boolean;
}

const paymentOptions: SelectOption[] = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'debito', label: 'Débito' },
  { value: 'credito', label: 'Crédito' },
  { value: 'pix', label: 'PIX' },
];

export const ProductForm: React.FC<ProductFormProps> = ({
  products,
  onSubmit,
  loading = false,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [price, setPrice] = useState<string>('0,00');

  const productOptions: SelectOption[] = products.map(product => ({
    value: product.id,
    label: product.name,
  }));

  const handleProductChange = (value: string | number) => {
    const productId = value.toString();
    setSelectedProduct(productId);
    
    const product = products.find(p => p.id.toString() === productId);
    if (product) {
      // Converter centavos para reais e formatar
      const priceInReais = product.price / 100;
      // Se o preço for menor que 1 real, garantir formatação com 2 casas
      const formattedPrice = priceInReais.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false, // Remove separadores de milhar para valores pequenos
      });
      setPrice(formattedPrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !paymentMethod || price === '0,00') {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const priceValue = parseFloat(price.replace(',', '.').trim());
    onSubmit(parseInt(selectedProduct), paymentMethod as PaymentMethod, priceValue);

    // Reset form
    setSelectedProduct('');
    setPaymentMethod('');
    setPrice('0,00');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ 
          flex: '1 1 250px', 
          minWidth: '250px'
        }}>
          <Select
            label="Produto"
            value={selectedProduct}
            options={productOptions}
            onChange={handleProductChange}
            placeholder="Selecione o produto"
            required
            sx={{ '& .MuiInputBase-root': { height: '56px', minHeight: '56px' } }}
          />
        </Box>
        
        <Box sx={{ 
          flex: '1 1 150px', 
          minWidth: '150px'
        }}>
          <Input
            label="Valor"
            value={price}
            onChange={(e) => {
              let value = e.target.value;
              // Remove tudo que não for número
              value = value.replace(/[^\d]/g, '');
              
              // Se vazio, define como 0
              if (value === '') value = '0';
              
              // Converte para número e formata com vírgula
              const number = parseFloat(value) / 100;
              const formatted = number.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              
              setPrice(formatted);
            }}
            required
            fullWidth
            sx={{ '& .MuiInputBase-root': { height: '56px' } }}
          />
        </Box>
        
        <Box sx={{ 
          flex: '1 1 200px', 
          minWidth: '200px'
        }}>
          <Select
            label="Forma de Pagamento"
            value={paymentMethod}
            options={paymentOptions}
            onChange={(value) => setPaymentMethod(value.toString())}
            placeholder="Selecione a forma"
            required
            sx={{ '& .MuiInputBase-root': { height: '56px' } }}
          />
        </Box>
        
        <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            sx={{ height: '56px', width: '100%', minHeight: '56px' }}
          >
            {loading ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};