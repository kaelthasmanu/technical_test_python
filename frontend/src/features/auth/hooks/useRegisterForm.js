import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { registerSchema } from '../schemas/authSchemas';
import { ROUTES } from '../../../constants/routes';

export function useRegisterForm() {
  const history = useHistory();
  const [submitError, setSubmitError] = useState('');

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });

  const onSubmit = async (data) => {
    setSubmitError('');

    try {
      await axiosInstance.post(ENDPOINTS.REGISTER, data);
      history.push(ROUTES.LOGIN, {
        successMessage: 'Registro completado correctamente. Ya puede iniciar sesión.'
      });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error al registrar');
    }
  };

  return {
    ...form,
    submitError,
    onSubmit
  };
}

export default useRegisterForm;
