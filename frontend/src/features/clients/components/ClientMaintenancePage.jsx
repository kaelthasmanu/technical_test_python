import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import Layout from '../../../shared/components/Layout';
import { useClientMaintenance } from '../hooks/useClientMaintenance';

function ClientMaintenancePage() {
  const {
    formData,
    interests,
    loading,
    errors,
    isValid,
    register,
    handleSubmit,
    handleImageChange,
    handleBack,
  } = useClientMaintenance();

  return (
    <Layout>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && (
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            mb: 4,
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={formData.imagen}
                sx={{ width: 80, height: 80, bgcolor: '#cfd8dc' }}
              >
                {!formData.imagen && <PhotoCamera />}
              </Avatar>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: -5,
                    right: -5,
                    bgcolor: '#fff',
                    boxShadow: 1,
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </label>
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#263238' }}>
              Mantenimiento de clientes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="contained"
              fullWidth={true}
              startIcon={<SaveIcon />}
              sx={{
                bgcolor: '#eceff1',
                color: '#546e7a',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#cfd8dc', boxShadow: 'none' },
              }}
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Guardar
            </Button>
            <Button
              variant="contained"
              fullWidth={true}
              startIcon={<ArrowBackIcon />}
              sx={{
                bgcolor: '#eceff1',
                color: '#546e7a',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#cfd8dc', boxShadow: 'none' },
              }}
              onClick={handleBack}
            >
              Regresar
            </Button>
          </Box>
        </Box>

        {/* Form Grid */}

        <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Identificación"
              {...register('identificacion')}
              error={!!errors.identificacion}
              helperText={errors.identificacion?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Nombre"
              {...register('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Apellidos"
              {...register('apellidos')}
              error={!!errors.apellidos}
              helperText={errors.apellidos?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              select
              label="Género"
              {...register('sexo')}
              error={!!errors.sexo}
              helperText={errors.sexo?.message}
              value={formData.sexo || ''}
            >
              <MenuItem value="F">Femenino</MenuItem>
              <MenuItem value="M">Masculino</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Fecha de nacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('fNacimiento')}
              error={!!errors.fNacimiento}
              helperText={errors.fNacimiento?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Fecha de afiliación"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('fAfiliacion')}
              error={!!errors.fAfiliacion}
              helperText={errors.fAfiliacion?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Teléfono Celular"
              {...register('celular')}
              error={!!errors.celular}
              helperText={errors.celular?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Teléfono Otro"
              {...register('otroTelefono')}
              error={!!errors.otroTelefono}
              helperText={errors.otroTelefono?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              select
              label="Interés"
              {...register('interesFK')}
              error={!!errors.interesFK}
              helperText={errors.interesFK?.message}
              value={formData.interesFK || ''}
            >
              <MenuItem value="">Seleccione</MenuItem>
              {interests.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Dirección"
              multiline
              rows={2}
              {...register('direccion')}
              error={!!errors.direccion}
              helperText={errors.direccion?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Reseña"
              multiline
              rows={2}
              {...register('resennaPersonal')}
              error={!!errors.resennaPersonal}
              helperText={errors.resennaPersonal?.message}
            />
          </Grid>
        </Grid>
        </form>
      </Paper>
      )}
    </Layout>
  );
}

export default ClientMaintenancePage;
