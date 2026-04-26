import React, { useState } from 'react'
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Layout from '../../../shared/components/Layout';
import { useClients } from '../hooks/useClients';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ClientDetailDialog from './ClientDetailDialog';

function ActionMenu({ client, onDetail, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
        <IconButton size="small" sx={{ mr: 1 }} onClick={() => onDetail(client)}>
          <VisibilityIcon sx={{ fontSize: 20, color: '#546e7a' }} />
        </IconButton>
        <IconButton size="small" sx={{ mr: 1 }} onClick={() => onEdit(client.id)}>
          <EditIcon sx={{ fontSize: 20, color: '#546e7a' }} />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(client)}>
          <DeleteIcon sx={{ fontSize: 20, color: '#546e7a' }} />
        </IconButton>
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <IconButton onClick={handleClick}>
          <MoreVertIcon sx={{ color: '#546e7a' }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          disableScrollLock={true}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              onDetail(client);
            }}
          >
            <VisibilityIcon sx={{ fontSize: 20, color: '#546e7a', mr: 1 }} /> Ver Detalle
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              onEdit(client.id);
            }}
          >
            <EditIcon sx={{ fontSize: 20, color: '#546e7a', mr: 1 }} /> Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              onDelete(client);
            }}
          >
            <DeleteIcon sx={{ fontSize: 20, color: '#546e7a', mr: 1 }} /> Eliminar
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}

ActionMenu.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    identificacion: PropTypes.string,
    nombre: PropTypes.string,
    apellidos: PropTypes.string,
  }).isRequired,
  onDetail: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const ClientsTable = React.memo(function ClientsTable({ clients, loading, onDetail, onEdit, onDelete }) {
  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 4 }}>
      <TableContainer
        component={Box}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          overflowX: 'auto',
          maxWidth: '100%',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#cfd8dc', borderRadius: 3 }
        }}
      >
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#2979ff' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700, py: 1.5 }}>Identificación</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, py: 1.5 }}>Nombre completo</TableCell>
              <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, py: 1.5, pr: 4 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  Cargando clientes...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  No se encontraron clientes. Pulse la lupa para buscar.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: '#78909c', py: 2 }}>{client.identificacion}</TableCell>
                  <TableCell sx={{ color: '#78909c', py: 2 }}>{`${client.nombre} ${client.apellidos || ''}`}</TableCell>
                  <TableCell align="right" sx={{ py: 1, pr: 2 }}>
                    <ActionMenu
                      client={client}
                      onDetail={onDetail}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

function ClientsPage() {
  const {
    clients,
    filters,
    deleteId,
    clientToDelete,
    selectedClient,
    loading,
    handleSearch,
    handleEdit,
    handleAdd,
    handleBack,
    handleDeleteClick,
    confirmDelete,
    closeDeleteDialog,
    handleDetailClick,
    closeDetailDialog,
  } = useClients();
  const [searchValues, setSearchValues] = useState(filters);

  const updateSearchValue = (field) => (event) => {
    setSearchValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSearch = () => handleSearch(searchValues);

  return (
    <Layout>
      <Paper elevation={1} sx={{ p: 0, borderRadius: 1, overflow: 'hidden' }}>
        {/* Header Section */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: '#263238', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
          >
            Consulta de clientes
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="contained"
              fullWidth={true}
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#eceff1',
                color: '#546e7a',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#cfd8dc', boxShadow: 'none' },
              }}
              onClick={handleAdd}
            >
              Agregar
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

        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
          {/* Search Section */}
          <Box
            sx={{
              mt: 3,
              mb: 0,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 2,
            }}
          >
            <TextField
              label="Nombre"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ flexGrow: 1 }}
              value={searchValues.nombre}
              onChange={updateSearchValue('nombre')}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
            <TextField
              label="Identificación"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ flexGrow: 1 }}
              value={searchValues.identificacion}
              onChange={updateSearchValue('identificacion')}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
            <Button
              variant="outlined"
              onClick={onSearch}
              disabled={loading}
              startIcon={<SearchIcon />}
              sx={{
                borderColor: '#b0bec5',
                color: '#546e7a',
                minWidth: { xs: '100%', md: 'auto' },
                py: 1,
              }}
            >
              Buscar
            </Button>
          </Box>
        </Box>

        <Divider />

        <ClientsTable
          clients={clients}
          loading={loading}
          onDetail={handleDetailClick}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </Paper>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog 
        open={Boolean(deleteId)}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        itemName={clientToDelete}
      />

      {/* Detail Modal */}
      <ClientDetailDialog
        open={Boolean(selectedClient)}
        onClose={closeDetailDialog}
        clientId={selectedClient?.id}
      />
    </Layout>
  );
}

export default ClientsPage;
