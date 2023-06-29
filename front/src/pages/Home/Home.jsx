import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import styles from './Home.module.scss';
import { Post } from '../../components/Post';
import { TagsBlock } from '../../components/TagsBlock';
import { CommentsBlock } from '../../components/CommentsBlock';
import { addPage, fetchPosts, fetchTags } from '../../slices/postsSlice';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { fetchComments } from '../../slices/commentsSlice';

export const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTags());
    dispatch(fetchPosts({ page: posts.page }));
    dispatch(fetchComments());
  }, [dispatch]);

  const { posts, tags } = useSelector((state) => state.rootReducer.posts);
  const { data: comments, status } = useSelector((state) => state.rootReducer.comments);
  const { data } = useSelector((state) => state.rootReducer.auth);

  const arePostsLoading = posts?.status === 'loading';
  const areTagsLoading = tags?.status === 'loading';
  const areCommentsLoading = status === 'loading';
  const onPagination = async () => {
    await dispatch(addPage());
    await dispatch(fetchPosts({ page: posts.page + 1 }));
  };
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label='basic tabs example'>
        <Tab label='Новые' />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(arePostsLoading ? [...Array(5)] : posts?.items?.data)?.map((item, index) =>
            arePostsLoading ? (
              <Post isLoading={true} key={index} />
            ) : (
              <Post
                id={item._id}
                title={item.title}
                imageUrl={item.imageUrl ? item.imageUrl : ''}
                user={item.user}
                createdAt={item.createdAt}
                viewsCount={item.viewsCount}
                commentsCount={item.comments.length}
                tags={item.tags}
                isEditable={data?.userData?._id === item.user._id}
              />
            ),
          )}
          {posts?.items?.total > 5 && posts?.items?.data.length() > 5 ? (
            <div className={styles.buttonContainer}>
              <Button variant='contained' onClick={onPagination}>
                Загрузить ещё
              </Button>
            </div>
          ) : null}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={areTagsLoading} />
          <CommentsBlock items={comments?.comments} isLoading={areCommentsLoading} isHomePage={true} />
        </Grid>
      </Grid>
    </>
  );
};
