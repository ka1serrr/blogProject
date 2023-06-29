import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '../services/getData';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ page }) => {
  const { data } = await getData.request(`posts?page=${page}`);
  return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await getData.request('/tags');
  return data;
});

export const fetchDeletePost = createAsyncThunk('posts/deletePost', async (id) => {
  const { data } = await getData.request(`/posts/${id}`, 'DELETE');
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: 'loading',
    message: null,
    errorMessage: null,
    page: 1,
  },
  tags: {
    items: [],
    status: 'loading',
  },
};
export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPage: (state) => {
      state.posts.page += 1;
    },
  },
  extraReducers: {
    // Getting Posts
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
      state.posts.errorMessage = null;
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'idle';
      state.posts.errorMessage = null;
    },
    [fetchPosts.rejected]: (state, action) => {
      state.posts.items = [];
      state.posts.status = 'error';
      state.posts.errorMessage = action.error.message;
    },
    // Getting Tags
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'idle';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },
    // Delete Post
    [fetchDeletePost.pending]: (state) => {
      state.posts.message = null;
      state.posts.status = 'loading';
      state.posts.errorMessage = null;
    },
    [fetchDeletePost.fulfilled]: (state, action) => {
      state.posts.status = 'idle';
      state.posts.items = state.posts.items.filter((item) => item._id !== action.meta.arg);
      state.posts.message = action.payload;
      state.posts.errorMessage = null;
    },
    [fetchDeletePost.rejected]: (state, action) => {
      state.posts.message = null;
      state.posts.status = 'error';
      state.posts.errorMessage = action.error.message;
    },
  },
});

export const { addPage } = postsSlice.actions;
