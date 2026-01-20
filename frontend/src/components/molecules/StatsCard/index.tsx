import React from 'react';
import { Typography, Box } from '@mui/material';
import { Card } from '../../atoms';

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  variant = 'default',
  subtitle,
}) => {
  // Definir cor do valor baseado no título
  const getValueColor = () => {
    if (title.includes('Recebimento Total')) {
      return '#4ade80'; // Verde para o total
    }
    return '#212529'; // Preto para todos os outros
  };

  // Definir estilo da borda lateral para cards do painel de recebimento
  const getBorderStyle = () => {
    if (title.includes('Recebimento Total')) {
      return { borderTop: '4px solid #4ade80' }; // Verde
    }
    if (title.includes('Dinheiro') || title.includes('Débito') || title.includes('Crédito') || title.includes('PIX')) {
      return { borderTop: '4px solid #ffa559' }; // Laranja
    }
    return {}; // Sem borda para outros cards
  };

  return (
    <Card variant="default" padding="medium" sx={getBorderStyle()}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>
            {icon && (
              <Box component="span" sx={{ mr: 1, display: 'inline-flex', alignItems: 'center' }}>
                {icon}
              </Box>
            )}
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="div" 
            fontWeight="bold" 
            sx={{ color: getValueColor() }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};