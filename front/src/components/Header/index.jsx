import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';

export const Header = () => {
  const { isAuth } = useAuth();
  const dispatch = useDispatch();

  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
  };

  return (
    <div className={styles.root}>
      <Container maxWidth='lg'>
        <div className={styles.inner}>
          <Link className={styles.logo} to='/'>
            <div>MY BLOG</div>
          </Link>

          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to='add-post'>
                  <Button variant='contained'>Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant='contained' color='error'>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to='/login'>
                  <Button variant='outlined'>Войти</Button>
                </Link>
                <Link to='/register'>
                  <Button variant='contained'>Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
