import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  mask?: 'currency' | 'phone' | 'cpf' | 'cnpj';
}

const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const amount = parseFloat(numbers) / 100;
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const Input: React.FC<InputProps> = ({
  startIcon,
  endIcon,
  mask,
  onChange,
  value,
  variant = 'outlined',
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    if (mask === 'currency') {
      newValue = formatCurrency(newValue);
      event.target.value = newValue;
    }

    if (onChange) {
      onChange(event);
    }
  };

  const InputProps = {
    ...(startIcon && {
      startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment>,
    }),
    ...(endIcon && {
      endAdornment: <InputAdornment position="end">{endIcon}</InputAdornment>,
    }),
    ...props.InputProps,
  };

  return (
    <TextField
      variant={variant}
      value={value}
      onChange={handleChange}
      InputProps={InputProps}
      {...props}
    />
  );
};