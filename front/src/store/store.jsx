import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { postsSlice } from '../slices/postsSlice';
import { authSlice } from '../slices/authSlice';
import { commentsSlice } from '../slices/commentsSlice';

const rootReducer = combineReducers({
  posts: postsSlice.reducer,
  auth: authSlice.reducer,
  comments: commentsSlice.reducer,
});

export const store = configureStore({
  reducer: { rootReducer },
});
