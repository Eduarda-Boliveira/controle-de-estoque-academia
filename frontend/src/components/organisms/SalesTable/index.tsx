import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Sale } from '../../../types';

interface SalesTableProps {
  sales: Sale[];
  onRemoveSale: (index: number) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onRemoveSale,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de vendas">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#ffa559' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              DESCRIÇÃO
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              VALOR
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              CATEGORIA
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              DATA
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              AÇÕES
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Nenhuma venda registrada ainda.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale, index) => (
            <TableRow
              key={index}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <TableCell component="th" scope="row">
                <Typography variant="body2" fontWeight="medium">
                  {sale.productName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.primary" fontWeight="bold">
                  {sale.value}
                </Typography>
              </TableCell>
              <TableCell>
                <Box
                  component="span"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: '#ffa559',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'medium',
                  }}
                >
                  {sale.paymentMethod}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {sale.date}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => onRemoveSale(index)}
                  color="error"
                  size="small"
                  aria-label="remover venda"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};