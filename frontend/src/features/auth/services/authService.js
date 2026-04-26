import axiosInstance from '../../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../../shared/api/endpoints';

/**
 * Authenticates a user.
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ token: string, expiration: string, userid: string, username: string }>}
 */
export const login = async (credentials) => {
  const { data } = await axiosInstance.post(ENDPOINTS.LOGIN, credentials);
  return data;
};

/**
 * Registers a new system user.
 * @param {{ username: string, email: string, password: string }} payload
 * @returns {Promise<{ status: string, message: string }>}
 */
export const register = async (payload) => {
  const { data } = await axiosInstance.post(ENDPOINTS.REGISTER, payload);
  return data;
};
