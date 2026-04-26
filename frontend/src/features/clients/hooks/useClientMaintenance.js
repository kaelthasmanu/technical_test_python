import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '../../../constants/routes';
import { useNotification } from '../../../shared/context/NotificationContext';
import { useAuth } from '../../auth/hooks/useAuth';
import { getClientById, createClient, updateClient, getInterests } from '../services/clientsService';
import { clientSchema } from '../schemas/clientSchema';

export const useClientMaintenance = () => {
  const history = useHistory();
  const notification = useNotification();
  const { userId } = useAuth();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nombre: '',
      apellidos: '',
      identificacion: '',
      celular: '',
      otroTelefono: '',
      direccion: '',
      fNacimiento: '',
      fAfiliacion: '',
      sexo: '',
      resennaPersonal: '',
      imagen: '',
      interesFK: '',
    },
    mode: 'onBlur',
  });

  const formData = watch();

  // Load interests dropdown on mount
  useEffect(() => {
    getInterests()
      .then(setInterests)
      .catch(() => {});
  }, []);

  // Load client data when editing
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getClientById(id)
      .then((data) => {
        reset({
          nombre: data.nombre || '',
          apellidos: data.apellidos || '',
          identificacion: data.identificacion || '',
          celular: data.telefonoCelular || data.celular || '',
          otroTelefono: data.otroTelefono || '',
          direccion: data.direccion || '',
          fNacimiento: data.fNacimiento ? data.fNacimiento.split('T')[0] : '',
          fAfiliacion: data.fAfiliacion ? data.fAfiliacion.split('T')[0] : '',
          sexo: data.sexo || '',
          resennaPersonal: data.resenaPersonal || data.resennaPersonal || '',
          imagen: data.imagen || '',
          interesFK: data.interesesId || data.interesFK || '',
        });
      })
      .catch(() => notification.error('Error al cargar los datos del cliente.'))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('imagen', reader.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onFormSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        fNacimiento: new Date(data.fNacimiento).toISOString(),
        fAfiliacion: new Date(data.fAfiliacion).toISOString(),
        usuarioId: userId,
      };

      if (isEdit) {
        await updateClient({ id, ...payload });
      } else {
        await createClient(payload);
      }

      notification.success('El proceso se realizó correctamente.');
      history.push(ROUTES.CLIENTS);
    } catch (err) {
      notification.error('Hubo un inconveniente con la transacción.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    history.push(ROUTES.CLIENTS);
  };

  return {
    formData,
    isEdit,
    interests,
    loading,
    errors,
    isValid,
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    handleImageChange,
    handleBack,
    onManualChange: (name, value) => setValue(name, value, { shouldValidate: true }),
  };
};