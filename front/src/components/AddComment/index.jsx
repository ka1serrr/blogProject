import React, { useState } from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useMutation } from 'react-query';
import { getData } from '../../services/getData';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

export const Index = ({ postId, refetch }) => {
  const [text, setText] = useState('');
  const data = { text, postId };
  const { mutate, isLoading, isError, error } = useMutation(
    'sendPost',
    () => getData.request('/comment', 'POST', data),
    {
      onSuccess: () => {
        setText('');
        refetch();
      },
    },
  );

  return (
    <>
      <div className={styles.root}>
        {/*<Avatar classes={{ root: styles.avatar }} src='https://mui.com/static/images/avatar/5.jpg' />*/}
        <div className={styles.form}>
          <TextField
            label='Написать комментарий'
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant='outlined'
            maxRows={10}
            multiline
            fullWidth
          />
          <Button variant='contained' disabled={text.length === 0 || isLoading} onClick={mutate}>
            Отправить
          </Button>
        </div>
      </div>
      {isError ? <ErrorMessage message={error.message} /> : null}
    </>
  );
};
