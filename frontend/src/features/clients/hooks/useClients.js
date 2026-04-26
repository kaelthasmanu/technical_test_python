import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useNotification } from '../../../shared/context/NotificationContext';
import { useAuth } from '../../auth/hooks/useAuth';
import * as clientsService from '../services/clientsService';

export const useClients = () => {
  const history = useHistory();
  const notification = useNotification();
  const { userId } = useAuth();

  // State for search filters
  const [filters, setFilters] = useState({ nombre: '', identificacion: '' });
  
  // State for delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [clientToDelete, setClientToDelete] = useState('');

  // State for detail modal
  const [selectedClient, setSelectedClient] = useState(null);

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const applyFilters = useCallback((clientsList, { nombre, identificacion }) => {
    const normalizedName = nombre.trim().toLowerCase();
    const normalizedId = identificacion.trim().toLowerCase();

    return clientsList.filter((client) => {
      const clientName = `${client.nombre || ''} ${client.apellidos || ''}`.trim().toLowerCase();
      const clientId = String(client.identificacion || '').trim().toLowerCase();

      const matchesName = !normalizedName || clientName.includes(normalizedName);
      const matchesId = !normalizedId || clientId.includes(normalizedId);

      return matchesName && matchesId;
    });
  }, []);

  const handleSearch = useCallback(async (searchFilters = filters) => {
    setLoading(true);
    try {
      const results = await clientsService.getClients({
        ...searchFilters,
        usuarioId: userId,
      });
      setFilters(searchFilters);
      setClients(applyFilters(results, searchFilters));
    } catch (err) {
      notification.error('Hubo un inconveniente con la transacción.');
    } finally {
      setLoading(false);
    }
  }, [filters, userId, notification, applyFilters]);

  useEffect(() => {
    handleSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = useCallback((id) => {
    history.push(`${ROUTES.CLIENT_MAINTENANCE}/${id}`);
  }, [history]);

  const handleAdd = useCallback(() => {
    history.push(ROUTES.CLIENT_MAINTENANCE);
  }, [history]);

  const handleBack = useCallback(() => {
    history.push(ROUTES.HOME);
  }, [history]);

  const handleDeleteClick = useCallback((client) => {
    setDeleteId(client.id);
    setClientToDelete(client.nombre);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteId(null);
    setClientToDelete('');
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await clientsService.deleteClient(deleteId);
      setClients((currentClients) => currentClients.filter((c) => c.id !== deleteId));
      notification.success('El proceso se realizó correctamente.');
    } catch (err) {
      notification.error('Hubo un inconveniente con la transacción.');
    } finally {
      closeDeleteDialog();
    }
  }, [deleteId, closeDeleteDialog, notification]);

  const handleDetailClick = useCallback((client) => {
    setSelectedClient(client);
  }, []);

  const closeDetailDialog = useCallback(() => {
    setSelectedClient(null);
  }, []);

  return {
    clients,
    filters,
    setFilters,
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
  };
};