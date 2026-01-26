import React from 'react';
import { Box } from '@mui/material';
import {
    AccountBalance,
    AttachMoney,
  CreditCard, 
  QrCode,
  TrendingUp,
  PictureAsPdf
} from '@mui/icons-material';
import { StatsCard } from '../../molecules';
import { Button } from '../../atoms';
import { SummaryTotals } from '../../../types';

interface StatsPanelProps {
  totals: SummaryTotals;
  onGenerateReport?: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  totals,
  onGenerateReport,
}) => {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: 2,
        mb: 3
      }}>
        <StatsCard
          title="Recebimento Total"
          value={formatCurrency(totals.general)}
          icon={<TrendingUp />}
          variant="success"
        />
        
        <StatsCard
          title="Dinheiro"
          value={formatCurrency(totals.dinheiro)}
          icon={<AttachMoney />}
          variant="default"
        />
        
        <StatsCard
          title="Débito"
          value={formatCurrency(totals.debito)}
          icon={<AccountBalance />}
          variant="info"
        />
        
        <StatsCard
          title="Crédito"
          value={formatCurrency(totals.credito)}
          icon={<CreditCard />}
          variant="warning"
        />
        
        <StatsCard
          title="PIX"
          value={formatCurrency(totals.pix)}
          icon={<QrCode />}
          variant="info"
        />

        {onGenerateReport && (
          <Box sx={{
            background: 'linear-gradient(90deg, #ffa559, #f27043)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Button
              variant="text"
              onClick={onGenerateReport}
              startIcon={<PictureAsPdf />}
              sx={{ 
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                width: '100%',
                height: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Gerar PDF
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};