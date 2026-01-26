import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { AddCircle, List, BarChart } from '@mui/icons-material';
import { MainLayout } from '../components/templates';
import { ProductForm } from '../components/molecules';
import { StatsPanel, SalesTable } from '../components/organisms';
import { Card } from '../components/atoms';
import { productService } from '../services/productService';
import { Product, Sale, PaymentMethod, SummaryTotals } from '../types';
import jsPDF from 'jspdf';

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
  const [emailDialog, setEmailDialog] = useState({ open: false, email: '', sendEmail: false });

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
    if (sales.length === 0) {
      setSnackbar({
        open: true,
        message: 'Não há vendas para gerar relatório!',
        severity: 'error'
      });
      return;
    }

// Abrir dialog para escolher se quer enviar por email
    setEmailDialog({ open: true, email: '', sendEmail: false });
  };

  const handleConfirmReport = async () => {
    try {
      const reportData = {
        sales: sales.map(sale => ({
          date: sale.date,
          productName: sale.productName,
          value: sale.value,
          paymentMethod: sale.paymentMethod,
        })),
        totals: {
          general: totals.general,
          dinheiro: totals.dinheiro,
          debito: totals.debito,
          credito: totals.credito,
          pix: totals.pix,
        }
      };

      // Se escolheu enviar por email
      if (emailDialog.sendEmail && emailDialog.email) {
        await productService.sendReportByEmail(reportData, emailDialog.email);
        setSnackbar({
          open: true,
          message: `Relatório enviado com sucesso para ${emailDialog.email}!`,
          severity: 'success'
        });
      } else {
        // Gerar PDF local
        const doc = new jsPDF();
        const today = new Date();
        const dateStr = today.toLocaleDateString('pt-BR');
        const timeStr = today.toLocaleTimeString('pt-BR');
        
        // Título
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('RELATÓRIO DE VENDAS', 20, 30);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Data: ${dateStr} - ${timeStr}`, 20, 45);
        
        // Linha separadora
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);
        
        // Resumo Geral
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('RESUMO GERAL', 20, 70);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Total de Vendas: ${sales.length}`, 20, 85);
        doc.text(`Faturamento Total: R$ ${totals.general.toFixed(2).replace('.', ',')}`, 20, 95);
        
        // Detalhamento por forma de pagamento
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('DETALHAMENTO POR FORMA DE PAGAMENTO', 20, 115);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        let yPosition = 130;
        
        doc.text(`Dinheiro: R$ ${totals.dinheiro.toFixed(2).replace('.', ',')}`, 30, yPosition);
        doc.text(`Débito: R$ ${totals.debito.toFixed(2).replace('.', ',')}`, 30, yPosition + 10);
        doc.text(`Crédito: R$ ${totals.credito.toFixed(2).replace('.', ',')}`, 30, yPosition + 20);
        doc.text(`PIX: R$ ${totals.pix.toFixed(2).replace('.', ',')}`, 30, yPosition + 30);
        
        yPosition += 50;
        
        // Vendas Detalhadas
        if (sales.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.text('VENDAS DETALHADAS', 20, yPosition);
          
          yPosition += 20;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          
          sales.forEach((sale, index) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 30;
            }
            
            doc.text(`${index + 1}. ${sale.date} - ${sale.productName}`, 25, yPosition);
            doc.text(`   Valor: ${sale.value} | Pagamento: ${sale.paymentMethod}`, 25, yPosition + 8);
            yPosition += 20;
          });
        }
        
        // Rodapé
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.text(`Sistema de Controle de Estoque - Página ${i} de ${pageCount}`, 20, 285);
        }
        
        // Salvar o PDF
        const fileName = `relatorio-vendas-${today.toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        setSnackbar({
          open: true,
          message: `Relatório PDF gerado e baixado com sucesso! (${fileName})`,
          severity: 'success'
        });
      }
      
      setEmailDialog({ open: false, email: '', sendEmail: false });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao processar o relatório. Tente novamente.',
        severity: 'error'
      });
      setEmailDialog({ open: false, email: '', sendEmail: false });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <MainLayout>

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

      <Dialog 
        open={emailDialog.open} 
        onClose={() => setEmailDialog({ open: false, email: '', sendEmail: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Gerar Relatório de Vendas
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={emailDialog.sendEmail}
                  onChange={(e) => setEmailDialog(prev => ({ ...prev, sendEmail: e.target.checked }))}
                />
              }
              label="Enviar relatório por email"
            />
            
            {emailDialog.sendEmail && (
              <TextField
                fullWidth
                type="email"
                label="Email de destino"
                value={emailDialog.email}
                onChange={(e) => setEmailDialog(prev => ({ ...prev, email: e.target.value }))}
                margin="normal"
                placeholder="exemplo@email.com"
                required
              />
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {emailDialog.sendEmail 
                ? ' O relatório será enviado por email com o PDF anexado.'
                : ' O relatório será baixado diretamente como PDF.'
              }
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEmailDialog({ open: false, email: '', sendEmail: false })}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmReport}
            variant="contained"
            disabled={emailDialog.sendEmail && !emailDialog.email}
            sx={{ 
              background: 'linear-gradient(90deg, #ffa559, #f27043)',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff8c42, #e85d2c)',
              }
            }}
          >
            {emailDialog.sendEmail ? 'Enviar Email' : 'Baixar PDF'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};