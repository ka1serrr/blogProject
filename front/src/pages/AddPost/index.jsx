import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { getData } from '../../services/getData';
import { useMutation, useQuery } from 'react-query';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { Post } from '../../components';

export const AddPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuth } = useAuth();
  const { status } = useSelector((state) => state.rootReducer.auth);

  const isEditing = Boolean(id);

  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const inputFilRef = useRef(null);

  const { mutate, error, isError, data, isSuccess, isLoading } = useMutation(
    'sendPhoto',
    ({ url, type, data }) => getData.request(url, type, data),
    { onSuccess: (data) => setImageUrl(data?.data?.url) },
  );

  const {
    mutate: mutatePost,
    error: errorPost,
    isError: isErrorPost,
    data: dataPost,
    isLoading: isLoadingPost,
  } = useMutation('sendPost', ({ url, type, data }) => getData.request(url, type, data));

  const {
    mutate: patchPost,
    isLoading: isPatchLoading,
    isError: isPatchError,
    error: patchError,
    data: patchData,
  } = useMutation('patchPost', ({ url, type, data }) => getData.request(url, type, data));

  const {
    data: postData,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
    isSuccess: isPatchSuccess,
  } = useQuery('getPost', () => getData.request(`/posts/${id}`), {
    enabled: !!id,
    onSuccess: ({ data }) => {
      setTitle(data?.title);
      setText(data?.text);
      setTags(data?.tags.join(', '));
      if (data?.imageUrl) {
        setImageUrl(data?.imageUrl);
      }
    },
    refetchOnWindowFocus: false,
  });

  const handleChangeFile = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      await mutate({ url: '/uploads', type: 'POST', data: formData });
    }
  };

  const isSubmitDisabled = (!text && !title) || isLoading || isLoadingPost;

  const onClickRemoveImage = (event) => {
    setImageUrl('');
    inputFilRef.current.value = null;
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    const fields = {
      text,
      title,
      tags: tags.split(', '),
      imageUrl,
    };

    isEditing
      ? await patchPost({ url: `/posts/${id}`, type: 'PATCH', data: fields })
      : await mutatePost({ url: '/posts', type: 'POST', data: fields });

    const postId = dataPost?.data?._id;

    const _id = isEditing ? id : postId;
    console.log(isPatchSuccess);
    setTimeout(() => navigate(`/posts/${_id}`), 0);
    console.log(isPatchSuccess);
  };

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (status === 'loading' || isPostLoading || isPatchLoading) {
    return <Post isLoading={true} />;
  }

  if (!isAuth) {
    return <Navigate to='/login' />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFilRef.current.click()} variant='outlined' size='large' className={styles.sendButton}>
        Загрузить превью
      </Button>
      <input type='file' onChange={(e) => handleChangeFile(e)} hidden ref={inputFilRef} />

      {imageUrl && (
        <>
          <Button variant='contained' color='error' onClick={onClickRemoveImage} className={styles.deleteButton}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt='Uploaded' />
        </>
      )}

      {isPostLoading ? <Post isLoading={isPostLoading} /> : null}
      {isError || isErrorPost || isPatchError ? <ErrorMessage message={isPatchError} /> : null}
      {isLoading ? <div>Loading... </div> : null}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Заголовок статьи...'
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant='standard'
        placeholder='Тэги через запятую'
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} disabled={isSubmitDisabled} size='large' variant='contained'>
          {isEditing ? 'Редактировать' : 'Опубликовать'}
        </Button>
        <a href='/'>
          <Button size='large'>Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
