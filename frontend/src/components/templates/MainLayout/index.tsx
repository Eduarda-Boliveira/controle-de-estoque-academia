import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title = 'Academia Personnalité Move' 
}) => {
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        {/* Banner Superior */}
        <Box sx={{
          background: 'linear-gradient(90deg, #ffa559, #f27043)',
          color: 'white',
          py: 4,
          textAlign: 'center',
          borderRadius: '10px',
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              mb: 1
            }}
          >
            <FitnessCenter sx={{ fontSize: 32 }} />
            {title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1rem' }}>
            Gerencie seu estoque de forma simples e eficiente
          </Typography>
        </Box>
        
        {children}
      </Container>
    </Box>
  );
};