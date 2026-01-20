import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
  SxProps,
  Theme,
} from '@mui/material';
import { SelectOption } from '../../../types';

export interface SelectProps {
  label: string;
  value: string | number;
  options: SelectOption[];
  onChange: (value: string | number, event: SelectChangeEvent) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';  sx?: SxProps<Theme>;}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  error = false,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  placeholder,
  size = 'medium',
  variant = 'outlined',
  sx,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value, event);
  };

  return (
    <FormControl 
      fullWidth={fullWidth} 
      error={error} 
      disabled={disabled}
      size={size}
      variant={variant}
      sx={sx}
    >
      <InputLabel 
        required={required}
        shrink={Boolean(value) || Boolean(placeholder)}
      >
        {label}
      </InputLabel>
      <MuiSelect
        value={value.toString()}
        label={label}
        onChange={handleChange}
        displayEmpty={Boolean(placeholder)}
        notched={Boolean(value) || Boolean(placeholder)}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value.toString()}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};