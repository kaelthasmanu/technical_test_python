import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import api from '../../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { useAuth } from './useAuth';
import { loginSchema } from '../schemas/authSchemas';

export function useLoginForm() {
  const history = useHistory();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    },
    mode: 'onBlur'
  });

  const { setValue } = form;

  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      setValue('username', savedUsername, { shouldValidate: true });
      setRememberMe(true);
    }
  }, [setValue]);

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/home');
    }
  }, [history, isAuthenticated]);

  useEffect(() => {
    const message = location.state?.successMessage;

    if (message) {
      setSuccessMessage(message);
      history.replace(location.pathname, {});
    }
  }, [history, location.pathname, location.state]);

  const onSubmit = async (data) => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('savedUsername', data.username);
      } else {
        localStorage.removeItem('savedUsername');
      }

      const response = await api.post(ENDPOINTS.LOGIN, data);
      const { token, userid, username, expiration } = response.data;

      login({ token, userid, username, expiration });
    } catch (err) {
      const status = err.response?.status;
      const apiMessage = err.response?.data?.message;

      if (status === 401 || status === 400) {
        setError('Usuario o contraseña incorrectos. Verifique sus credenciales e intente nuevamente.');
      } else {
        setError(apiMessage || 'No se pudo iniciar sesión. Inténtelo nuevamente en unos segundos.');
      }

      setLoading(false);
    }
  };

  return {
    ...form,
    error,
    loading,
    successMessage,
    onSubmit,
    rememberMe,
    setRememberMe
  };
}

export default useLoginForm;
