import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';

import styles from './Login.module.scss';
import { defaultValues } from './formDefaultValues';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuth } from '../../slices/authSlice';
import { Navigate } from 'react-router-dom';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const dispatch = useDispatch();
  const { errorMessage, status } = useSelector((state) => state.rootReducer.auth);
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
    const dataLogin = await dispatch(fetchAuth(values));

    if (!dataLogin) {
      throw new Error('Не удалось получить токен');
    }

    window.localStorage.setItem('token', dataLogin.payload.token);
  };

  if (isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label='E-Mail'
          type={'email'}
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label='Пароль'
          fullWidth
          type='password'
          error={Boolean(errors.password?.message)}
          helperText={Boolean(errors.password?.message)}
          {...register('password', { required: 'Укажите пароль' })}
        />
        <Button disabled={!isValid} type='submit' size='large' variant='contained' fullWidth>
          Войти
        </Button>
      </form>
      {status === 'error' ? <ErrorMessage message={errorMessage} /> : null}
    </Paper>
  );
};
