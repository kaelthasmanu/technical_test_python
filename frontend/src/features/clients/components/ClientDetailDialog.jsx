import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getClientById } from '../services/clientsService';

const DetailItem = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: '#90a4ae', fontWeight: 600, textTransform: 'uppercase' }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ color: '#263238', fontWeight: 500 }}>
      {value || '---'}
    </Typography>
  </Box>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const ClientDetailDialog = ({ open, onClose, clientId }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && clientId) {
      setLoading(true);
      getClientById(clientId)
        .then((data) => {
          setClient(data);
        })
        .catch((err) => {
          console.error("Error fetching client details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setClient(null);
    }
  }, [open, clientId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#eceff1', color: '#263238', fontWeight: 700, p: { xs: 2, sm: 3 } }}>
        Detalles del Cliente
      </DialogTitle>
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : client ? (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Sidebar / Avatar */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={client.imagen}
                sx={{ width: { xs: 120, sm: 150 }, height: { xs: 120, sm: 150 }, bgcolor: '#cfd8dc', mb: 2, boxShadow: 2 }}
              >
                {!client.imagen && <PhotoCamera sx={{ fontSize: { xs: 40, sm: 60 } }} />}
              </Avatar>
              <Typography variant="h6" align="center" sx={{ fontWeight: 700, color: '#263238', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {client.nombre} {client.apellidos}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                ID: {client.identificacion}
              </Typography>
            </Grid>

            {/* Details */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Género" value={client.sexo === 'M' ? 'Masculino' : client.sexo === 'F' ? 'Femenino' : client.sexo} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Interés" value={client.interesesId} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Fecha de Nacimiento" value={client.fNacimiento ? new Date(client.fNacimiento).toLocaleDateString() : ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Fecha de Afiliación" value={client.fAfiliacion ? new Date(client.fAfiliacion).toLocaleDateString() : ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Teléfono Celular" value={client.telefonoCelular} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Otro Teléfono" value={client.otroTelefono} />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="Dirección" value={client.direccion} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="Reseña Personal" value={client.resenaPersonal} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Typography align="center" sx={{ py: 4 }}>No se pudo cargar la información.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            bgcolor: '#546e7a', 
            '&:hover': { bgcolor: '#455a64' },
            textTransform: 'none'
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ClientDetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ClientDetailDialog;
