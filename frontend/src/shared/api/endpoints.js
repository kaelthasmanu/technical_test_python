const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/';

export const API_BASE_URL = BASE_URL;

export const ENDPOINTS = {
  // Auth
  LOGIN: '/api/Authenticate/login',
  REGISTER: '/api/Authenticate/register',

  // Clients
  CLIENTS_LIST: '/api/Cliente/Listado',
  CLIENT_GET: (id) => `/api/Cliente/Obtener/${id}`,
  CLIENT_CREATE: '/api/Cliente/Crear',
  CLIENT_UPDATE: '/api/Cliente/Actualizar',
  CLIENT_DELETE: (id) => `/api/Cliente/Eliminar/${id}`,

  // Interests
  INTERESTS_LIST: '/api/Intereses/Listado',
};
