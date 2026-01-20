import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  Typography,
  Box,
  CardActions,
  SxProps,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'success' | 'warning' | 'error' | 'info';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

const StyledCard = styled(MuiCard)<{ customVariant?: string }>(({ theme, customVariant }) => {
  const getVariantStyles = () => {
    switch (customVariant) {
      case 'success':
        return {
          borderLeft: `4px solid ${theme.palette.success.main}`,
          backgroundColor: theme.palette.success.light + '08',
        };
      case 'warning':
        return {
          borderLeft: `4px solid ${theme.palette.warning.main}`,
          backgroundColor: theme.palette.warning.light + '08',
        };
      case 'error':
        return {
          borderLeft: `4px solid ${theme.palette.error.main}`,
          backgroundColor: theme.palette.error.light + '08',
        };
      case 'info':
        return {
          borderLeft: `4px solid ${theme.palette.info.main}`,
          backgroundColor: theme.palette.info.light + '08',
        };
      case 'elevated':
        return {
          boxShadow: theme.shadows[4],
        };
      case 'outlined':
        return {
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        };
      default:
        return {};
    }
  };

  return {
    transition: 'box-shadow 0.2s ease-in-out',
    ...getVariantStyles(),
  };
});

const getPaddingValue = (padding: string) => {
  switch (padding) {
    case 'none':
      return 0;
    case 'small':
      return 1;
    case 'medium':
      return 2;
    case 'large':
      return 3;
    default:
      return 2;
  }
};

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  variant = 'default',
  padding = 'medium',
  onClick,
  className,
  sx,
}) => {
  const cardVariant = variant === 'outlined' ? 'outlined' : 'elevation';

  return (
    <StyledCard
      variant={cardVariant}
      customVariant={variant}
      onClick={onClick}
      className={className}
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        ...sx
      }}
    >
      {(title || subtitle) && (
        <CardHeader
          title={
            title && (
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
            )
          }
          subheader={subtitle}
          sx={{ pb: title && !subtitle ? 1 : 2 }}
        />
      )}
      
      <CardContent sx={{ pt: title || subtitle ? 0 : undefined, p: getPaddingValue(padding) }}>
        <Box>{children}</Box>
      </CardContent>

      {actions && (
        <CardActions sx={{ px: getPaddingValue(padding), pb: getPaddingValue(padding) }}>
          {actions}
        </CardActions>
      )}
    </StyledCard>
  );
};