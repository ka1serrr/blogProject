import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import { useMutation, useQuery } from 'react-query';
import { getData } from '../services/getData';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import ReactMarkdown from 'react-markdown';

export const FullPost = () => {
  const { id } = useParams();
  const { data: postData, isError, isLoading, refetch } = useQuery('post', () => getData.request(`/posts/${id}`));
  const {
    mutate,
    isLoading: isMutateLoading,
    isError: isMutateError,
    error: mutateError,
  } = useMutation('deleteComment', ({ id }) => getData.request(`comment/${id}`, 'DELETE', data), {
    onSuccess: () => refetch(),
  });
  const states = {
    isMutateError,
    isMutateLoading,
    mutateError,
  };

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  if (isError) {
    return <ErrorBoundary text='Ошибка при получении поста' />;
  }

  const { data } = postData;
  return (
    <>
      <Post
        id={data?._id}
        title={data?.title}
        imageUrl={data.imageUrl ? data?.imageUrl : ''}
        user={data?.user}
        createdAt={data?.createdAt}
        viewsCount={data?.viewsCount}
        commentsCount={3}
        tags={data?.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={data.comments} isLoading={isLoading} callback={mutate} states={states}>
        <Index postId={id} refetch={refetch} />
      </CommentsBlock>
    </>
  );
};
