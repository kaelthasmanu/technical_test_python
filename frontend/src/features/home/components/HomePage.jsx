import React from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../../../shared/components/Layout';

function HomePage() {
  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh', // Centers comfortably in the layout main area
        }}
      >
        <Typography
          variant="h1"
          fontWeight={700}
          sx={{
            fontSize: { xs: '3rem', md: '6rem' },
            color: '#000',
            letterSpacing: '-0.02em',
          }}
        >
          Bienvenido
        </Typography>
      </Box>
    </Layout>
  );
}

export default HomePage;
