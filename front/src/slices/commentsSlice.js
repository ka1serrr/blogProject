import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getData } from '../services/getData';

export const fetchComments = createAsyncThunk('comments/fetchCommentsData', async () => {
  try {
    const { data } = await getData.request('/comment');
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
});

const initialState = {
  data: null,
  status: 'loading',
  errorMessage: null,
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchComments.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
      state.errorMessage = null;
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'idle';
      state.errorMessage = null;
    },
    [fetchComments.rejected]: (state, action) => {
      state.data = null;
      state.status = 'error';
      state.errorMessage = action.error.message;
    },
  },
});
