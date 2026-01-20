import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { AddCircle, List, BarChart } from '@mui/icons-material';
import { MainLayout } from '../components/templates';
import { ProductForm } from '../components/molecules';
import { StatsPanel, SalesTable } from '../components/organisms';
import { Card } from '../components/atoms';
import { productService } from '../services/productService';
import { Product, Sale, PaymentMethod, SummaryTotals } from '../types';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [totals, setTotals] = useState<SummaryTotals>({
    general: 0,
    dinheiro: 0,
    debito: 0,
    credito: 0,
    pix: 0,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [sales]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await productService.getAll();
      setProducts(fetchedProducts);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar produtos. Verifique se o servidor está rodando.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const newTotals: SummaryTotals = {
      general: 0,
      dinheiro: 0,
      debito: 0,
      credito: 0,
      pix: 0,
    };

    sales.forEach(sale => {
      const value = parseFloat(sale.value.replace('R$', '').replace(',', '.').trim());
      newTotals.general += value;
      
      const method = sale.paymentMethod.toLowerCase() as keyof SummaryTotals;
      if (method !== 'general') {
        newTotals[method] += value;
      }
    });

    setTotals(newTotals);
  };

  const handleAddSale = (productId: number, paymentMethod: PaymentMethod, price: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newSale: Sale = {
      productName: product.name,
      value: price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
      date: new Date().toLocaleDateString('pt-BR'),
    };

    setSales(prev => [...prev, newSale]);
    setSnackbar({
      open: true,
      message: `Venda de ${product.name} adicionada com sucesso!`,
      severity: 'success'
    });
  };

  const handleRemoveSale = (index: number) => {
    setSales(prev => prev.filter((_, i) => i !== index));
    setSnackbar({
      open: true,
      message: 'Venda removida com sucesso!',
      severity: 'success'
    });
  };

  const handleGenerateReport = () => {
    const reportData = {
      vendas: sales.length,
      faturamento: totals.general,
      detalhePorMetodo: {
        dinheiro: totals.dinheiro,
        debito: totals.debito,
        credito: totals.credito,
        pix: totals.pix,
      },
      vendas_detalhadas: sales,
    };
    
    console.log('📊 Relatório de Vendas:', reportData);
    setSnackbar({
      open: true,
      message: 'Relatório gerado! Verifique o console do navegador.',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <MainLayout>
      {/* Seção Adicionar Produto */}
      <Card sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 3
          }}
        >
          <AddCircle sx={{ color: 'black' }} />
          Adicionar Produto
        </Typography>
        
        <ProductForm
          products={products}
          onSubmit={handleAddSale}
          loading={loading}
        />
      </Card>

      {/* Seção Produtos Vendidos */}
      <Card sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 3
          }}
        >
          <List sx={{ color: 'black' }} />
          Produtos Vendidos
        </Typography>
        
        <SalesTable
          sales={sales}
          onRemoveSale={handleRemoveSale}
        />
      </Card>

      {/* Seção Painel de Recebimento */}
      <Card>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 3
          }}
        >
          <BarChart sx={{ color: 'black' }} />
          Painel de Recebimento
        </Typography>
        
        <StatsPanel
          totals={totals}
          onGenerateReport={handleGenerateReport}
        />
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};