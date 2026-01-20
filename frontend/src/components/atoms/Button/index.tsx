import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

interface StyledButtonProps extends MuiButtonProps {
  customVariant?: string;
}

const StyledButton = styled(MuiButton)<StyledButtonProps>(({ theme, customVariant }) => {
  const getVariantStyles = () => {
    switch (customVariant) {
      case 'primary':
        return {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        };
      case 'secondary':
        return {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
          },
        };
      case 'success':
        return {
          backgroundColor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.success.dark,
          },
        };
      case 'warning':
        return {
          backgroundColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.warning.dark,
          },
        };
      case 'error':
        return {
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.error.dark,
          },
        };
      case 'info':
        return {
          backgroundColor: theme.palette.info.main,
          color: theme.palette.info.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.info.dark,
          },
        };
      default:
        return {};
    }
  };

  return {
    ...getVariantStyles(),
  };
});

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  ...props 
}) => {
  const muiVariant = ['outlined', 'text'].includes(variant) 
    ? (variant as 'outlined' | 'text')
    : 'contained';

  return (
    <StyledButton
      variant={muiVariant}
      customVariant={variant}
      {...props}
    >
      {children}
    </StyledButton>
  );
};