import axiosInstance from '../../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../../shared/api/endpoints';

/**
 * Fetches the filtered client list.
 * @param {{ identificacion?: string, nombre?: string, usuarioId: string }} filters
 * @returns {Promise<Array<{ id: string, identificacion: string, nombre: string, apellidos: string }>>}
 */
export const getClients = async (filters) => {
  const { data } = await axiosInstance.post(ENDPOINTS.CLIENTS_LIST, filters);
  return data;
};

/**
 * Fetches a single client by ID.
 * @param {string} id
 */
export const getClientById = async (id) => {
  const { data } = await axiosInstance.get(ENDPOINTS.CLIENT_GET(id));
  return data;
};

/**
 * Creates a new client.
 * @param {object} payload
 */
export const createClient = async (payload) => {
  const { data } = await axiosInstance.post(ENDPOINTS.CLIENT_CREATE, payload);
  console.log(data);
  return data;
};

/**
 * Updates an existing client.
 * @param {object} payload
 */
export const updateClient = async (payload) => {
  const { data } = await axiosInstance.post(ENDPOINTS.CLIENT_UPDATE, payload);
  return data;
};

/**
 * Deletes a client by ID.
 * @param {string} id
 */
export const deleteClient = async (id) => {
  const { data } = await axiosInstance.delete(ENDPOINTS.CLIENT_DELETE(id));
  return data;
};

/**
 * Fetches the interests dropdown list.
 */
export const getInterests = async () => {
  const { data } = await axiosInstance.get(ENDPOINTS.INTERESTS_LIST);
  return data;
};
