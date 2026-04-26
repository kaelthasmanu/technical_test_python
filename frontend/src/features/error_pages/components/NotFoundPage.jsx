import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import Layout from '../../../shared/components/Layout';

function NotFoundPage() {
  return (
    <Layout houseItem>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
        }}
      >
        {/* Icon + number row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WarningIcon sx={{ fontSize: 90, color: '#1565c0', mr: 1.5 }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '5rem', md: '7rem' },
              fontWeight: 700,
              color: '#1565c0',
              lineHeight: 1,
            }}
          >
            404
          </Typography>
        </Box>

        <Typography
          variant="h5"
          fontWeight={500}
          sx={{ color: 'text.secondary', letterSpacing: '0.02em' }}
        >
          Oops... Page Not Found!
        </Typography>
      </Box>
    </Layout>
  );
}

export default NotFoundPage;
