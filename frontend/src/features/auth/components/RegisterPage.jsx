import React from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { useRegisterForm } from '../hooks/useRegisterForm';

const RegistroPage = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    submitError,
    formState: { errors, isSubmitting }
  } = useRegisterForm();

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 1 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="medium">
          Registro
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Nombre Usuario *"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Correo electrónico *"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Contraseña *"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isSubmitting}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
          sx={{
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#2979FF',
              borderRadius: '4px',
              mb: 2,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1C7AA0',
                boxShadow: 'none'
              }
            }}
          >
            {isSubmitting ? 'Registrando...' : 'REGISTRARME'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RegistroPage;
