import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { defaultValues } from './defaultValues';
import { Navigate } from 'react-router-dom';
import { fetchReg } from '../../slices/authSlice';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';

export const Registration = () => {
  const dispatch = useDispatch();
  const { data, errorRegMessage, status } = useSelector((state) => state.rootReducer.auth);
  const { isAuth } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
  });

  const onSubmit = async (values) => {
    const dataReg = await dispatch(fetchReg(values));

    if (!dataReg) {
      throw new Error('Не удалось получить токен');
    }

    window.localStorage.setItem('token', dataReg.payload.token);
  };

  if (isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label='Полное имя'
          fullWidth
          error={Boolean(errors.name?.message)}
          helperText={errors.name?.message}
          {...register('name', { required: 'Укажите имя' })}
        />
        <TextField
          className={styles.field}
          label='E-Mail'
          type='email'
          fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
        />
        <TextField
          className={styles.field}
          label='Пароль'
          type='password'
          fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
        />
        <Button disabled={!isValid} type='submit' size='large' variant='contained' fullWidth>
          Зарегистрироваться
        </Button>
        {status === 'error' ? <ErrorMessage message={errorRegMessage} /> : null}
      </form>
    </Paper>
  );
};
